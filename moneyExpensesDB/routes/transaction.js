const Transaction = require("../models/transaction");
const router = require("express").Router();

router.post("/add", async (req, res) => {
  Transaction.create({
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
  })
    .then((transaction) => {
      res.status(201).json({
        message: "Transaction added successfully",
        transaction: transaction,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error adding transaction",
        error: err.message,
      });
    });
});

module.exports = router;