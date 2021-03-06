import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { AvatarSchema } from '../models/avatar.model'
import { OutputSchema } from '../models/output.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Avatar = mongoose.model('Avatar', AvatarSchema)
const Output = mongoose.model('Output', OutputSchema)

export class AvatarController {

  public info(req: Request, res: Response) {
    Avatar.find({})
      .count()
      .then((count: number) => {
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600')
        res.json(new ResponseSuccess({
          count,
        }))
      }).catch((err: Error) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_AVATAR_INFO'))
      })
  }

  public getAvatars(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    Avatar.find({ ...(last_known && { _id: { $lt: last_known } }) })
      .sort({
        ...(sort_by === 'symbol' && { symbol: 1 }),
        ...(sort_by !== 'symbol' && { _id: -1 }),
      })
      .limit(20)
      .then((result) => {
        if (last_known) {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        }
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_AVATARS'))
      })
  }

  public getAvatarAvailability(req: Request, res: Response) {

    const symbol = req.params.symbol
    const regex = new RegExp(`^${symbol}$`, "i");

    Avatar.findOne({
      symbol: regex,
    })
    .then((result) => {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
      res.json(new ResponseSuccess(result == null ? true : false))
    }).catch((err) => {
      console.error(err)
      res.status(400).json(new ResponseError('ERR_GET_AVATAR_AVAILABILITY'))
    })
  }

  public getAvatarAssets(req: Request, res: Response) {

    const symbol = req.params.symbol

    Output.find({
      'attachment.type': 'asset-issue',
      'attachment.to_did': symbol
    })
    .then((result) => {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
      res.json(new ResponseSuccess(result))
    }).catch((err) => {
      console.error(err)
      res.status(400).json(new ResponseError('ERR_GET_AVATAR_ASSETS'))
    })
  }

}
