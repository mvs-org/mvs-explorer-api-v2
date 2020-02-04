import { Request, Response } from 'express'
import * as mongoose from 'mongoose'
import { get } from 'superagent'
import { ResponseError, ResponseSuccess } from '../helpers/message.helper'
import { BlockSchema } from '../models/block.model'
import { TransactionSchema } from '../models/transaction.model'
import { OutputSchema } from '../models/output.model'
import { IElectionRewardExt } from '../interfaces/election.interfaces'
import { DNAVOTE_API_HOST, INTERVAL_DNA_VOTE_ON_HOLD, CURRENT_PERIOD, INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL, REVOTE_ENABLED, VOTE_ENABLED, INTERVAL_DNA_VOTE_EARLY_BIRD_END, VOTE_ENABLED_UNTIL, INTERVAL_DNA_VOTE_EARLY_BIRD_START, REQUIRED_WALLET_VERSION, DNAVOTE_API_KEY, ELECTION_PERIODS, REVOTE_AMOUNT_THRESHOLD, ELECTION_PERIODS_UNLOCK, INTERVAL_DNA_PREVIOUS_VOTE_END, REVOTE_ENABLED_UNTIL, CURRENT_PERIOD_REVOTE_START, CURRENT_PERIOD_REVOTE_END } from '../config/election.config';

declare function emit(k, v)

const Output = mongoose.model('Output', OutputSchema)
const Block = mongoose.model('Block', BlockSchema)
const Transaction = mongoose.model('Transaction', TransactionSchema)



export class ElectionController {

