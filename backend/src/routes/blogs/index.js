const express = require("express");
const blog = require("../../models/blogPost");
const verifyToken = require('../../middlewares/verifyToken')

var router = express.Router();

router.post("/addBlog", async (req, res) => {
  const blogData = req.body;

  const result = await blog.create(blogData);

  res.send(result);
});

// get data for admin
router.get("/blog", async (req, res) => {
  const { page, limit } = req.query;
  const result = await blog.find().skip((page - 1) * limit).limit(limit);
  res.send(result);
});
// get data for public
router.get("/blogPublished", async (req, res) => {
  const result = await blog.find({ blogStatus: "published" }).sort({ _id: -1 });
  res.send(result);
});

// get a single blog post by id (for the blog details page)
router.get("/blog/:id", async (req, res) => {
  try {
    const result = await blog.findById(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(404).send({ message: "Blog post not found" });
  }
});

//update status blog data

router.patch("/updateBlogStatus/:id", async (req, res) => {
  const result = await blog.updateOne(
    { _id: req.params.id },
    {
      $set: {
        blogStatus: "published",
      },
    }
  );

  res.send(result);
});

// unpublished by admin
router.patch("/updateBlogStatusUnpublished/:id", async (req, res) => {
  const result = await blog.updateOne(
    { _id: req.params.id },
    {
      $set: {
        blogStatus: "unpublished",
      },
    }
  );

  res.send(result);
});

//admin delete post

router.delete("/blogDelete/:id", async (req, res) => {
  const result = await blog.deleteOne({ _id: req.params.id });
  console.log(result);
  res.send(result);
});

module.exports = router;
