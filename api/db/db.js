const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");
//const Book = require("../models/book");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const readAll = async () => {
  try {
    const data = await readFile(path.join(__dirname, "books.json"));
    const dataParsed = JSON.parse(data);
    return dataParsed;
  } catch (e) {
    throw e;
  }
};

// read by id section
const readBookById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    var item = _.find(dataParsed.books, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const readAuthorById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    var item = _.find(dataParsed.authors, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const readCategoryById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    var item = _.find(dataParsed.categories, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

// read by id section end
//delete section
const deleteBookById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.books, function(i) {
      return i.id == id;
    });
    //remove it
    var booksAfterRemove = dataParsed.books.filter(b => b.id != item.id);
    //add it to the parsed data and stringify it again to save it in file
    dataParsed.books = booksAfterRemove;
    var afterRemoveFile = JSON.stringify(dataParsed);
    await writeFile(path.join(__dirname, "booksTest.json"), afterRemoveFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteAuthorById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.authors, function(i) {
      return i.id == id;
    });

    // check occurence
    for (let i = 0; i < dataParsed.books.length; i++) {
      if (dataParsed.books[i].author == item.id) {
        return "Cannot delete an author, without deleting his/her books first";
      }
    }

    //remove it
    var authorsAfterRemove = dataParsed.authors.filter(a => a.id != item.id);
    //add it to the parsed data and stringify it again to save it in file
    dataParsed.authors = authorsAfterRemove;
    var afterRemoveFile = JSON.stringify(dataParsed);

    await writeFile(path.join(__dirname, "booksTest.json"), afterRemoveFile);
    return item;
  } catch (e) {
    throw e;
  }
};

const deleteCategoryById = async id => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
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

    await writeFile(path.join(__dirname, "booksTest.json"), afterRemoveFile);
    return item;
  } catch (e) {
    throw e;
  }
};
//delete section end

module.exports = {
  readAll,
  readBookById,
  readAuthorById,
  readCategoryById,
  deleteBookById,
  deleteAuthorById,
  deleteCategoryById
};
