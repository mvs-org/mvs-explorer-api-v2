import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'
import { OutputSchema } from '../models/output.model'

const Output = mongoose.model('Output', OutputSchema)

export class OutputController {

  public getUtxo(req: Request, res: Response) {
    const addresses = req.query.addresses
    if (!addresses) {
      return res.status(400).json(new ResponseError('ERR_ADDRESSES_UNDEFINED'))
    }

    const query: any = { orphaned_at: 0 }

    query.$or = [{
      address: addresses,
    }]

    query.value = { $gt: 10000 }
    query['attachment.type'] = 'etp'
    query.locked_height_range = 0
    query.spent_tx = 0

    const outputFormat = {
      _id: 0,
      address: 1,
      attachment: 1,
      height: 1,
      index: 1,
      locked_height_range: 1,
      script: 1,
      tx: 1,
      value: 1,
    }

    Output.find(query, outputFormat)
      .limit(1)
      .then((result) => {
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_FIND_UTXO'))
      })
  }
}
