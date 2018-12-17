const mongoose = require("mongoose");

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    jobTitle: {
      type: String,
      maxlength: 100
    },
    bio: {
      type: String,
      maxlength: 300
    }
  })
);

exports.exports = { Author };
