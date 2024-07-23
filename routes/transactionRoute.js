const express = require("express");
const transactionSchema = require("../schema/transactionSchema");
const { depositAmount, withdrawAmount, transferAmount } = require("../helper/transHelper")
const router = express.Router()

// Deposit route
router.post("/deposit", async (req, res) => {
    const { amount, accountNo } = req.body;

    try {
        const result = await depositAmount(accountNo, amount);

        if (!result) {
            return res.status(500).send("Failed to deposit");
        }

        // Record the transaction
        const newTransaction = new transactionSchema({
            perior: 0,
            transType: "CREDIT",
            amount: amount,
            datetime: {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            },
            accountNo: accountNo,
        });

        const data = await newTransaction.save();
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error during deposit:", err);
        return res.status(500).send("Internal server error");
    }
});

// Withdraw route
router.post("/withdraw", async (req, res) => {
    const { amount, accountNo } = req.body;

    try {
        const result = await withdrawAmount(accountNo, amount);

        if (!result) {
            return res.status(400).send("Failed to withdraw: insufficient funds or account not found");
        }

        // Record the transaction
        const newTransaction = new transactionSchema({
            perior: 0,
            transType: "DEBIT",
            amount: amount,
            datetime: {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
            },
            accountNo: accountNo,
        });

        const data = await newTransaction.save();
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error during withdrawal:", err);
        return res.status(500).send("Internal server error");
    }
});

router.post("/transfer", async (req, res) => {
    const { perior, amount, accountNo } = req.body;

    // Validate input
    if (!perior || !amount || !accountNo || amount <= 0) {
        return res.status(400).send("Invalid request data.");
    }

    let session;

    try {
        // Perform the transfer
        const result = await transferAmount(perior, accountNo, amount);

        if (!result.success) {
            return res.status(500).send(`Failed to transfer: ${result.message}`);
        }

        // Start a session for transaction
        session = await transactionSchema.startSession();
        session.startTransaction();

        // Record the transactions
        const withTrans = new transactionSchema({
            perior: perior,
            transType: "DEBIT",
            amount: amount,
            "datetime.date": new Date().toLocaleDateString(),
            "datetime.time": new Date().toLocaleTimeString(),
            accountNo: accountNo
        });

        const depTrans = new transactionSchema({
            perior: accountNo,
            transType: "CREDIT",
            amount: amount,
            "datetime.date": new Date().toLocaleDateString(),
            "datetime.time": new Date().toLocaleTimeString(),
            accountNo: accountNo
        });

        const t1 = await withTrans.save({ session });
        const t2 = await depTrans.save({ session });

        if (!t1 || !t2) {
            throw new Error("Failed to save transaction records.");
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.send("Amount transferred successfully.");
    } catch (error) {
        // Abort the transaction if there is an error
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return res.status(500).send(`Failed to transfer: ${error.message}`);
    }
});



module.exports = router;