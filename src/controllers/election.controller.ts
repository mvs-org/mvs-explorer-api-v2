import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { OutputSchema } from '../models/output.model'
import { get } from 'superagent'
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'
import { BlockSchema } from '../models/block.model'

declare function emit(k, v);

const Output = mongoose.model('Output', OutputSchema)
const Block = mongoose.model('Block', BlockSchema)

export const INTERVAL_DNA_VOTE_ON_HOLD = (process.env.INTERVAL_DNA_VOTE_ON_HOLD) ? parseInt(process.env.INTERVAL_DNA_VOTE_ON_HOLD) : 0

export const INTERVAL_DNA_VOTE_EARLY_BIRD_START = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_START) : 3080000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_END = (process.env.INTERVAL_DNA_LOCK_PERIOD) ? parseInt(process.env.INTERVAL_DNA_LOCK_PERIOD) : 3140000
export const INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL = (process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) ? parseInt(process.env.INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL) : 3200000

export class ElectionController {

  public getCandidatesEarlyBird(req: Request, res: Response) {

    get('http://tulipex-prod-dnavote-web-1124382027.us-east-1.elb.amazonaws.com/api/dna-selection/v1/period/simple-info')
      .then(apiResponse => apiResponse.body.data.periodSelections)
      .then(selections => Promise.all(selections.map(selection => selection.selectionName)))
      .then((candidates) => {
        return Block.find({
          orphan: 0,
        })
          .sort({
            number: -1,
          })
          .limit(1)
          .then((result) => {
            return [result[0].toObject().number, candidates]
          })
      })
      .then(([height, candidates]) => {
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess({
          candidates: INTERVAL_DNA_VOTE_ON_HOLD ? [] : candidates,
          voteStart: INTERVAL_DNA_VOTE_EARLY_BIRD_START,
          voteEnd: INTERVAL_DNA_VOTE_EARLY_BIRD_END,
          lockUntil: INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL,
          height: height,
        }))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_CANDIDATES'))
      })
  }

  getHeight() {
    Block.find({
      orphan: 0,
    })
      .sort({
        number: -1,
      })
      .limit(1)
      .then((result) => {
        return result[0].toObject().number
      }).catch((err) => {
        console.error(err)
      })
  }

  public getVotes(req: Request, res: Response) {

    const minVoteHeight = parseInt(req.query.minVoteHeight)
    const maxVoteHeight = parseInt(req.query.maxVoteHeight)

    const minUnlockHeight = parseInt(req.query.minUnlockHeight)
    const type = req.query.type
    const asset = req.query.asset

    const query: any = {
      'vote.type': type,
      'height': {
        $gte: minVoteHeight,
        $lte: maxVoteHeight,
      },
      'attachment.symbol': asset,
    }
    if(minUnlockHeight){
      query['vote.lockedUntil'] = { $gte: minUnlockHeight }
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
      .sort({ 'height': 1 })
      .then(result => Promise.all(result.map((output: any) => {
        return {
          address: output.address,
          quantity: output.attachment.get('quantity'),
          lockedAt: output.height,
          lockedUntil: output.vote.get('lockedUntil'),
          tx: output.tx,
          asset: output.attachment.symbol,
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

    const minVoteHeight = parseInt(req.query.minVoteHeight)
    const maxVoteHeight = parseInt(req.query.maxVoteHeight)

    const minUnlockHeight = parseInt(req.query.minUnlockHeight)
    const type = req.query.type
    const asset = req.query.asset

    const query: any = {
      'vote.type': type,
      'height': {
        $gte: minVoteHeight,
        $lte: maxVoteHeight,
      },
      'attachment.symbol': asset,
    }
    if(minUnlockHeight){
      query['vote.lockedUntil'] = { $gte: minUnlockHeight }
    }

    const o: any = {};
    o.reduce = `function(key, values){ return Array.sum(values)}`
    o.map = function () { return emit(this.vote.candidate, this.attachment.quantity) }
    o.query = query
    o.out = { inline: 1 }

    Output.mapReduce(o)
      .then((mapResult) => {
        const result = {}

        mapResult.results.forEach(candidate => {
          result[candidate._id] = candidate.value
        })
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_ELECTION_RESULTS'))
      })
  }
}
