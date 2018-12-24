//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const { readAll, sort, write } = require("./db/db");

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
    var item = _.find(data.categories, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const createCategory = async category => {
  try {
    const data = await readAll();
    var categories = data.categories;

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
  } catch (e) {
    throw e;
  }
};

const updateCategoryById = async (id, category) => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.categories, function(i) {
      return i.id == id;
    });

    //Invalid data check
    if (category.name == undefined || category.name.trim() == "") {
      return "Invalid data, please send valid data and try again";
    }
    //Updated Successfully
    else {
      item.name = category.name;
    }

    //save it in file
    await write(data);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteCategoryById = async id => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.categories, function(i) {
      return i.id == id;
    });

    // check occurence
    for (let i = 0; i < data.books.length; i++) {
      if (data.books[i].category == item.id) {
        return "Cannot delete a category, without deleting books under it first";
      }
    }

    //remove it
    var categoriesAfterRemove = data.categories.filter(c => c.id != item.id);
    //add it to the parsed data and save it in file
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
    var length = categories.length;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;

    if (page == undefined && size == undefined && sortBy == undefined) {
      return categories; //Normal GET all with no filterations
    } else if (page < 1 || page == undefined) {
      var defaultCategories = _.take(categories, size || 10);

      if (sortBy != undefined && options.sortBy.trim() != "") {
        return await sort(defaultCategories, sortBy); //if page length is less than 1
      }

      return defaultCategories;
    } else if (page > length / 10 || size > length) {
      //console.log("inside size more than limit");
      var droppedCategories = _.drop(categories, length - (size || 10));
      defaultCategories = _.take(droppedCategories, size || 10);

      if (sortBy != undefined && options.sortBy.trim() != "") {
        return await sort(defaultCategories, sortBy); //if page length is less than 1
      }

      return defaultCategories; // if page number/size is more than categories length
    } else {
      //console.log("normal scenario");
      var categoriesSkipped = _.drop(categories, (page - 1) * size);
      var pickedCategories = _.take(categoriesSkipped, size);

      if (sortBy != undefined && options.sortBy.trim() != "") {
        return await sort(pickedCategories, sortBy);
      } else return _.take(pickedCategories, size); //normal scenario
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
  getCategories
};
