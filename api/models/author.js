//const mongoose = require("mongoose");
//var validate = require("uuid-validate");
//var Joi = require("Joi");
const _ = require("lodash");
const uuidv1 = require("uuid/v1");
const {
  readAll,
  write,
  finalizeSort
} = require("../models/utilities/utilities");
const validate = require("uuid-validate");

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
    var valid = validate(id);
    if (!valid) {
      return "No id match";
    } else {
      var item = _.find(data.authors, function(i) {
        return i.id == id;
      });
      return item;
    }
  } catch (e) {
    throw e;
  }
};

const createAuthor = async author => {
  try {
    var data = await readAll();
    var authors = data.authors;

    const name = author.name;
    const jobTitle = author.jobTitle;

    const item = _.find(authors, function(i) {
      return i.name == name && i.jobTitle == jobTitle;
    });

    if (item == undefined) {
      var authorId = uuidv1();
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

      await write(data);
      return author;
    } else return item; //author already existing in db
  } catch (e) {
    throw e;
  }
};

const updateAuthorById = async (id, author) => {
  try {
    var data = await readAll();
    //get the item
    var item = _.find(data.authors, function(i) {
      return i.id == id;
    });

    if (item == undefined) {
      return "No id match";
    }
    //check if name is not in the body and if it's in, it is not empty and same for the job title
    //and based on such either update or return bad request
    else if (
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

    //save it in file
    await write(data);

    return item;
  } catch (e) {
    throw e;
  }
};

const deleteAuthorById = async id => {
  try {
    var data = await readAll();
    //get the item
    var item = await readAuthorById(id);

    if (item == undefined) {
      return "No id match";
    }

    // check occurence
    for (let i = 0; i < data.books.length; i++) {
      if (data.books[i].author == item.id) {
        return "Cannot delete an author, without deleting his/her books first";
      }
    }

    //remove it
    var authorsAfterRemove = data.authors.filter(a => a.id != item.id);
    //add it to data and save it in file
    data.authors = authorsAfterRemove;

    await write(data);
    return item;
  } catch (e) {
    throw e;
  }
};

const getAuthors = async options => {
  try {
    var data = await readAll();
    var authors = data.authors;
    var size = options.size;
    var page = options.page;
    var sortBy = options.sortBy;

    if (page == undefined && size == undefined && sortBy == undefined) {
      return authors; //Normal GET all with no filterations
    } else {
      return await finalizeSort(authors, page, size, sortBy);
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
