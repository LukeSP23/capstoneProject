const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Transaction = sequelize.define(
  "Transaction",
  {
    trans_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Transaction;
