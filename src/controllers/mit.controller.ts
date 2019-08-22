import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { OutputSchema } from '../models/output.model'
import { ResponseError, ResponseSuccess  } from './../helpers/message.helper'

const Output = mongoose.model('Output', OutputSchema)

export class MITController {

  public info(req: Request, res: Response) {
    Output.find({
      ['attachment.type']: 'mit',
      orphaned_at: 0,
    })
      .count()
      .then((count: number) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess({
          count,
        }))
      }).catch((err: Error) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MIT'))
      })
  }

  public getMITs(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    const address = req.query.address
    Output.find({
      ...(last_known && { _id: { $lt: last_known } }),
      ...(address && { ['address']: address}),
      ['attachment.type']: 'mit',
      spent_tx: 0,
    })
      .sort({
        ...(sort_by === 'symbol' && { ['attachment.symbol']: 1 }),
        ...(sort_by !== 'symbol' && { height: -1 }),
      })
      .limit(20)
      .then((result) => {
        if (last_known) {
          res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        }
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MIT'))
      })
  }

}
