import { ok } from 'assert'
import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'
import { OutputSchema } from '../models/output.model'

const UTXO_LIMIT_COUNT_MAX = 256
const UTXO_LIMIT_COUNT_DEFAULT = 1
const UTXO_VALUE_MINIMUM = process.env.UTXO_VALUE_MINIMUM ? parseInt(process.env.UTXO_MINIMUM_VALUE, 10) : 10000
const UTXO_TARGET_DEFAULT = process.env.UTXO_TARGET_DEFAULT ? parseInt(process.env.UTXO_TARGET_DEFAULT, 10) : 0
const UTXO_SORT_DEFAULT = process.env.UTXO_SORT_DEFAULT ? process.env.UTXO_SORT_DEFAULT : 'old'

const Output = mongoose.model('Output', OutputSchema)

const outputFormat = {
  _id: 0,
  address: 1,
  attachment: 1,
  height: 1,
  index: 1,
  locked_height_range: 1,
  script: 1,
  spent_height: 1,
  spent_index: 1,
  spent_tx: 1,
  tx: 1,
  value: 1,
}

export interface IUtxoSortOption {
  height?: 1 | -1
  value?: 1 | -1
}

export class OutputController {

  public async getOutput(req: Request, res: Response) {

    const txid = req.params.txid
    const index = parseInt(req.params.index, 10)
    try {
      const output = await Output.findOne({ tx: txid, index }, outputFormat).lean()
      if (output == null) {
        throw Error('ERR_OUTPUT_NOT_FOUND')
      }
      let spent = {
        tx: output.spent_tx,
        index: output.spent_index,
        height: output.spent_height,
      }
      output.spent = output.spent_tx ? spent : null
      delete output.spent_tx
      delete output.spent_index
      delete output.spent_height
      res.json(new ResponseSuccess(output))
    } catch (error) {
      switch (error.message) {
        case 'ERR_OUTPUT_NOT_FOUND':
          return res.status(404).send(new ResponseError(error.message))
      }
      console.error(error)
      return res.status(500).send(new ResponseError('ERR_INTERNAL_SERVER_ERROR'))
    }
  }

  public getUtxo(req: Request, res: Response) {
    const addresses = req.query.addresses
    const sort = req.query.sort || UTXO_SORT_DEFAULT
    const maxHeight = parseInt(req.query.maxheight, 10) || 0
    const target = req.query.target ? parseInt(req.query.target, 10) : UTXO_TARGET_DEFAULT
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : UTXO_LIMIT_COUNT_DEFAULT
    const symbol = req.query.symbol ? req.query.symbol.toUpperCase().replace(/\./g, '_') : 'ETP'

    const sortOptions: IUtxoSortOption = {}
    try {
      ok(limit >= 0, 'ERR_INVALID_LIMIT')
      ok(limit <= UTXO_LIMIT_COUNT_MAX, 'ERR_INVALID_LIMIT')
      ok(addresses, 'ERR_ADDRESSES_UNDEFINED')
      switch (sort) {
        case 'new':
          sortOptions.height = -1
          break
        case 'old':
          sortOptions.height = 1
          break
        case 'high':
          if(symbol == 'ETP') {
            sortOptions.value = -1
          } else {
            sortOptions['attachment.quantity'] = -1
          }
          break
        case 'low':
          if(symbol == 'ETP') {
            sortOptions.value = 1
          } else {
            sortOptions['attachment.quantity'] = 1
          }
          break
        default:
          throw Error('ERR_INVALID_SORT_OPTION')
      }
    } catch (error) {
      console.log(error.message)
      return res.status(400).json(new ResponseError(error.message))
    }

    const query: any = { orphaned_at: 0 }

    query.$or = [{
      address: addresses,
    }]

    if(symbol == 'ETP') {
      query.value = { $gt: UTXO_VALUE_MINIMUM }
      query['attachment.type'] = 'etp'
      query.locked_height_range = 0
      
    } else {
      query['attachment.symbol'] = symbol
      query['attachment.quantity'] = { $gt: UTXO_VALUE_MINIMUM }
      query.attenuation_model_param = null
    }

    query.spent_tx = 0

    if (maxHeight > 0) {
      query.height = { $gt: maxHeight }
    }

    Output.find(query, outputFormat)
      .sort(sortOptions)
      .limit(target ? UTXO_LIMIT_COUNT_MAX : limit)
      .then((resultSet: mongoose.Document[]) => {
        if (target === 0 && limit === 0) {
          return res.json(new ResponseSuccess(resultSet))
        }
        if (target > 0) {
          const selection = []
          let tmpTarget = 0
          for (const utxo of resultSet) {
            selection.push(utxo.toObject())
            tmpTarget += symbol == 'ETP' ? utxo.toObject().value : utxo.toObject().attachment.get('quantity')
            if (tmpTarget >= target) {
              return res.json(new ResponseSuccess(selection))
            }
          }
          return res.status(400).json(new ResponseError('ERR_INSUFFICIENT_UTXO'))
        }
        return res.json(new ResponseSuccess(resultSet))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_FIND_UTXO'))
      })
  }
}
