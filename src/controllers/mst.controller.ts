import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { MSTSchema } from '../models/mst.model'
import { ResponseError, ResponseSuccess  } from './../helpers/message.helper'

const Asset = mongoose.model('Asset', MSTSchema)

export const MST_BLACKLIST = ['ETP']
export const MST_SPECIAL = ['PARCELX.GPX', 'RIGHTBTC.RT', 'MVS.ZGC', 'MVS.ZDC']

export class MSTController {

  public info(req: Request, res: Response) {
    Asset.find()
      .count()
      .then((count: number) => {
        res.json(new ResponseSuccess({
          count,
        }))
      }).catch((err: Error) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MIT'))
      })
  }

  public getSpecialMSTs(req: Request, res: Response) {
    Asset.find({
        symbol: {
            $in: MST_SPECIAL,
        },
    })
      .sort({
        symbol: 1,
      })
      .then((result) => {
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_SPECIAL_MST'))
      })
  }

  public getMSTs(req: Request, res: Response) {
    const lastSymbol = req.query.last_symbol || ''
    Asset.find({
        symbol: {
            $gt: lastSymbol,
            $nin: MST_BLACKLIST.concat(MST_SPECIAL),
        },
    })
      .sort({
        symbol: 1,
      })
      .limit(20)
      .then((result) => {
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MST'))
      })
  }

}
