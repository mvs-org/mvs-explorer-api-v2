import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { AddressBalances } from '../models/address_balances.model'
import { MSTSchema } from '../models/mst.model'
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

  public async listStakes(req: Request, res: Response) {
    const symbol = req.query.symbol.toUpperCase().replace(/\./g, '_') || 'ETP'
    const lastAddress = req.query.lastAddress
    const limit = Math.min(req.query.limit || 20, 100)
    const min = req.query.min || 1
    let lastAddressBalance
    if (req.query.lastAddress) {
      const balances = await AddressBalances.findOne({ _id: lastAddress })
      lastAddressBalance = balances ? balances.toObject().value.get(symbol) : undefined
      if (!lastAddressBalance) {
        // Wrong lastAddress or no balance for this MST
        lastAddressBalance = -1
      }
    }
    AddressBalances.find({
      ['value.' + symbol]: {
        $gt: min,
      },
      _id: {
        $ne: '1111111111111111111114oLvT2',
      },
      ...(lastAddressBalance && { ['value.' + symbol]: { $gt: min, $lte: lastAddressBalance } }),
    })
      .sort({
        ['value.' + symbol]: -1,
        _id: 1,
      })
      .then((fullList) => {
        let i = 0
        if (lastAddress) {
          i = fullList.findIndex((addressBalance) => addressBalance._id == lastAddress) + 1
        }
        const result = fullList.slice(i, i + limit)
        if (result && result.length > 0 && result[result.length - 1].toObject()._id == 'coinbase') {
          result.pop()
        }
        return result
      })
      .then((result) => result.map((addressBalances: mongoose.Document) => {
        return {
          a: addressBalances.toObject()._id,
          q: addressBalances.toObject().value.get(symbol),
        }
      }))

      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_MST_STAKE'))
      })
  }

}
