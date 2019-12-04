import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { OutputSchema } from '../models/output.model'
import {get} from 'superagent' 
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'

const Output = mongoose.model('Output', OutputSchema)

export class ElectionController {

  public getCandidates(req: Request, res: Response) {

    get('http://sit.sz9.com/api/dna-selection/v1/period/simple-info')
      .then(apiResponse => apiResponse.body.data.periodSelections)
      .then(selections=>Promise.all(selections.map(selection=>selection.selectionName)))
      .then((candidates) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess({candidates}))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_CANDIDATES'))
      })
  }

  public getVotes(req: Request, res: Response) {

    const cycle = parseInt(req.query.cycle)
    const type = req.query.type || 'supernode'
    const limit = 1000

    const query: any = {
      'vote.type': type,
      'vote.cycles': cycle,
    }

    const voteFormat = {
      _id: 0,
      address: 1,
      attachment: 1,
      attenuation_model_param: 1,
      index: 1,
      tx: 1,
      height: 1,
      vote: 1,
    }

    Output.find(query, voteFormat)
      .limit(limit)
      .sort({ 'height': 1 })
      .then(result => Promise.all(result.map((output: any) => {
        return {
          address: output.address,
          quantity: output.attachment.get('quantity'),
          height: output.height,
          tx: output.tx,
          candidate: output.vote.get('candidate'),
        }
      })))
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_VOTES'))
      })
  }

  public getResult(req: Request, res: Response) {

    const cycle = req.query.cycle
    const type = req.query.type || 'supernode'

    const query: any = {
      'vote.type': type,
      'vote.cycles': cycle,
    }

    const o: any = {};
    o.reduce = `(key, values)=>Array.sum(values)`
    o.map = `function(){return emit(this.vote.candidate, this.vote.amount)}`
    o.query = query
    o.out = { inline: 1 }

    Output.mapReduce(o)
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess(result.result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_ELECTION_RESULTS'))
      })
  }
}
