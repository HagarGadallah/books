const {
  readAuthorById,
  deleteAuthorById,
  updateAuthorById,
  createAuthor,
  getAuthors
} = require("../models/author");

module.exports.getAll = async function(req, res) {
  try {
    /* var page = req.query.page;
       var size = req.query.size;
       var filter = req.query.filter;
       var sort = req.query.sort;*/
    var options = {
      page: req.body.page,
      size: req.body.size,
      sortBy: req.body.sortBy
    };
    let filteredAuthors = await getAuthors(options);
    res.status(200).json({
      data: filteredAuthors,
      message: "Authors loaded successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.get = async function(req, res) {
  try {
    let author = await readAuthorById(req.params.id);
    if (author == "No id match") {
      res.status(404).json({
        data: author,
        message: "Author not found"
      });
      return;
    }
    res.status(200).json({
      data: author,
      message: "Author found successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.delete = async function(req, res) {
  try {
    let author = await deleteAuthorById(req.params.id);
    if (
      author == "Cannot delete an author, without deleting his/her books first"
    ) {
      res.status(400).json({
        data: author,
        message: "Author was not removed"
      });
      return;
    } else if (author == "No id match") {
      res.status(404).json({
        data: author,
        message: "Author is neither found nor removed"
      });
      return;
    }
    res.status(200).json({
      data: author,
      message: "Author removed successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.update = async function(req, res) {
  try {
    var authorId = req.params.id;
    let updatedAuthor = await updateAuthorById(authorId, req.body);
    if (updatedAuthor == "Invalid data, please send valid data and try again") {
      res.status(400).json({
        data: updatedAuthor,
        message: "Author was not updated"
      });
      return;
    } else if (updatedAuthor == "No id match") {
      res.status(404).json({
        data: updatedAuthor,
        message: "Author is neither found nor updated"
      });
      return;
    }
    res.status(200).json({
      data: updatedAuthor,
      message: "Author updated successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};

module.exports.create = async function(req, res) {
  try {
    var author = {
      name: req.body.name,
      jobTitle: req.body.jobTitle,
      bio: req.body.bio
    };
    let newAuthor = await createAuthor(author);
    if (newAuthor == "Invalid data, please send valid data and try again") {
      res.status(400).json({
        data: newAuthor,
        message: "Author was not created"
      });
      return;
    } else if (
      newAuthor == "Author with the same name and job title already exists"
    ) {
      res.status(200).json({
        data: newAuthor,
        message: "Author was not created"
      });
      return;
    }
    res.status(200).json({
      data: newAuthor,
      message: "Author created successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: null,
      message: "Internal server error",
      error: e
    });
  }
};
