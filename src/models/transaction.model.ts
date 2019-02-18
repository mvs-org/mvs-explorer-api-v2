import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const PreviousOutputSchema = new Schema ({
    hash: String,
    index: Number,
})

export const InputSchema = new Schema({
  address: String,
  attachment: Map,
  index: Number,
  previous_output: PreviousOutputSchema,
  script: String,
  sequence: Number,
  value: Number,
})

export const OutputSchema = new Schema({
  _id: Schema.Types.ObjectId,
  address: String,
  attachment: Map,
  confirmed_at: Number,
  height: Number,
  index: Number,
  locked_height_range: Number,
  orphaned_at: Number,
  script: String,
  spent_tx: String,
  tx: String,
  value: Number,
})

export const TransactionSchema = new Schema({
  block: String,
  confirmed_at: Number,
  hash: {
    lowercase: true,
    required: 'Transaction muse have a hash',
    type: String,
  },
  height: Number,
  id: Schema.Types.ObjectId,
  inputs: [InputSchema],
  lock_time: String,
  orphan: Number,
  outputs: [OutputSchema],
  rawtx: String,
  version: String,
}, { collection: 'tx' })
