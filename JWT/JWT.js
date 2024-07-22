const jwt = require("jsonwebtoken")

const key = "privateKey" // we will make it from env.

const generateToken = (userID) => {
    const token = jwt.sign({
        userID: userID
    }, key)

    return token;
}

const authMiddleware = (req, res, next) =>
{
    const token = req.headers.authorization || "";
    console.log(token);
    if (!token) {
        return res.status(500).send("auth token not provided");
    }

    try {
        const decoded = jwt.verify(token, key);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
}

module.exports = { generateToken, authMiddleware }