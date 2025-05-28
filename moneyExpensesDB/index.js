const express = require("express");
const cors = require("cors");

const sequelize = require("./config");

const app = express();

app.use(cors({ origin: "http://localhost:8100" }));
app.use(express.urlencoded({ extended: true }));

const Transaction = require("./models/transaction");

const transaction_router = require("./routes/transaction");
app.use('/transaction', transaction_router);


sequelize
    .sync()
    .then(() => {
        console.log("connection has been established successfully");
    })
    .catch((err) => {
        console.log(err);
    });



app.listen(3000, () => {
    console.log("listening to port 3000");
});
