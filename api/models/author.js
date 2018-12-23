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
    const data = await readAll();
    var item = _.find(data.authors, function(i) {
      return i.id == id;
    });
    return item;
  } catch (e) {
    throw e;
  }
};

const createAuthor = async author => {
  try {
    const data = await readAll();
    var authors = data.authors;

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
    var newFile = JSON.stringify(data);

    await writeFile(path.join(__dirname, "books.json"), newFile);
    return author;
  } catch (e) {
    throw e;
  }
};

const updateAuthorById = async (id, author) => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.authors, function(i) {
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
    var afterUpdateFile = JSON.stringify(data);
    await writeFile(path.join(__dirname, "books.json"), afterUpdateFile);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteAuthorById = async id => {
  try {
    const data = await readAll();
    //get the item
    var item = _.find(data.authors, function(i) {
      return i.id == id;
    });

    // check occurence
    for (let i = 0; i < data.books.length; i++) {
      if (data.books[i].author == item.id) {
        return "Cannot delete an author, without deleting his/her books first";
      }
    }

    //remove it
    var authorsAfterRemove = data.authors.filter(a => a.id != item.id);
    //add it to the parsed data and stringify it again to save it in file
    data.authors = authorsAfterRemove;
    var afterRemoveFile = JSON.stringify(data);

    await writeFile(path.join(__dirname, "books.json"), afterRemoveFile);
    return item;
  } catch (e) {
    throw e;
  }
};

const sortAuthors = async (authors, sortBy) => {
  try {
    var sortedAuthors = _.sortBy(authors, sortBy);
    return sortedAuthors;
  } catch (e) {
    throw e;
  }
};

const getAuthors = async options => {
  try {
    const data = await readAll();
    var authors = data.authors;
    var length = authors.length;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;

    if (page == undefined && size == undefined && sortBy == undefined) {
      return authors; //Normal GET all with no filterations
    } else if (page < 1 || page == undefined) {
      var defaultAuthors = _.take(authors, size || 10);

      if (
        (sortBy != undefined && options.sortBy.length > 0) ||
        options.sortBy.trim() != ""
      ) {
        return await sortAuthors(defaultAuthors, sortBy); //if page length is less than 1
      }

      return defaultAuthors;
    } else if (page > length / 10 || size > length) {
      //console.log("inside size more than limit");
      var droppedAuthors = _.drop(authors, length - (size || 10));
      defaultAuthors = _.take(droppedAuthors, size || 10);

      return defaultAuthors; // if page number/size is more than authors length
    } else {
      //console.log("normal scenario");
      var authorsSkipped = _.drop(authors, (page - 1) * size);
      var pickedAuthors = _.take(authorsSkipped, size);

      if (
        (sortBy != undefined && options.sortBy.length > 0) ||
        options.sortBy.trim() != ""
      ) {
        return await sortAuthors(pickedAuthors, sortBy);
      } else return _.take(pickedAuthors, size); //normal scenario
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readAuthorById,
  deleteAuthorById,
  updateAuthorById,
  createAuthor,
  getAuthors
};
