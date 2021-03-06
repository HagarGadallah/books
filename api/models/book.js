//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");
const _ = require("lodash");
const uuidv1 = require("uuid/v1");
const validate = require("uuid-validate");
const {
  readAll,
  write,
  finalizeSort
} = require("../models/utilities/utilities");

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
    var valid = validate(id);
    if (!valid) {
      return "No id match";
    } else {
      var item = _.find(data.books, function(i) {
        return i.id == id;
      });
      return item;
    }
  } catch (e) {
    throw e;
  }
};

const createBook = async book => {
  try {
    const data = await readAll();
    var books = data.books;

    const title = book.title;
    const isbn = book.isbn;

    const item = _.find(books, function(i) {
      return i.title == title && i.isbn == isbn;
    });

    if (item == undefined) {
      var bookId = uuidv1();
      book.id = bookId;

      //to check if category/author provided is in my database and if not, book does not get updated
      var categoryCheck = _.find(data.categories, function(i) {
        return i.name == book.category;
      });

      var authorCheck = _.find(data.authors, function(i) {
        return i.name == book.author;
      });

      if (book.category != undefined && categoryCheck == undefined) {
        return "There is no category with such data available";
      } else if (book.author != undefined && authorCheck == undefined) {
        return "There is no author with such data available";
      }
      //Invalid data check
      else if (
        book.title == undefined ||
        book.title.trim() == "" ||
        book.isbn == undefined ||
        book.isbn.trim().length < 20
      ) {
        return "Invalid data, please send valid data and try again";
      }
      //Created Successfully
      else {
        //Push it
        books.push(book);
      }

      await write(data);
      return book;
    } else return item; //book already existing in db;
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

    if (item == undefined) {
      return "No id match";
    }
    //check if paramters is not in the body and if it's in, it is not empty and valid
    //and based on such either update or return bad request
    if (
      (book.title == undefined || book.title.trim() != "") &&
      (book.isbn == undefined || book.isbn.trim().length > 30) &&
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

    // save it in file
    await write(data);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteBookById = async id => {
  try {
    const data = await readAll();
    //get the item
    var item = await readBookById(id);

    if (item == undefined) {
      return "No id match";
    }

    //remove it
    var booksAfterRemove = data.books.filter(b => b.id != item.id);
    //add it to data and save it in file
    data.books = booksAfterRemove;

    await write(data);

    return item;
  } catch (e) {
    throw e;
  }
};

const getBooks = async options => {
  try {
    const data = await readAll();
    var books = data.books;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;
    var filterBy = options.filterBy;

    if (
      page == undefined &&
      size == undefined &&
      sortBy == undefined &&
      filterBy == undefined
    ) {
      return books; //Normal GET all with no filterations
    } else {
      return await finalizeSort(books, page, size, sortBy, filterBy);
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
