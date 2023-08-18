const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult, checkSchema } = require("express-validator");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "public/images/",
});

exports.index = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().populate("category").exec();

  res.render("index", { title: "Item List", allItems: allItems });
});

exports.itemDescription = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("itemDescription", {
    item: item,
  });
});

exports.itemCreateGet = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("itemForm", {
    title: "Create Item",
    categories: allCategories,
  });
});

exports.itemCreatePost = [
  upload.single("itemImage"),
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? "" : [req.body.category];
    }
    next();
  },
  body("title", "Title should be at least 2 characters long")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("rarity").trim().isLength({ min: 1 }).escape(),
  body("instock", "Stock should be a positive integer value")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("price", "Price should be a positive float value")
    .trim()
    .isFloat({ min: 0 })
    .escape(),
  body("category", "You should choose at least one category")
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description should be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  checkSchema({
    imagePath: {
      custom: {
        options: (value, { req }) =>
          undefined === req.file ? true : req.file.mimetype.match(/^image/),
        errorMessage: "File should be an image",
      },
    },
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let staticFilePath;

    if (req.file?.path) {
      staticFilePath = req.file.path.slice(req.file.path.indexOf("/"));
    }

    const item = new Item({
      title: req.body.title,
      rarity: req.body.rarity,
      inStock: req.body.instock,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      imagePath: staticFilePath,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      if (req.file?.path) {
        fs.unlink(req.file?.path, function (err) {
          if (err) throw err;
        });
      }

      res.render("itemForm", {
        title: "Create Item",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().exec(),
  ]);

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  for (const category of allCategories) {
    if (item.category.includes(category._id)) {
      category.checked = "true";
    }
  }

  res.render("itemForm", {
    title: "Update Item",
    item: item,
    categories: allCategories,
  });
});

exports.itemUpdatePost = [
  upload.single("itemImage"),
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? "" : [req.body.category];
    }
    next();
  },
  body("title", "Title should be at least 2 characters long")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("rarity").trim().isLength({ min: 1 }).escape(),
  body("instock", "Stock should be a positive integer value")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("price", "Price should be a positive float value")
    .trim()
    .isFloat({ min: 0 })
    .escape(),
  body("category", "You should choose at least one category")
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description should be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  checkSchema({
    imagePath: {
      custom: {
        options: (value, { req }) =>
          undefined === req.file ? true : req.file.mimetype.match(/^image/),
        errorMessage: "File should be an image",
      },
    },
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const currentItem = await Item.findById(req.params.id, "imagePath").exec();
    let staticFilePath;

    if (req.file?.path) {
      staticFilePath = req.file.path.slice(req.file.path.indexOf("/"));
    }

    const item = new Item({
      title: req.body.title,
      rarity: req.body.rarity,
      inStock: req.body.instock,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      imagePath: staticFilePath || currentItem.imagePath,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().exec();

      for (const category of allCategories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      if (req.file?.path) {
        fs.unlink(req.file?.path, function (err) {
          if (err) throw err;
        });
      }

      res.render("itemForm", {
        title: "Update Item",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      if (req.file?.path && currentItem.imagePath !== "/images/default.jpg") {
        fs.unlink(`public${currentItem.imagePath}`, function (err) {
          if (err) throw err;
        });
      }
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];

exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("itemDelete", { item: item });
});

exports.itemDeletePost = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.itemid);
  res.redirect("/inventory");
});
