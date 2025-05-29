const Transaction = require("../models/transaction");
const router = require("express").Router();

router.post("/add", async (req, res) => {
  Transaction.create({
    Amount: req.body.Amount,
    Category: req.body.Category,
    Date: req.body.Date,
    Type: req.body.Type,
  })
    .then((transaction) => {
      res.status(201).json(transaction);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error adding transaction",
        error: err.message,
      });
    });
});

router.get("/all", async (req, res) => {
  Transaction.findAll()
    .then((transactions) => {
      res.status(200).json(transactions);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving transactions",
        error: err.message,
      });
    });
});

router.put("/update/:trans_id", async (req, res) => {
  const id = req.params.trans_id;
  Transaction.update(
    {
      trans_id: id,
      Amount: req.body.Amount,
      Category: req.body.Category,
      Date: req.body.Date,
      Type: req.body.Type,
    },
    {
      where: { trans_id: id },
    }
  ).then((result) => {
    if (result[0] === 1) {
      res.status(200).json({
        message: "Transaction updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Transaction not found",
      });
    }
  });
});

router.delete("/delete/:trans_id", async (req, res) => {
  const id = req.params.trans_id;
  Transaction.destroy({
    where: { trans_id: id },
  })
    .then((result) => {
      if (result === 1) {
        res.status(200).json({
          message: "Transaction deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Transaction not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting transaction",
        error: err.message,
      });
    });
});

module.exports = router;
