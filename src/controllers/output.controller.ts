import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'
import { OutputSchema } from '../models/output.model'

const Output = mongoose.model('Output', OutputSchema)

export class OutputController {

  public getUtxo(req: Request, res: Response) {
    const addresses = req.query.addresses
    if (!addresses) {
      return res.status(400).json(new ResponseError('ERR_ADDRESSES_UNDEFINED'))
    }

    const query: any = { orphaned_at: 0 }

    query.$or = [{
      address: addresses,
    },
    {
      address: addresses,
    }]

    query.value = { $gt: 10000 }
    query['attachment.type'] = 'etp'

    const outputFormat = {
      _id: 0,
      index: 1,
      tx: 1,
    }

    Output.findOne(query, outputFormat)
      .then((result) => {
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_FIND_UTXO'))
      })
  }
}
