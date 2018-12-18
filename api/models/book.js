const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 300
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Author"
    },
    description: {
      type: String,
      maxlength: 500
    },
    isbn: {
      type: String,
      maxlength: 50
    },
    publishYear: {
      type: Number
    },
    pagesNumber: Number,
    image: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Category"
    }
  })
);
exports.exports = { Book };
