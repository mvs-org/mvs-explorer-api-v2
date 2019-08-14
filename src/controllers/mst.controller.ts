import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { MSTSchema } from '../models/mst.model'
import { AddressBalances } from '../models/address_balances.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Asset = mongoose.model('Asset', MSTSchema)

export const MST_BLACKLIST = ['ETP']
export const MST_SPECIAL = ['DNA', 'MVS.ZGC', 'MVS.ZDC']

export class MSTController {

  public info(req: Request, res: Response) {
    Asset.find()
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

  public async getSpecialMSTs(req: Request, res: Response) {
    const coinbaseBalances = (await AddressBalances.findOne({ _id: 'coinbase' })).toObject() ||
      { _id: 'coinbase', value: new Map() }
    Asset.find({
      symbol: {
        $in: MST_SPECIAL,
      },
    })
      .sort({
        symbol: 1,
      })
      .then((result) => result.map((mst: mongoose.Document) => {
        return {
          minedQuantity: -coinbaseBalances.value.get(mst.toObject().symbol.replace(/\./g, '_')) || 0,
          ...mst.toObject(),
        }
      }))
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1800')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_SPECIAL_MST'))
      })
  }

  public async getMSTs(req: Request, res: Response) {
    const lastSymbol = req.query.last_symbol || ''
    const coinbaseBalances = (await AddressBalances.findOne({ _id: 'coinbase' })).toObject() ||
      { _id: 'coinbase', value: new Map() }
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
      .then((result) => result.map((mst: mongoose.Document) => {
        return {
          minedQuantity: -coinbaseBalances.value.get(mst.toObject().symbol.replace(/\./g, '_')) || 0,
          ...mst.toObject(),
        }
      }))
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MST'))
      })
  }

}
