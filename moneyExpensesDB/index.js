const express = require("express");
const cors = require("cors");

const sequelize = require("./config");

const transaction_router = require("./routes/transaction");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:8100", "http://localhost:4200"] }));

app.use(authRoutes);

app.use(verifyToken);

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
