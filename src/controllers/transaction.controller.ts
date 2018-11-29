import * as mongoose from 'mongoose';
import { TransactionSchema } from '../models/transaction.model';
import { Request, Response } from 'express';
import { ResponseSuccess, ResponseError } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema);

export class TransactionController {

  public getTransactions(req: Request, res: Response) {

    const last_known = req.query.last_known
    Transaction.find({ ...( last_known && {_id: { $lt: last_known }}), orphan: 0 })
      .sort({height: -1})
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result));
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError("ERR_LIST_TRANSACTIONS"));
      })
  }

}

