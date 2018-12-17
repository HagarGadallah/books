//const mongoose = require("mongoose");
const readAll = require("../db/db");
// const Book = require("../models/book");
// const Author = require("../models/author");
// const Category = require("../models/category");

module.exports.getAll = async function(req, res) {
  try {
    let books = await readAll();
    res.status(200).json({
      data: books.books,
      message: "Books loaded successfully"
    });
    // ); //await Book.find();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};
