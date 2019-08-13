import { ok } from 'assert'
import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { TransactionSchema } from '../models/transaction.model'
import { ResponseError, ResponseSuccess } from './../helpers/message.helper'

const Transaction = mongoose.model('Tx', TransactionSchema)

export class AddressController {

  public async getPublicKey(req: Request, res: Response) {
    const address: string = req.params.address

    try {
      ok(address, 'ERR_ADDRESS_MISSING')
      ok(/^[A-Za-z0-9]{34}$/.test(address), 'ERR_INVALID_ADDRESS')
      const script = await Transaction.find({ 'inputs.address': address }, { '_id': 0, 'inputs.$': 1 }).limit(1)
        .then((result: mongoose.MongooseDocument[]) => {
          if (!result.length) {
            throw Error('ERR_NOT_FOUND')
          }
          return result[0].toObject().inputs[0].script
        })
      const match = script.match(/\ (304[a-f0-9]+)\ /)
      if (match == null) {
        throw Error('ERR_NO_PUBLIC_KEY_IN_SCRIPT')
      }
      const publickey = match[1]
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
      return res.json(new ResponseSuccess({
        publickey,
      }))
    } catch (err) {
      switch (err.message) {
        case 'ERR_INVALID_ADDRESS':
        case 'ERR_ADDRESS_MISSING':
        case 'ERR_NOT_FOUND':
        case 'ERR_NO_PUBLIC_KEY_IN_SCRIPT':
          return res.status(400).json(new ResponseError(err.message))
      }
      console.error(err)
      res.status(500).json(new ResponseError('ERR_CANT_FIND_PUBLIC_KEY'))
    }
  }

}
