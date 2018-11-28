import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AvatarUpdateSchema = new Schema({
  address: String,
  symbol: String,
  type: String,
  issue_tx: String,
  issue_index: Number,
  height: Number,
  confirmed_at: Number
})

export const AvatarSchema = new Schema({
  id: Schema.Types.ObjectId,
  address: String,
  symbol: String,
  ['type']: String,
  issue_tx: String,
  issue_index: Number,
  height: Number,
  original_address: String,
  updates: [AvatarUpdateSchema],
  confirmed_at: Number
}, { collection: 'avatar' })
