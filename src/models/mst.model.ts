import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const MSTSchema = new Schema({
  _id: Schema.Types.ObjectId,
  address: String,
  confirmed_at: Number,
  decimals: Number,
  description: String,
  height: Number,
  is_secondaryissue: Boolean,
  issue_index: Number,
  issue_tx: String,
  issuer : String,
  original_quantity: Number,                                  
  quantity: Number,
  secondaryissue_threshold: Number,
  symbol: String,
  type: String,
  updates: [ Map ],
}, { collection: 'asset' })
