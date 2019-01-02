//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const validate = require("uuid-validate");
const {
  readAll,
  write,
  finalizeSort
} = require("../models/utilities/utilities");
//Schema
// var Category = mongoose.model(
//   "Category",
//   new mongoose.Schema({
//     name: {
//       type: String,
//       required: true
//     }
//   })
// );

//Schema Validation
// function validateCategory(category) {
//   const schema = {
//     id: validate(id),
//     name: Joi.string().required()
//   };

//   return Joi.validate(category, schema);
// }

const readCategoryById = async id => {
  try {
    const data = await readAll();
    var valid = validate(id);
    if (!valid) {
      return "No id match";
    } else {
      var item = _.find(data.categories, function(i) {
        return i.id == id;
      });
      return item;
    }
  } catch (e) {
    throw e;
  }
};

const readCategoryByName = async name => {
  try {
    console.log("inside read by name function");
    const data = await readAll();
    var nameToLookUp = _.replace(name, "%20", " ");
    var item = _.find(data.categories, function(i) {
      return i.name == name;
    });
    console.log("item", item);
    if (item != undefined) {
      return item;
    } else return "No match found";
  } catch (e) {
    throw e;
  }
};

const createCategory = async category => {
  try {
    const data = await readAll();
    var categories = data.categories;

    const name = category.name;

    const item = _.find(categories, function(i) {
      return i.name == name;
    });

    if (item == undefined) {
      var categoryId = uuidv4();
      category.id = categoryId;

      //Invalid data check
      if (category.name == undefined || category.name.trim() == "") {
        return "Invalid data, please send valid data and try again";
      }
      //Created Successfully
      else {
        //Push it
        categories.push(category);
      }
      await write(data);
      return category;
    } else return "Category with the same name already exists";
  } catch (e) {
    throw e;
  }
};

const updateCategoryById = async (id, category) => {
  try {
    var data = await readAll();
    //get the item
    var item = _.find(data.categories, function(i) {
      return i.id == id;
    });

    //Invalid data check
    if (category.name == undefined || category.name.trim() == "") {
      return "Invalid data, please send valid data and try again";
    } else if (item == undefined) {
      return "No id match";
    }
    //Updated Successfully
    else {
      item.name = category.name;
    }

    //console.log("item after update", item);
    //console.log("data after updating item", data.categories);

    //save it in file
    await write(data);

    //console.log("data after update", data.categories);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteCategoryById = async id => {
  try {
    const data = await readAll();
    //get the item
    var item = await readCategoryById(id);

    if (item == undefined) {
      return "No id match";
    }

    // check occurence
    for (let i = 0; i < data.books.length; i++) {
      if (data.books[i].category == item.id) {
        return "Cannot delete a category, without deleting books under it first";
      }
    }

    //remove it
    var categoriesAfterRemove = data.categories.filter(c => c.id != item.id);
    //add it to data and save it in file
    data.categories = categoriesAfterRemove;

    await write(data);
    return item;
  } catch (e) {
    throw e;
  }
};

const getCategories = async options => {
  try {
    const data = await readAll();
    var categories = data.categories;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;

    if (page == undefined && size == undefined && sortBy == undefined) {
      return categories; //Normal GET all with no filterations
    } else {
      return await finalizeSort(categories, page, size, sortBy);
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategories,
  readCategoryByName
};
