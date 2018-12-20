//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");

const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
    const data = await readFile(path.join(__dirname, "books.json"));
    const dataParsed = JSON.parse(data);
    var item = _.find(dataParsed.categories, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const createCategory = async category => {
  try {
    const data = await readFile(path.join(__dirname, "books.json"));
    const dataParsed = JSON.parse(data);
    var categories = dataParsed.categories;

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
    var newFile = JSON.stringify(dataParsed);

    await writeFile(path.join(__dirname, "books.json"), newFile);
    return category;
  } catch (e) {
    throw e;
  }
};

const updateCategoryById = async (id, category) => {
  try {
    const data = await readFile(path.join(__dirname, "books.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.categories, function(i) {
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

    //Stringify it again to save it in file
    var afterUpdateFile = JSON.stringify(dataParsed);
    await writeFile(path.join(__dirname, "books.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteCategoryById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "books.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.categories, function(i) {
      return i.id == id;
    });

    // check occurence
    for (let i = 0; i < dataParsed.books.length; i++) {
      if (dataParsed.books[i].category == item.id) {
        return "Cannot delete a category, without deleting books under it first";
      }
    }

    //remove it
    var categoriesAfterRemove = dataParsed.categories.filter(
      c => c.id != item.id
    );
    //add it to the parsed data and stringify it again to save it in file
    dataParsed.categories = categoriesAfterRemove;
    var afterRemoveFile = JSON.stringify(dataParsed);

    await writeFile(path.join(__dirname, "books.json"), afterRemoveFile);
    return item;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById
};
