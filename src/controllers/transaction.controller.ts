import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { isArray } from 'util'
import { TransactionSchema } from '../models/transaction.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema)

export class TransactionController {

  async getTransaction(req: Request, res: Response) {
    const txid = req.params.txid
    const jsonFormat = req.query.json === 'false' ? false : true

    const tx = await Transaction.findOne({ hash: txid }).sort({ orphan: 1 }).lean()

    if (!tx) {
      res.status(400).json(new ResponseError('ERR_GET_TRANSACTION'))
    }

    const { _id, rawtx, orphan, ...txdata } = tx

    res.json(new ResponseSuccess(
      jsonFormat ? {...txdata, status: orphan} : { hash: tx.hash, height: tx.height, rawtx }
    ))

  }

  getTransactions(req: Request, res: Response) {

    const last_known = req.query.last_known
    const min_time = req.query.min_time
    const max_time = req.query.max_time
    const address = req.query.address
    const limit = Math.min(req.query.limit, 100) || 20

    const query: any = { orphan: 0 }

    if (last_known) {
      query._id = { $lt: last_known }
    }
    if (min_time || max_time) {
      query.confirmed_at = {}
      if (min_time) {
        query.confirmed_at.$gte = min_time
      }
      if (max_time) {
        query.confirmed_at.$lte = max_time
      }
    }

    if (address) {
      query.$or = [{
        'inputs.address': address,
      },
      {
        'outputs.address': address,
      }]
    }

    const output = {
      inputs: {
        $slice: 6,
      },
      rawtx: (req.query.raw) ? 1 : 0,
    }
    Transaction.find(query, output)
      .sort({ height: -1 })
      .limit(limit)
      .then((result) => {
        if (last_known) {
          res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        }
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_LIST_TRANSACTIONS'))
      })
  }

  public async getAddressesTransactions(req: Request, res: Response) {

    const last_known_height = req.query.min_height || 0
    const addresses = Array.isArray(req.query.addresses) ? req.query.addresses : [req.query.addresses]
    const NUMBER_OF_TRANSACTIONS_FOR_ADDRESSES =
      process.env.NUMBER_OF_TRANSACTIONS_FOR_ADDRESSES
        ? parseInt(process.env.NUMBER_OF_TRANSACTIONS_FOR_ADDRESSES, 10)
        : 5
    const jsonFormat = req.query.json === 'false' ? false : true

    const txFormat = jsonFormat ? {
      _id: 0,
      confirmed_at: 1,
      hash: 1,
      height: 1,
      inputs: 1,
      outputs: 1,
    } : {
        _id: 0,
        hash: 1,
        rawtx: 1,
        height: 1,
      }

    async function loadAddressesTxs(addresses: string[], last_known_height: number, limit: number) {
      const query: any = { orphan: 0 }
      if (last_known_height) {
        query.height = { $gte: last_known_height }
      }
      query.$or = [{
        'inputs.address': addresses,
      },
      {
        'outputs.address': addresses,
      }]
      return Transaction.find(query, txFormat)
        .sort({ height: 1 })
        .limit(limit)
    }

    async function loadAllAddressesTxsOfBlock(addresses: string[], block: number) {
      const query: any = { orphan: 0 }
      query.height = block
      query.$or = [{
        'inputs.address': addresses,
      },
      {
        'outputs.address': addresses,
      }]
      return Transaction.find(query, txFormat)
    }

    try {
      if (!isArray(addresses) || addresses.length === 0) {
        throw Error('ERR_ADDRESSES_UNDEFINED')
      }
      let txs = await loadAddressesTxs(addresses, last_known_height, NUMBER_OF_TRANSACTIONS_FOR_ADDRESSES + 1)
      if (txs.length >= NUMBER_OF_TRANSACTIONS_FOR_ADDRESSES + 1) {
        if (txs[txs.length - 1].toObject().height === txs[txs.length - 2].toObject().height) {
          const lastHeight = txs[txs.length - 1].toObject().height
          const nextTxChunk = await loadAllAddressesTxsOfBlock(addresses, lastHeight)
          txs = txs.filter((tx: any) => tx.height !== lastHeight).concat(nextTxChunk)
        } else {
          txs.pop()
        }
      }
      res.json(new ResponseSuccess(txs.reverse()))
    } catch (err) {
      console.error(err)
      res.status(400).json(new ResponseError('ERR_LIST_TRANSACTIONS'))
    }
  }

  public getBlockTxs(req: Request, res: Response) {

    const blockhash = req.query.hash
    const blockheight = req.query.height
    if (!blockhash && !blockheight) {
      res.status(400).json(new ResponseError('ERR_BLOCK_NOT_SPECIFIED'))
    }
    const last_known = req.query.last_known
    const limit = Math.min(req.query.limit, 100) || 20

    Transaction.find({
      ...(last_known && { _id: { $gt: last_known } }),
      ...(blockhash && { block: blockhash }),
      ...(blockheight && { height: blockheight, orphan: 0 }),
    }, {
      "inputs": {
        "$slice": 5
      },
      "outputs": {
        "$slice": 5
      }
    })
      .limit(limit)
      .then((result) => {
        if (last_known) {
          res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        }
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_BLOCK_TXS'))
      })
  }

}
