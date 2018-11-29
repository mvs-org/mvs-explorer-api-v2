import * as mongoose from 'mongoose';
import { AvatarSchema } from '../models/avatar.model';
import { Request, Response } from 'express';
import { ResponseSuccess, ResponseError } from './../helpers/message.helper'

const Avatar = mongoose.model('Avatar', AvatarSchema);

export class AvatarController {

  public getAvatars(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    Avatar.find({ ...(last_known && { _id: { $lt: last_known } }) })
      .sort({
        ...(sort_by == "symbol" && { symbol: 1 }),
        ...(sort_by !== "symbol" && { height: -1 })
      })
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result));
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError("ERR_LIST_AVATARS"));
      })
  }

}
