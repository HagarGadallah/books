const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");
const Book = require("../models/book");

const readFile = util.promisify(fs.readFile);

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

module.exports = {
  readAll,
  readBookById,
  readAuthorById,
  readCategoryById
};
