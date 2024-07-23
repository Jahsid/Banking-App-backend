const mongoose = require("mongoose");
require('dotenv').config();

const localDB = process.env.DB_CONNECTION_STRING;

mongoose.connect(localDB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log("Database connection error:", err);
})
