const fs = require("fs");
var path = require("path");
const util = require("util");
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

// const readBookById = async id => {
//   try {
//     const data = await readFile(path.join(__dirname, "books.json"));
//     const dataParsed = JSON.parse(data);
//     var book = new Book();
//     book.id = dataParsed.books.id;
//     return dataParsed;
//   } catch (e) {
//     throw e;
//   }
// };

module.exports = {
  readAll
  //readBookById
};
