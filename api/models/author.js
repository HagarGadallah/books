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

// const Author = mongoose.model(
//   "Author",
//   new mongoose.Schema({
//     name: {
//       type: String,
//       required: true
//     },
//     jobTitle: {
//       type: String,
//       maxlength: 100
//     },
//     bio: {
//       type: String,
//       maxlength: 300
//     }
//   })
// );

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

const createAuthor = async author => {
  try {
    const data = await readFile(path.join(__dirname, "booksTest.json"));
    const dataParsed = JSON.parse(data);
    var authors = dataParsed.authors;

    var authorId = uuidv4();
    author.id = authorId;

    //Invalid data check
    if (
      author.name == undefined ||
      author.name.trim() == "" ||
      author.jobTitle == undefined ||
      author.jobTitle.trim() == ""
    ) {
      return "Invalid data, please send valid data and try again";
    }
    //Created Successfully
    else {
      //Push it
      authors.push(author);
    }
    var newFile = JSON.stringify(dataParsed);

    await writeFile(path.join(__dirname, "booksTest.json"), newFile);
    return author;
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

module.exports = {
  readAuthorById,
  deleteAuthorById,
  updateAuthorById,
  createAuthor
};
