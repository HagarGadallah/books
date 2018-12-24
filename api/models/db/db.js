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

const write = async data => {
  var newFile = JSON.stringify(data);
  await writeFile(path.join(__dirname, "../books.json"), newFile);
};

module.exports = {
  readAll,
  sort,
  write
};
