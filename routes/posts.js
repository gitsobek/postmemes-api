const mongoose = require("mongoose");
const checkLogin = require("../middlewares/checkLogin");
const clearCache = require("../middlewares/clearCache");

const Post = mongoose.model("Post");

module.exports = app => {
  app.get("/api/posts/:id", checkLogin, async (req, res) => {
    const post = await Post.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    if (!post) return res.status(404).send({ message: "No such post." });

    return res.status(200).send(post);
  });

  app.get("/api/posts", checkLogin, async (req, res) => {
    const posts = await Post.find({ _user: req.user.id }).cache({
      key: req.user.id
    });

    if (!posts) return res.status(404).send({ message: "No posts." });

    return res.status(200).send(posts);
  });

  app.post("/api/posts", checkLogin, clearCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    const post = new Post({
      imageUrl,
      title,
      content,
      _user: req.user.id
    });

    try {
      await post.save();
      res.send(post);
    } catch (err) {
      res.send(400, err);
    }
  });
};
