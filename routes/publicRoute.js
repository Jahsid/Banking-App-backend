const express = require("express");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const accountSchema = require("../schema/accountSchema");

router.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;

    const newUser = new userSchema({
        name: name,
        email: email,
        username: username,
        password: password
    });

    try {
        const data = await newUser.save();
        return res.status(200).send(data);
    } catch (err) {
        return res.status(404).send(err);
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if(username == "" || password == ""){
        return res.status(404).send("username and password required");
    }

    try {
        const user = await userSchema.findOne({
            username: username,
            password: password
        })
        if (user != null) {
            return res.status(200).send(user);
        } else {
            return res.status(401).send("Invalid username or password.");
        }
    } catch (err) {
        return res.status(500).send("Server error");
    }
});

router.get("/acc-info/:accNo", async (req, res) => {
    const accountNo = req.params.accNo

    try {
        const data = await accountSchema.findOne({ accountNo: accountNo})
        return res.status(200).send(data);
    } catch (err) {
        return res.status(404).send(err);
    }
});

module.exports = router;
