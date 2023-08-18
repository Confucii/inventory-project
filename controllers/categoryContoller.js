const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.categoryList = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("categoryList", {
    title: "Category List",
    allCategories: allCategories,
  });
});

exports.categoryDescription = asyncHandler(async (req, res, next) => {
  const [category, allCategoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category Not Found");
    err.status = 404;
    return next(err);
  }

  res.render("categoryDescription", {
    category: category,
    items: allCategoryItems,
  });
});

exports.categoryCreateGet = asyncHandler(async (req, res, next) => {
  res.render("categoryForm", { title: "Create Category" });
});

exports.categoryCreatePost = [
  body("title", "Title should be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description should be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      title: req.body.title,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ title: req.body.title })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.categoryUpdateGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("categoryForm", { title: "Update Category", category: category });
});

exports.categoryUpdatePost = [
  body("title", "Title should be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description should be at least 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      title: req.body.title,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ title: req.body.title })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          category,
          {}
        );
        res.redirect(updatedCategory.url);
      }
    }
  }),
];

exports.categoryDeleteGet = asyncHandler(async (req, res, next) => {
  const [category, allCategoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "_id title description").exec(),
  ]);

  if (category === null) {
    res.redirect("/inventory/categories");
  }

  res.render("categoryDelete", {
    title: "Delete Category",
    category: category,
    allCategoryItems: allCategoryItems,
  });
});

exports.categoryDeletePost = asyncHandler(async (req, res, next) => {
  const [category, allCategoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (allCategoryItems.length > 0) {
    res.render("categoryDelete", {
      title: "Delete Category",
      category: category,
      allCategoryItems: allCategoryItems,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});
