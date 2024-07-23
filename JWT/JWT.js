const jwt = require("jsonwebtoken")
require("dotenv").config();

const key = process.env.JWT_SECRET;

const generateToken = (userID) => {
    const token = jwt.sign({
        userID: userID
    }, key, { expiresIn: "1h" });

    return token;
}

const authMiddleware = (req, res, next) =>
{
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];
    
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