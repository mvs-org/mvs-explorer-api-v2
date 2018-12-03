import * as mongoose from 'mongoose';
import { TransactionSchema } from '../models/transaction.model';
import { Request, Response } from 'express';
import { ResponseSuccess, ResponseError } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema);

export class TransactionController {

  public getTransactions(req: Request, res: Response) {

    const last_known = req.query.last_known
    const min_time = req.query.min_time
    const max_time = req.query.max_time

    let output = {}
    output['rawtx'] = (req.query.raw) ? 1 : 0
    Transaction.find({
      ...(last_known && { _id: { $lt: last_known } }),
      ...(min_time  && { confirmed_at: { $gte: min_time  } }),
      ...(max_time && { confirmed_at: { $lte: max_time } }),
      orphan: 0
    }, output)
      .sort({ height: -1 })
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result));
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError("ERR_LIST_TRANSACTIONS"));
      })
  }

}

