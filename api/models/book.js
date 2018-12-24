//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");
const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const { readAll } = require("./db/db");

const writeFile = util.promisify(fs.writeFile);

// const Book = mongoose.model(
//   "Book",
//   new mongoose.Schema({
//     title: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 300
//     },
//     author: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Author"
//     },
//     description: {
//       type: String,
//       maxlength: 500
//     },
//     isbn: {
//       type: String,
//       maxlength: 50
//     },
//     publishYear: {
//       type: Number
//     },
//     pagesNumber: Number,
//     image: String,
//     author: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Category"
//     }
//   })
// );

const readBookById = async id => {
  try {
    const data = await readAll();
    var item = _.find(data.books, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const createBook = async book => {
  try {
    const data = await readAll();
    var books = data.books;

    var bookId = uuidv4();
    book.id = bookId;

    //to check if category/author provided is in my database and if not, book does not get updated
    var categoryCheck = _.find(data.categories, function(i) {
      return i.id == book.category;
    });

    var authorCheck = _.find(data.authors, function(i) {
      return i.id == book.author;
    });

    //Invalid data check
    if (
      book.title == undefined ||
      book.title.trim() == "" ||
      book.isbn == undefined ||
      book.isbn.trim().length < 34 ||
      (book.category != undefined && categoryCheck == undefined) ||
      (book.author != undefined && authorCheck == undefined)
    ) {
      return "Invalid data, please send valid data and try again";
    }
    //Created Successfully
    else {
      //Push it
      books.push(book);
    }
    var newFile = JSON.stringify(data);

    await writeFile(path.join(__dirname, "books.json"), newFile);
    return book;
  } catch (e) {
    throw e;
  }
};

const updateBookById = async (id, book) => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.books, function(i) {
      return i.id == id;
    });

    //to check if category/author provided is in my database and if not, book does not get updated
    var categoryCheck = _.find(data.categories, function(i) {
      return i.id == book.category;
    });

    var authorCheck = _.find(data.authors, function(i) {
      return i.id == book.author;
    });

    //check if paramters is not in the body and if it's in, it is not empty and valid
    //and based on such either update or return bad request
    if (
      (book.title == undefined || book.title.trim() != "") &&
      (book.isbn == undefined || book.isbn.trim().length > 34) &&
      (book.category == undefined || categoryCheck != undefined) &&
      (book.author == undefined || authorCheck != undefined)
    ) {
      //actual update
      item.title = book.title || item.title;
      item.author = book.author || item.author;
      item.description = book.description || item.description;
      item.isbn = book.isbn || item.isbn;
      item.publishYear = book.publishYear || item.publishYear;
      item.pagesNumber = book.pagesNumber || item.pagesNumber;
      item.image = book.image || item.image;
      item.category = book.category || item.category;
    }
    //Invalid data check
    else {
      return "Invalid data, please send valid data and try again";
    }

    //Stringify it again to save it in file
    var afterUpdateFile = JSON.stringify(data);
    await writeFile(path.join(__dirname, "books.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteBookById = async id => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.books, function(i) {
      return i.id == id;
    });
    //remove it
    var booksAfterRemove = data.books.filter(b => b.id != item.id);
    //add it to the parsed data and stringify it again to save it in file
    data.books = booksAfterRemove;
    var afterRemoveFile = JSON.stringify(data);
    await writeFile(path.join(__dirname, "books.json"), afterRemoveFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const sortBooks = async (books, sortBy) => {
  try {
    var sortedBooks = _.sortBy(books, sortBy);
    return sortedBooks;
  } catch (e) {
    throw e;
  }
};

const getBooks = async options => {
  try {
    const data = await readAll();
    var books = data.books;
    var length = books.length;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;

    if (page == undefined && size == undefined && sortBy == undefined) {
      return books; //Normal GET all with no filterations
    } else if (page < 1 || page == undefined || size < 1) {
      var defaultBooks = _.take(books, 10);

      //console.log("page less than 1");

      if (
        sortBy != undefined &&
        (options.sortBy.length > 0 || options.sortBy.trim() != "")
      ) {
        return await sortBooks(defaultBooks, sortBy); //if page length is less than 1
      }

      return defaultBooks;
    } else if (page > length / 10 || size > length) {
      //console.log("inside size more than limit");
      var droppedBooks = _.drop(books, length - (size || 10));
      defaultBooks = _.take(droppedBooks, size || 10);

      return defaultBooks; // if page number/size is more than authors length
    } else {
      //console.log("normal scenario");
      var booksSkipped = _.drop(books, (page - 1) * size);
      var pickedBooks = _.take(booksSkipped, size);

      if (
        sortBy != undefined &&
        (options.sortBy.length > 0 || options.sortBy.trim() != "")
      ) {
        return await sortBooks(pickedBooks, sortBy);
      } else return _.take(pickedBooks, size); //normal scenario
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readBookById,
  deleteBookById,
  updateBookById,
  createBook,
  getBooks
};
