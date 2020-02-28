import { Request, Response } from 'express'
import { ResponseSuccess } from '../helpers/message.helper'

export class BlockchainController {

  public async getDefaultFee(req: Request, res: Response) {
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
      return res.json(new ResponseSuccess({
        avatar: process.env.FEE_AVATAR ? parseInt(process.env.FEE_AVATAR, 10) : 100000000,
        bountyShare: process.env.FEE_BUONTY_SHARE ? parseInt(process.env.FEE_BUONTY_SHARE, 10) : 80,
        default: process.env.FEE_DEFAULT ? parseInt(process.env.FEE_DEFAULT, 10) : 10000,
        minimum: process.env.FEE_MIN ? parseInt(process.env.FEE_MIN, 10) : 10000,
        mitIssue: process.env.FEE_MIT_ISSUE ? parseInt(process.env.FEE_MIT_ISSUE, 10) : 100000,
        mstIssue: process.env.FEE_MST_ISSUE ? parseInt(process.env.FEE_MST_ISSUE, 10) : 1000000000,
      }))
  }

}
