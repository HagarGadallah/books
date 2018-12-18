//const mongoose = require("mongoose");
const { readAll, readBookById } = require("../db/db");
// const Book = require("../models/book");
// const Author = require("../models/author");
// const Category = require("../models/category");

module.exports.getAll = async function(req, res) {
  try {
    let all = await readAll();
    res.status(200).json({
      data: all.books,
      message: "Books loaded successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.get = async function(req, res) {
  try {
    let book = await readBookById(req.params.id);
    res.status(200).json({
      data: book,
      message: "Book found successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};
