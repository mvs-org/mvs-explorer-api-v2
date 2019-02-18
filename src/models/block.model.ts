import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const BlockSchema = new Schema({
  bits: String,
  hash: String,
  id: Schema.Types.ObjectId,
  merkle_tree_hash: String,
  mixhash: String,
  nonce: String,
  number: Number,
  orphan: Number,
  previous_block_hash: String,
  time_stamp: Number,
  transaction_count: Number,
  txs: [String],
  version: Number,
}, { collection: 'block' })
