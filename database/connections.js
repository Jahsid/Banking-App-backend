const mongoose = require("mongoose")

const localDB = "mongodb://localhost:27017/banking"

mongoose.connect(localDB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err)
})
