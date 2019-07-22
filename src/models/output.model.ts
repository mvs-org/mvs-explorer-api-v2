import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

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
  spent_tx: Schema.Types.Mixed,
  tx: String,
  value: Number,
}, {collection: 'output'})
