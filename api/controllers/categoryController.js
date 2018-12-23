const {
  readCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById
} = require("../models/category");
const { readAll } = require("../models/db/db");

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

// module.exports.search = async function(req, res) {
//   try {
//     var options = {
//       filter: req.body.filter
//       // page: req.body.page
//     };
//     let newCategory = await createCategory(category);
//     if (newCategory == "Invalid data, please send valid data and try again") {
//       res.status(400).json({
//         data: newCategory,
//         message: "Category not created"
//       });
//       return;
//     }
//     res.status(200).json({
//       data: newCategory,
//       message: "Category created successfully"
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       data: null,
//       message: "Internal server error",
//       error: e
//     });
//   }
// };
