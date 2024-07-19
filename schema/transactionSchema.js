const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    perior:{
        type: String, // 0x000 => Bank || 012345 => account no
        required: true
    },
    transType:{
        type: String, // Deposit || Withdraw
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    datetime:{
        date:{
            type: String,
            required: true
        },
        time:{
            type: String,
            required: true
        },
    },
    accountNo:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Transaction", transactionSchema)