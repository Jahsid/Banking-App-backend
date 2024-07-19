const express = require("express")
const morgan = require('morgan')
require("./database/connections")

const port = 4000
const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use("/public", require("./routes/publicRoute"))
app.use("/admin", require("./routes/adminRoute"))
app.use("/transaction", require("./routes/transactionRoute"))

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})