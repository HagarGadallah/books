const {
  readCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategories
} = require("../models/category");

module.exports.getAll = async function(req, res) {
  try {
    /* var page = req.query.page;
       var size = req.query.size;
       var filter = req.query.filter;
       var sort = req.query.sort;*/
    var options = {
      page: req.body.page,
      size: req.body.size,
      sortBy: req.body.sortBy
    };
    let filteredCategories = await getCategories(options);
    res.status(200).json({
      data: filteredCategories,
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
      res.status(400).json({
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

module.exports.update = async function(req, res) {
  try {
    var categoryId = req.params.id;
    let updatedCategory = await updateCategoryById(categoryId, req.body);
    if (
      updatedCategory == "Invalid data, please send valid data and try again"
    ) {
      res.status(400).json({
        data: updatedCategory,
        message: "Category was not updated"
      });
      return;
    }
    res.status(200).json({
      data: updatedCategory,
      message: "Category updated successfully"
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

module.exports.create = async function(req, res) {
  try {
    var category = {
      name: req.body.name
    };
    let newCategory = await createCategory(category);
    if (newCategory == "Invalid data, please send valid data and try again") {
      res.status(400).json({
        data: newCategory,
        message: "Category not created"
      });
      return;
    }
    res.status(200).json({
      data: newCategory,
      message: "Category created successfully"
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
