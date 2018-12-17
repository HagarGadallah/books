const mongoose = require("mongoose");

var Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
);

exports.exports = { Category };
