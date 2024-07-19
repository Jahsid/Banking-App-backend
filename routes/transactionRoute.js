const express = require("express");
const transactionSchema = require("../schema/transactionSchema");
const { depositAmount } = require("../helper/transHelper")
const router = express.Router()

router.post("/deposit", async (req, res)=>{
    const { perior, amount, accountNo} = req.body;
    try {
        await depositAmount(accountNo, amount)
    } catch(error){
        return res.status(500).send(error)
    }

    const newTransaction = new transactionSchema({
        perior: 0,
        transType:"CREDIT",
        amount:amount,
        "datetime.date": new Date().toLocaleDateString(),
        "datetime.time": new Date().toLocaleTimeString(),
        accountNo:accountNo
    })

    try {
        const data = await newTransaction.save();
        return res.status(200).send(data);
    } catch (err) {
        return res.status(404).send(err);
    }

})

router.post("/withdraw", async (req, res)=>{
    const { perior, amount, accountNo} = req.body;

    const newTransaction = new transactionSchema({
        perior:perior,
        transType:"DEBIT",
        amount:amount,
        "datetime.date": new Date().toLocaleDateString(),
        "datetime.time": new Date().toLocaleTimeString(),
        accountNo:accountNo
    })

    try {
        const data = await newTransaction.save();
        return res.status(200).send(data);
    } catch (err) {
        return res.status(404).send(err);
    }

})

router.post("/transfer", async (req, res)=>{
    const { perior, amount, accountNo} = req.body;

    const withTrans = new transactionSchema({
        perior:perior,
        transType:"DEBIT",
        amount:amount,
        "datetime.date": new Date().toLocaleDateString(),
        "datetime.time": new Date().toLocaleTimeString(),
        accountNo:accountNo
    })

    const depTrans = new transactionSchema({
        perior:accountNo,
        transType:"CREDIT",
        amount:amount,
        "datetime.date": new Date().toLocaleDateString(),
        "datetime.time": new Date().toLocaleTimeString(),
        accountNo:accountNo
    })

    const t1 = await withTrans.save();
    const t2 = await depTrans.save();

    if(t1!=null && t2!=null){
        return res.send("amount transfer")
    } else{
        return res.status(500).send("failed to transfer")
    }

})

module.exports = router;