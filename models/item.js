const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  rarity: { type: String, enum: ["Common", "Rare", "Epic", "Legendary"] },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Number, required: true, min: 0 },
  imagePath: { type: String, default: "/images/default.jpg" },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
