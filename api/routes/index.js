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
router.post("/api/book/create", bookController.create);
router.put("/api/update/book/:id", bookController.update);
router.delete("/api/delete/book/:id", bookController.delete);

//Authors Routes
router.post("/api/author/all", authorController.getAll);
router.get("/api/author/:id", authorController.get);
router.post("/api/author/create", authorController.create);
router.put("/api/update/author/:id", authorController.update);
router.delete("/api/delete/author/:id", authorController.delete);

//Categories Routes
router.post("/api/category/all", categoryController.getAll);
router.get("/api/category/:id", categoryController.get);
router.post("/api/category/create", categoryController.create);
router.put("/api/update/category/:id", categoryController.update);
router.delete("/api/delete/category/:id", categoryController.delete);

module.exports = router;
