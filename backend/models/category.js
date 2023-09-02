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
    const biggestCateId = await Category.find()
      .sort({ categoryId: -1 })
      .limit(1);

    if (biggestCateId[0].categoryId > count) {
      console.log("oke");
      this.categoryId = biggestCateId[0].categoryId + 1;
    } else {
      console.log("not oke");
      this.categoryId = count + 1;
    }
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
