import * as mongoose from 'mongoose';
import { TransactionSchema } from '../models/transaction.model';
import { Request, Response } from 'express';
import { ResponseSuccess, ResponseError } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema);

export class TransactionController {

  public getTransactions(req: Request, res: Response) {

    const last_known = req.query.last_known
    const from_date = req.query.from_date
    const to_date = req.query.to_date

    let output = {}
    output['rawtx'] = (req.query.raw) ? 1 : 0
    Transaction.find({
      ...(last_known && { _id: { $lt: last_known } }),
      ...(from_date && { _confirmed_at: { $gte: from_date } }),
      ...(to_date && { _confirmed_at: { $lte: to_date } }),
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

