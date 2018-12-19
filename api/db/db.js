const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");
var Joi = require("Joi");
//const { validateCategory } = require("../models/category");
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
//DELETE Section
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
//DELETE Section End

//UPDATE Section
const updateCategoryById = async (id, category) => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
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
    await writeFile(path.join(__dirname, "booksTest.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const updateAuthorById = async (id, author) => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.authors, function(i) {
      return i.id == id;
    });

    //check if name is not in the body and if it's in, it is not empty and same for the job title
    //and based on such either update or return bad request
    if (
      (author.name == undefined || author.name.trim() != "") &&
      (author.jobTitle == undefined || author.jobTitle.trim() != "")
    ) {
      //actual update
      item.name = author.name || item.name;
      item.jobTitle = author.jobTitle || item.jobTitle;
      item.bio = author.bio || item.bio;
    }
    //Invalid data check
    else {
      return "Invalid data, please send valid data and try again";
    }

    //Stringify it again to save it in file
    var afterUpdateFile = JSON.stringify(dataParsed);
    await writeFile(path.join(__dirname, "booksTest.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const updateBookById = async (id, book) => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    //get the item
    var item = _.find(dataParsed.books, function(i) {
      return i.id == id;
    });

    //to check if category/author provided is in my database and if not, book does not get updated
    var categoryCheck = _.find(dataParsed.categories, function(i) {
      return i.id == book.category;
    });

    var authorCheck = _.find(dataParsed.authors, function(i) {
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
    var afterUpdateFile = JSON.stringify(dataParsed);
    await writeFile(path.join(__dirname, "booksTest.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

//UPDATE Section end

module.exports = {
  readAll,
  readBookById,
  readAuthorById,
  readCategoryById,
  deleteBookById,
  deleteAuthorById,
  deleteCategoryById,
  updateCategoryById,
  updateAuthorById,
  updateBookById
};
