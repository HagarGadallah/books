//const mongoose = require("mongoose");
const { readAll } = require("../db/db");
// const Category = require("../models/category");

module.exports.getAll = async function(req, res) {
  try {
    let all = await readAll();
    res.status(200).json({
      data: all.categories,
      message: "Categories loaded successfully"
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
