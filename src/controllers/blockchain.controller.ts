import { Request, Response } from 'express'
import { ResponseSuccess } from '../helpers/message.helper'

export class BlockchainController {

  public async getDefaultFee(req: Request, res: Response) {
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
      return res.json(new ResponseSuccess({
        avatar: 100000000,
        default: 100000,
        minimum: 10000,
        mitIssue: 100000,
        mstIssue: 1000000000,
      }))
  }

}
