const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  attributes: [
    {
      key: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
});

// Pre-save middleware to auto-generate categoryId
categorySchema.pre("save", async function (next) {
  if (!this.categoryId) {
    const count = await mongoose.model("Category").countDocuments();
    this.categoryId = count + 1;
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
