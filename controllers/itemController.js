const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.render("index", { title: "Inventory" });
});

exports.itemDescription = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemCreateGet = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemCreatePost = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemUpdateGet = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemUpdatePost = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemDeleteGet = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});

exports.itemDeletePost = asyncHandler(async (req, res, next) => {
  res.send(`Not Implemented`);
});
