import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

const Balances = new Schema({

})

export const AddressBalancesSchema = new Schema({
    _id: String,
    value: {
        type: Map,
        of: Number,
    },
}, { collection: 'address_balances' })

export const AddressBalances = mongoose.model('AddressBalances', AddressBalancesSchema)
