const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    balance: {
        type: Number,
        require: true,
        default: 0
    },
})

module.exports = mongoose.model("Users", userSchema)