import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const InputSchema = new Schema({
  previous_output: {
    hash: String,
    index: Number
  },
  script: String,
  sequence: Number,
  index: Number,
  attachment: Map,
  address: String,
  value: Number
})

export const OutputSchema = new Schema({
  address: String,
  attachment: Map,
  index: Number,
  locked_height_range: Number,
  script: String,
  value: Number,
  tx: String,
  orphaned_at: Number,
  height: Number,
  spent_tx: String,
  confirmed_at: Number,
  _id: Schema.Types.ObjectId
})

export const TransactionSchema = new Schema({
  id: Schema.Types.ObjectId,
  hash: {
    type: String,
    required: 'Transaction muse have a hash',
    lowercase: true
  },
  inputs: [InputSchema],
  lock_time: String,
  outputs: [OutputSchema],
  version: String,
  height: Number,
  orphan: Number,
  block: String,
  confirmed_at: Number,
  rawtx: String
}, { collection: 'tx' })