  public getInfo(req: Request, res: Response) {

    get(DNAVOTE_API_HOST + '/api/dna-selection/v1/period/simple-info')
      .then((apiResponse) => apiResponse.body.data.periodSelections)
      .then((selections) => Promise.all(selections.map((selection) => selection.selectionName)))
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
        res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20')
        res.json(new ResponseSuccess({
          candidates: INTERVAL_DNA_VOTE_ON_HOLD ? [] : candidates,
          currentPeriod: CURRENT_PERIOD,
          height,
          lockUntil: INTERVAL_DNA_VOTE_EARLY_BIRD_LOCK_UNTIL,
          voteEnabled: VOTE_ENABLED,
          voteStartHeight: INTERVAL_DNA_VOTE_EARLY_BIRD_START,
          voteEndHeight: INTERVAL_DNA_VOTE_EARLY_BIRD_END,
          voteEndTime: VOTE_ENABLED_UNTIL,
          revoteEnabled: REVOTE_ENABLED,
          revoteStartHeight: CURRENT_PERIOD_REVOTE_START,
          revoteEndHeight: CURRENT_PERIOD_REVOTE_END,
          revoteEndTime: REVOTE_ENABLED_UNTIL,
          previousVoteEndHeight: INTERVAL_DNA_PREVIOUS_VOTE_END,
          walletVersionSupport: REQUIRED_WALLET_VERSION,
          votesUnlockPeriods: ELECTION_PERIODS_UNLOCK,
        }))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_CANDIDATES'))
      })
  }

  public getHeight() {
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

    const minVoteHeight = parseInt(req.query.minVoteHeight, 10)
    const maxVoteHeight = parseInt(req.query.maxVoteHeight, 10)
    const minUnlockHeight = parseInt(req.query.minUnlockHeight, 10)

    const type = req.query.type
    const asset = req.query.asset

    const query: any = {
      'attachment.symbol': asset,
      'height': {
        $gte: minVoteHeight,
        $lte: maxVoteHeight,
      },
      'vote.type': type,
    }
    if (minUnlockHeight) {
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
      .sort({ height: 1 })
      .then((result) => Promise.all(result.map((output: any) => {
        return {
          address: output.address,
          asset: output.attachment.symbol,
          candidate: output.vote.get('candidate'),
          lockedAt: output.height,
          lockedUntil: output.vote.get('lockedUntil'),
          quantity: output.attachment.get('quantity'),
          tx: output.tx,
          revote: 1,
        }
      })))
      .then((result) => {
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_VOTES'))
      })
  }

  public getResult(req: Request, res: Response) {

    const minVoteHeight = parseInt(req.query.minVoteHeight, 10)
    const maxVoteHeight = parseInt(req.query.maxVoteHeight, 10)

    const minUnlockHeight = parseInt(req.query.minUnlockHeight, 10)
    const type = req.query.type
    const asset = req.query.asset

    const query: any = {
      'attachment.symbol': asset,
      'height': {
        $gte: minVoteHeight,
        $lte: maxVoteHeight,
      },
      'vote.type': type,
    }
    if (minUnlockHeight) {
      query['vote.lockedUntil'] = { $gte: minUnlockHeight }
    }

    const o: any = {}
    o.reduce = `function(key, values){ return Array.sum(values)}`
    o.map = function () { return emit(this.vote.candidate, this.attachment.quantity) }
    o.query = query
    o.out = { inline: 1 }

    Output.mapReduce(o)
      .then((mapResult) => {
        const result = {}

        mapResult.results.forEach((candidate) => {
          result[candidate._id] = candidate.value
        })
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
        res.json(new ResponseSuccess(result))
      }).catch((err) => {
        console.error(err)
        res.status(400).json(new ResponseError('ERR_GET_ELECTION_RESULTS'))
      })
  }

  public async getRewards(req: Request, res: Response) {

    try {
      if (req.query.txs === undefined) {
        throw Error('ERR_TXS_MISSING')
      }
      const trasactions: string[] = Array.isArray(req.query.txs) ? req.query.txs : [req.query.txs]

      const txidQuery = trasactions.reduce((query, txid) => {
        if (txid.length !== 64) {
          throw Error('ERR_INVALID_TXID')
        }
        return query + '&transId=' + txid
      }, '')

      const rewards: IElectionRewardExt[] = await get(`${DNAVOTE_API_HOST}/api/dna-selection/v1/period-vote/reward/transIds?apiKey=${DNAVOTE_API_KEY}${txidQuery}`)
        .then((apiResponse) => apiResponse.body.data)

      const response = rewards.map((reward) => ({
        amount: reward.voteCount,
        period: reward.lockPeriod,
        reward: Math.floor(reward.reward * 10000) / 10000,
        txid: reward.transactionId,
      }))
      res.setHeader('Cache-Control', 'public, max-age=1200, s-maxage=1200')
      res.json(new ResponseSuccess(response))
    } catch (err) {
      switch (err.message) {
        case 'ERR_TXS_MISSING':
        case 'ERR_INVALID_TXID':
          return res.status(400).json(new ResponseError(err.message))
      }
      console.error(err)
      res.status(500).json(new ResponseError('ERR_GET_REWARDS'))
    }
  }

  public async getRevote(req: Request, res: Response) {

    try {
      const revoteCount = await calculateRevoteCount(req.params.hash)
      res.json({ revoteCount })
    } catch (err) {
      switch (err.message) {
        case 'ERR_TX_MISSING':
        case 'ERR_INVALID_TXID':
          return res.status(400).json(new ResponseError(err.message))
        case 'ERR_TRANSACTION_NOT_FOUND':
          return res.status(404).json(new ResponseError(err.message))
      }
      console.error(err)
      res.status(500).json(new ResponseError('ERR_GET_REVOTE'))
    }

  }

}

function getVotePeriod(height: number) {
  for (let i = 0; i < ELECTION_PERIODS.length; i++) {
    if (height >= ELECTION_PERIODS[i].start && height <= ELECTION_PERIODS[i].end) {
      return i;
    }
  }
}

function between(x: number, start: number, end: number, inclusive = false) {
  if (inclusive) {
    return x >= start && x <= end
  }
  return x > start && x < end
}

async function getVoteTransaction(hash: string) {
  if (hash === undefined) {
    throw Error('ERR_TX_MISSING')
  }
  // const type: string = 'supernode'

  if (hash.length !== 64) {
    throw Error('ERR_INVALID_TXID')
  }

  const query: any = {
    hash,
    // 'outputs.vote.type': type,
  }

  const tx = await Transaction.findOne(query)
  if (tx === null) {
    throw Error('ERR_TRANSACTION_NOT_FOUND')
  }
  return tx
}

