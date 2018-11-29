import * as mongoose from 'mongoose';
import { OutputSchema } from '../models/output.model';
import { Request, Response } from 'express';

const Output = mongoose.model('Output', OutputSchema);

export class MITController {

  public getMITs(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    Output.find({
      ...(last_known && { _id: { $lt: last_known } }),
      ['attachment.type']: "mit",
      orphaned_at: 0,
    })
      .sort({
        ...(sort_by == "symbol" && { ['attachment.symbol']: 1 }),
        ...(sort_by !== "symbol" && { height: -1 })
      })
      .limit(20)
      .then((result) => {
        res.json(result);
      }).catch((err) => {
        console.error(err)
        res.send(err);
      })
  }

}
