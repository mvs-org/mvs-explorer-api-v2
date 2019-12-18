import { ok } from 'assert'
import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { TransactionSchema } from '../models/transaction.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'
import { OutputSchema } from '../models/output.model'

const Transaction = mongoose.model('Tx', TransactionSchema)
const Output = mongoose.model('Output', OutputSchema)

declare function emit(k, v);

export class AddressController {

  public async getPublicKey(req: Request, res: Response) {
    const address: string = req.params.address

    try {
      ok(address, 'ERR_ADDRESS_MISSING')
      ok(/^[A-Za-z0-9]{34}$/.test(address), 'ERR_INVALID_ADDRESS')
      const script = await Transaction.find({ 'inputs.address': address }, { '_id': 0, 'inputs.$': 1 }).limit(1)
        .then((result: mongoose.MongooseDocument[]) => {
          if (!result.length) {
            throw Error('ERR_NOT_FOUND')
          }
          return result[0].toObject().inputs[0].script
        })
      const match = script.match(/\ (304[a-f0-9]+)\ /)
      if (match == null) {
        throw Error('ERR_NO_PUBLIC_KEY_IN_SCRIPT')
      }
      const publickey = match[1]
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
      return res.json(new ResponseSuccess({
        publickey,
      }))
    } catch (err) {
      switch (err.message) {
        case 'ERR_INVALID_ADDRESS':
        case 'ERR_ADDRESS_MISSING':
        case 'ERR_NOT_FOUND':
        case 'ERR_NO_PUBLIC_KEY_IN_SCRIPT':
          return res.status(400).json(new ResponseError(err.message))
      }
      console.error(err)
      res.status(500).json(new ResponseError('ERR_CANT_FIND_PUBLIC_KEY'))
    }
  }

  public async getBalanceDiff(req: Request, res: Response) {

    let addresses: string | string[] = req.query.addresses

    const fromHeight = parseInt(req.query.fromHeight)
    const toHeight = parseInt(req.query.toHeight)

    if (typeof addresses === 'string') {
      addresses = [addresses]
    }

    const o: any = {}
    o.reduce = `function(symbol, values){ return Array.sum(values)}`

    Output.mapReduce({
      map: function () {
        if (this.attachment.type === 'asset-transfer' && this.attachment.symbol !== 'ETP') {
          if (this.spent_tx) {
            if (this.height <= fromHeight) {
              emit('DIFF-' + this.attachment.symbol, -this.attachment.quantity);
            }
          } else {
            emit(this.attachment.symbol, this.attachment.quantity)
            if (this.height > fromHeight) {
              emit('DIFF-' + this.attachment.symbol, this.attachment.quantity);
            }
          }
        }
        if (this.value) {
          if (this.spent_tx) {
            if (this.height <= fromHeight) {
              emit('DIFF-ETP', -this.value);
            }
          } else {
            emit('ETP', this.value);
            if (this.height > fromHeight) {
              emit('DIFF-ETP', this.value);
            }
          }
        }
      },
      ...o,
      query: {
        address: { $in: addresses },
        height: { $lt: toHeight },
        $or: [
          {
            spent_height: { $gte: fromHeight, $lt: toHeight }
          },
          {
            spent_tx: 0
          }
        ],
        orphaned_at: 0
      },
      scope: {
        fromHeight,
      },
      out: { inline: 1 }
    }
    ).then((mapResult) => {
      const result = {
        diff: {},
        final: {},
      }
      const mstSymbolRegex = /^DIFF\-(.+)$/
      mapResult.results.forEach(record => {
        if(mstSymbolRegex.test(record._id)){
          result.diff[record._id.match(mstSymbolRegex)[1]]=record.value
        } else {
          result.final[record._id]=record.value
        }
      })
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
      res.json(new ResponseSuccess(result))
    }).catch((err) => {
      console.error(err)
      res.status(400).json(new ResponseError('ERR_GET_BALANCE_DIFF'))
    })
  }


}
