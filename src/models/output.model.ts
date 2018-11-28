import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OutputSchema = new Schema({
  _id: Schema.Types.ObjectId,
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
}, {collection: 'output'})
