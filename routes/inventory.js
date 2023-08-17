const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const categoryController = require("../controllers/categoryContoller");

/* GET home page. */
router.get("/", itemController.index);

router.get("/item/:id", itemController.itemDescription);

router.get("/item/new", itemController.itemCreateGet);

router.post("/item/new", itemController.itemCreatePost);

router.get("/item/:id/update", itemController.itemUpdateGet);

router.post("/item/:id/update", itemController.itemUpdatePost);

router.get("/item/:id/delete", itemController.itemDeleteGet);

router.post("/item/:id/delete", itemController.itemDeletePost);

router.get("/categories", categoryController.categoryList);

router.get("/category/:id", categoryController.categoryDescription);

router.get("/category/new", categoryController.categoryCreateGet);

router.post("/category/new", categoryController.categoryCreatePost);

router.get("/category/:id/update", categoryController.categoryUpdateGet);

router.post("/category/:id/update", categoryController.categoryUpdatePost);

router.get("/category/:id/delete", categoryController.categoryDeleteGet);

router.post("/category/:id/delete", categoryController.categoryDeletePost);

module.exports = router;
