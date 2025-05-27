const express = require("express");

// get sequelize connection from config file
const sequelize = require("./config");

const app = express();

app.use(express.urlencoded({ extended: true }));

const Transaction = require("./models/transaction");

const transaction_router = require("./routes/transaction");
app.use('/transaction', transaction_router);

var logger = 0;

function middlewareLogger(req, res, next) {
    logger++;
    console.log("Request: " + logger, "Method: ", req.method);
    next();
}

sequelize
    .sync()
    .then(() => {
        console.log("connection has been established successfully");
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/transactions", middlewareLogger, async (req, res) => {
    const transactions = await Transaction.findAll();
    res.json(transactions);
});

app.listen(3000, () => {
    console.log("listening to port 3000");
});