async function getPreviousVoteTx(tx) {
  if (tx.inputs) {
    for (let i = 0; i < tx.inputs.length; i++) {
      let input = tx.inputs[i]
      if (input.previous_output) {
        let previous_vote = await getVoteTransaction(input.previous_output.hash)
        if (getTxVoteOutput(previous_vote)) {
          return previous_vote
        }

      }
    }
    return undefined
  }
}

function getTxVoteOutput(tx: any) {
  if (tx && tx.outputs && tx.outputs[1] && tx.outputs[1].vote) {
    return tx.outputs[1]
  }
}

function revoteAmountMatch(prevTx, nextTx) {
  const prevOutput = getTxVoteOutput(prevTx)
  const nextOutput = getTxVoteOutput(nextTx)

  return nextOutput !== undefined
    && prevOutput !== undefined
    && nextOutput.attachment.get('quantity') <= prevOutput.attachment.get('quantity') * REVOTE_AMOUNT_THRESHOLD
    && prevOutput.attachment.get('symbol') === prevOutput.attachment.get('symbol')
}

function sameVoteDelegate(tx1, tx2) {
  return getTxVoteOutput(tx1) !== undefined && getTxVoteOutput(tx2) !== undefined && getTxVoteOutput(tx1).vote.candidate === getTxVoteOutput(tx2).vote.candidate
}

// async function calculateRevoteCount(hash: string, counter = 0, subsequentPeriod = undefined) {

//   const tx: any = await getVoteTransaction(hash)
//   if (tx === undefined) {
//     throw Error('Transaction not found')
//   }

//   const period = getVotePeriod(tx.height)

//   // check of chain is broken
//   if (period === undefined) return counter
//   if (subsequentPeriod && period !== subsequentPeriod - 1) return counter

//   counter++
//   // follow chain if previous vote also was a revote
//   const previousVoteTx: any = await getPreviousVoteTx(tx)
//   if (previousVoteTx && sameVoteDelegate(tx, previousVoteTx) && revoteAmountMatch(previousVoteTx, tx) && between(tx.height, ELECTION_PERIODS[period].revoteStart, ELECTION_PERIODS[period].revoteEnd, true)) {
//     return await calculateRevoteCount(previousVoteTx.hash, counter, period)
//   }
//   return counter
// }

function getVoteBeginPeriod(height: number) {
  for (let i = 0; i < ELECTION_PERIODS.length; i++) {
    if (height >= ELECTION_PERIODS[i].start && height <= ELECTION_PERIODS[i].end) {
      return i;
    }
  }
}

function getVotePeriodLength(startPeriod: number, unlockHeight: number) {
  let endPeriod = 0
  for (let i = 0; i < ELECTION_PERIODS.length; i++) {
    if (unlockHeight > ELECTION_PERIODS[i].end) {
      endPeriod = i
    }
  }
  return endPeriod - startPeriod + 1
}

async function calculateRevoteCount(hash: string, counter = 0, subsequentPeriod = undefined) {

  const tx: any = await getVoteTransaction(hash)

  // get the vote of the transaction
  const voteOutput = getTxVoteOutput(tx)
  if(voteOutput===undefined){
    return counter
  }

  const voteStartPeriod = getVoteBeginPeriod(tx.height)

  // check of chain is broken
  if (
    voteStartPeriod === undefined
  ) {
    return counter
  }

  // the transaction should be a vote to reach this code
  // lets calculate the number of periods this vote was valid for
  const unlockHeight = tx.height + voteOutput.get('attenuation_model_param').lock_period
  const votePeriods = getVotePeriodLength(voteStartPeriod, unlockHeight)

  if (subsequentPeriod !== undefined && subsequentPeriod !== voteStartPeriod + votePeriods) {
    return counter
  }

  if (subsequentPeriod !== undefined) {
    counter += votePeriods
  } else {
    counter++
  }

  // follow chain if previous vote also was a revote
  const previousVoteTx: any = await getPreviousVoteTx(tx)
  if (previousVoteTx &&
    sameVoteDelegate(tx, previousVoteTx) &&
    revoteAmountMatch(previousVoteTx, tx) &&
    between(tx.height, ELECTION_PERIODS[voteStartPeriod].revoteStart, ELECTION_PERIODS[voteStartPeriod].revoteEnd, true)
  ) {
    return await calculateRevoteCount(previousVoteTx.hash, counter, voteStartPeriod)
  }
  return counter
}