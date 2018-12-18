//const mongoose = require("mongoose");
const { readAll, readCategoryById, deleteCategoryById } = require("../db/db");
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

module.exports.get = async function(req, res) {
  try {
    let category = await readCategoryById(req.params.id);
    res.status(200).json({
      data: category,
      message: "Category found successfully"
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
    let category = await deleteCategoryById(req.params.id);
    if (
      category ==
      "Cannot delete a category, without deleting books under it first"
    ) {
      res.status(200).json({
        data: category,
        message: "Category not removed"
      });
      return;
    }
    res.status(200).json({
      data: category,
      message: "Category removed successfully"
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
