const express = require('express');
const accountSchema = require('../schema/accountSchema');
const router = express.Router()

router.post("/create-acc", async (req, res) => {
    const { name, email, initBalance } = req.body;
    const accountNo = Math.floor(Math.random() * 10000000)

    const newAcc = new accountSchema({
        holderName: name,
        holderEmail: email,
        accountNo: accountNo,
        balance: initBalance
    })

    try {
        const data = await newAcc.save();
        return res.status(200).send(data);
    } catch (err) {
        return res.status(404).send(err);
    }
})

router.put("/update-acc/:accNo", async (req, res) => {
    const accNo = req.params.accNo;
    const { name, email } = req.body;

    try {
        const data = await accountSchema.findOneAndUpdate(
            { accountNo: accNo },
            {
                holderName: name,
                holderEmail: email
            },
            { new: true }
        );

        if (!data) {
            return res.status(404).send("Failed to update account");
        }

        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
})

router.delete("/delete-acc/:accNo", async (req, res) => {
    const accNo = req.params.accNo;

    try {
        const data = await accountSchema.findOneAndDelete({ accountNo: accNo });

        if (!data) {
            return res.status(404).json({ success: false, message: "Account not found or already deleted." });
        }

        return res.status(200).json({ success: true, message: "Account deleted successfully.", data });
    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ success: false, message: "Failed to remove account.", error: error.message });
    }
});


module.exports = router;