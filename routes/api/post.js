const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { countDocuments } = require("../../models/User");

// @route POST api/post
// @des   create a post
// @acess Private
router.post(
  "/",
  [auth, [check("text", "Text is required ").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/posts
// @des   get all posts
// @acess Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET api/post/:id
// @des   get post by there id
// @acess Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/post/:id
// @des   delete post by there id
// @acess Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    //Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized",
      });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/post/like/:id
// @des   like a  post
// @acess Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if user has already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({
        msg: "post already liked",
      });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/post/unlike/:id
// @des   unlike a  post
// @acess Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if user has already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({
        msg: "post has not yet been liked",
      });
    }

    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
    res.status(500).send("Server Error");
  }
});

// @route POST api/post/comment/:id
// @des   comment on a post
// @acess Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required ").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/post/comment/:id/:comment_id
// @des   delete comment on a post
// @acess Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //get remove index
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //make sure comment exist
    if (!comment) {
      return res.status(404).json({
        msg: "comment not found",
      });
    }

    //checking user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized",
      });
    }
    //get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
