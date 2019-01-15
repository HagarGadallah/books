const {
  readBookById,
  deleteBookById,
  updateBookById,
  createBook,
  getBooks
} = require("../models/book");

const {
  getCreatedAt,
  getCurrentTime
} = require("../models/utilities/utilities");

const logger = require("../logger");

module.exports.getAll = async function(req, res) {
  try {
    /* var page = req.query.page;
       var size = req.query.size;
       var filter = req.query.filter;
       var sort = req.query.sort;*/
    var options = {
      page: req.body.page,
      size: req.body.size,
      sortBy: req.body.sortBy,
      filterBy: req.body.filterBy
    };
    let filteredBooks = await getBooks(options);
    res.status(200).json({
      data: filteredBooks,
      message: "Books loaded successfully"
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.get = async function(req, res) {
  try {
    let book = await readBookById(req.params.id);
    if (book == "No id match") {
      res.status(404).json({
        data: book,
        message: "Book not found"
      });
      return;
    }
    res.status(200).json({
      data: book,
      message: "Book found successfully"
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.delete = async function(req, res) {
  try {
    let book = await deleteBookById(req.params.id);
    if (book == "No id match") {
      res.status(404).json({
        data: book,
        message: "Book is neither found nor removed"
      });
      return;
    }
    res.status(200).json({
      data: book,
      message: "Book removed successfully"
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.update = async function(req, res) {
  try {
    var bookId = req.params.id;
    let updatedBook = await updateBookById(bookId, req.body);
    if (updatedBook == "Invalid data, please send valid data and try again") {
      res.status(400).json({
        data: updatedBook,
        message: "Book was not updated"
      });
      return;
    } else if (updatedBook == "No id match") {
      res.status(404).json({
        data: updatedBook,
        message: "Book is neither found nor removed"
      });
      return;
    }
    res.status(200).json({
      data: updatedBook,
      message: "Book updated successfully"
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.create = async function(req, res) {
  try {
    var book = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      isbn: req.body.isbn,
      publishYear: req.body.publishYear,
      pagesNumber: req.body.pagesNumber,
      image: req.body.image,
      category: req.body.category
    };
    let newBook = await createBook(book);
    if (newBook == "Invalid data, please send valid data and try again") {
      res.status(400).json({
        data: newBook,
        message: "Book was not created"
      });
      return;
    } else if (newBook == "There is no category with such data available") {
      res.status(400).json({
        data: newBook,
        message: "Book was not created"
      });
      return;
    } else if (newBook == "There is no author with such data available") {
      res.status(400).json({
        data: newBook,
        message: "Book was not created"
      });
      return;
    } else if (getCreatedAt(newBook.id) < getCurrentTime()) {
      res.status(200).json({
        data: newBook,
        message: "Book already exists"
      });
      return;
    }
    res.status(201).json({
      data: newBook,
      message: "Book created successfully"
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};
