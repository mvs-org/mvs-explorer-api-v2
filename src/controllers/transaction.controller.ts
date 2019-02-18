import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { TransactionSchema } from '../models/transaction.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema)

export class TransactionController {

  public getTransactions(req: Request, res: Response) {

    const last_known = req.query.last_known
    const min_time = req.query.min_time
    const max_time = req.query.max_time
    const address = req.query.address

    const query: any = { orphan: 0 }

    if (last_known) {
      query._id = { $lt: last_known }
    }
    if (min_time || max_time) {
      query.confirmed_at = {}
      if (min_time) {
        query.confirmed_at.$gte = min_time
      }
      if (max_time) {
        query.confirmed_at.$lte = max_time
      }
    }

    if (address) {
      query.$or = [{
        'inputs.address': address,
      },
      {
        'outputs.address': address,
      }]
    }

    const output = {
      inputs: {
        $slice: 6,
      },
      rawtx: (req.query.raw) ? 1 : 0,
    }
    Transaction.find(query, output)
      .sort({ height: -1 })
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_TRANSACTIONS'))
      })
  }
}
