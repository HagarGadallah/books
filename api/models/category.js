const mongoose = require("mongoose");
var validate = require("uuid-validate");
var Joi = require("Joi");

var Category = mongoose.model(
  "Category",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
);

function validateCategory(category) {
  const schema = {
    id: validate(id),
    name: Joi.string().required()
  };

  return Joi.validate(category, schema);
}

exports.exports = { Category, validateCategory };
