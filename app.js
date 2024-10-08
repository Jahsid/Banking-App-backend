const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const { authMiddleware } = require("./JWT/JWT");
require("./database/connections");

const app = express();

// Middleware
app.use(cors({
    origin: 'https://banking-app-frontend-iota.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/public", require("./routes/publicRoute"));
app.use("/admin", authMiddleware, require("./routes/adminRoute"));
app.use("/transaction", require("./routes/transactionRoute"));

module.exports = app;
