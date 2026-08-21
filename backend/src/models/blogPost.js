const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  authorEmail: {
    type: String,
  },
  blogContent: {
    type: String,
  },
  blogImg: {
    type: String,
  },
  date: {
    type: String,
  },
  blogStatus: {
    // Anyone can submit a post; it always starts as "draft" until an
    // admin reviews and either publishes ("published") or rejects/hides
    // it again ("unpublished").
    type: String,
    enum: ["draft", "published", "unpublished"],
    default: "draft",
  },
});

const blog = mongoose.model("blogs", blogSchema);

module.exports = blog;
