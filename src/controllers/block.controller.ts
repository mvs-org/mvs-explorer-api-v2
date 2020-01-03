import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { BlockSchema } from '../models/block.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Block = mongoose.model('Block', BlockSchema)

export class BlockController {

  public getHeight(req: Request, res: Response) {
    Block.find({
      orphan: 0,
    })
      .sort({
        number: -1,
      })
      .limit(1)
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=10, s-maxage=10')
        res.json(new ResponseSuccess(result[0].toObject().number))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_HEIGHT'))
      })
  }

  public getBlocks(req: Request, res: Response) {

    const sort_by = req.query.sort_by
    const last_known = req.query.last_known
    Block.find({
      ...(last_known && { _id: { $lt: last_known } }),
      orphan: 0,
    })
      .sort({
        ['number']: -1,
      })
      .limit(20)
      .then((result) => {
        if (last_known) {
          res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        }
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_BLOCKS'))
      })
  }

  public getHeightFromTimestamp(req: Request, res: Response) {

    const timestamp = parseInt(req.params.timestamp, 10)
    const current_time = Date.now() / 1000
    const blocktime_range = 10000

    if (timestamp < current_time) {
      Block.find({
        time_stamp: {
          $gt: timestamp
        },
        orphan: 0,
      })
        .sort({
          time_stamp: 1,
        })
        .limit(1)
        .then((result) => {
          res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
          res.json(new ResponseSuccess(result[0].toObject().number))
        }).catch((err) => {
          console.error(err)
          res.status(400).json(new ResponseError('ERR_GET_HEIGHT_FROM_TIMESTAMP'))
        })
    } else {
      Block.find({
        orphan: 0,
      })
        .sort({
          number: -1,
        })
        .limit(blocktime_range)
        .then((result) => {
          const blocktime = (result[0].toObject().time_stamp - result[blocktime_range - 1].toObject().time_stamp) / blocktime_range
          const current_height = result[0].toObject().number
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
          res.json(new ResponseSuccess(Math.round(current_height + ((timestamp - current_time) / blocktime))))
        }).catch((err) => {
          console.error(err)
          res.status(400).json(new ResponseError('ERR_GET_HEIGHT_FROM_TIMESTAMP'))
        })
    }
  }

}
