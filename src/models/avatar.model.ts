import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const AvatarUpdateSchema = new Schema({
  address: String,
  confirmed_at: Number,
  height: Number,
  issue_index: Number,
  issue_tx: String,
  symbol: String,
  type: String,
})

export const AvatarSchema = new Schema({
  address: String,
  confirmed_at: Number,
  height: Number,
  id: Schema.Types.ObjectId,
  issue_index: Number,
  issue_tx: String,
  ['type']: String,
  original_address: String,
  symbol: String,
  updates: [AvatarUpdateSchema],
}, { collection: 'avatar' })
