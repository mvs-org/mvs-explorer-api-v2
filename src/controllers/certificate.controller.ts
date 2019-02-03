import * as mongoose from 'mongoose';
import { OutputSchema } from '../models/output.model';
import { Request, Response } from 'express';
import { ResponseSuccess, ResponseError } from './../helpers/message.helper'

const Output = mongoose.model('Output', OutputSchema);

export class CertificateController {

  public info(req: Request, res: Response) {
    Output.find({
      ['attachment.type']: "asset-cert",
      orphaned_at: 0,
      spent_tx: 0,
    })
      .count()
      .then((count: number) => {
        res.json(new ResponseSuccess({
          count: count,
        }));
      }).catch((err: Error) => {
        console.error(err)
        res.status(400).json(new ResponseError("ERR_LIST_MIT"));
      })
  }

  public getCertificates(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    Output.find({
      ...(last_known && { _id: { $lt: last_known } }),
      ['attachment.type']: "asset-cert",
      orphaned_at: 0,
      spent_tx: 0,
    })
      .sort({
        ...(sort_by == "symbol" && { ['attachment.symbol']: 1 }),
        ...(sort_by !== "symbol" && { height: -1 })
      })
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result));
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError("ERR_LIST_CERTIFICATES"));
      })
  }

}
