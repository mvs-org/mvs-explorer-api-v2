import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BlockSchema = new Schema({
  id: Schema.Types.ObjectId,
  bits: String,
  hash: String,
  merkle_tree_hash: String,
  mixhash: String,
  nonce: String,
  number: Number,
  previous_block_hash: String,
  time_stamp: Number,
  transaction_count: Number,
  version: Number,
  orphan: Number,
  txs: [String]
}, { collection: 'block' })
