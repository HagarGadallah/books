const express = require("express");
var router = express.Router();

//importing controllers
const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorcontroller");
const categoryController = require("../controllers/categoryController");

//Home Page
// router.get("/", function(req, res, next) {
//   res.json({ title: "Books Express app" });
// });

//Books Routes
router.get("/api/book/all", bookController.getAll);
router.get("/api/book/:id", bookController.get);
// router.post("/api/book/create", bookController.create);
// router.put("/api/user/book/:id", bookController.update);
router.delete("/api/delete/book/:id", bookController.delete);

//Authors Routes
router.get("/api/author/all", authorController.getAll);
router.get("/api/author/:id", authorController.get);

//Categories Routes
router.get("/api/category/all", categoryController.getAll);
router.get("/api/category/:id", categoryController.get);

module.exports = router;
