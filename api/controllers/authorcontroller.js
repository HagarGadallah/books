//const mongoose = require("mongoose");
const { readAll, readAuthorById, deleteAuthorById } = require("../db/db");
// const Author = require("../models/author");

module.exports.getAll = async function(req, res) {
  try {
    let all = await readAll();
    res.status(200).json({
      data: all.authors,
      message: "Authors loaded successfully"
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
    let author = await readAuthorById(req.params.id);
    res.status(200).json({
      data: author,
      message: "Author found successfully"
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

module.exports.delete = async function(req, res) {
  try {
    let author = await deleteAuthorById(req.params.id);
    if (
      author == "Cannot delete an author, without deleting his/her books first"
    ) {
      res.status(200).json({
        data: author,
        message: "Author not removed"
      });
      return;
    }
    res.status(200).json({
      data: author,
      message: "Author removed successfully"
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
