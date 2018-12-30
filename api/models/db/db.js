const fs = require("fs");
var path = require("path");
const util = require("util");
const _ = require("lodash");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const readAll = async () => {
  try {
    const data = await readFile(path.join(__dirname, "../books.json"));
    const dataParsed = JSON.parse(data);
    return dataParsed;
  } catch (e) {
    throw e;
  }
};

const sort = async (collection, sortBy) => {
  try {
    var sortedCollection = _.sortBy(collection, sortBy);
    return sortedCollection;
  } catch (e) {
    throw e;
  }
};

const finalizeSort = async (collection, page, size, sortBy) => {
  try {
    var defaultCollection;
    var length = collection.length;

    if (page < 1 || page == undefined) {
      defaultCollection = _.take(collection, size || 10);

      if (sortBy != undefined && sortBy.trim() != "") {
        return await sort(defaultCollection, sortBy); //if page length is less than 1
      }

      return defaultCollection;
    } else if (page > length / 10 || size > length) {
      var droppedCollection = _.drop(collection, length - (size || 10));
      defaultCollection = _.take(droppedCollection, size || 10);

      if (sortBy != undefined && sortBy.trim() != "") {
        return await sort(defaultCollection, sortBy);
      }

      return defaultCollection; // if page number/size is more than collection's length
    } else {
      var documentsSkipped = _.drop(collection, (page - 1) * size);
      var pickedDocuments = _.take(documentsSkipped, size);

      if (sortBy != undefined && sortBy.trim() != "") {
        return await sort(pickedDocuments, sortBy);
      } else return _.take(pickedDocuments, size); //normal scenario
    }
  } catch (e) {
    throw e;
  }
};

const write = async data => {
  try {
    var newFile = JSON.stringify(data);
    await writeFile(path.join(__dirname, "../books.json"), newFile);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  readAll,
  sort,
  write,
  finalizeSort
};
