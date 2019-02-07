const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Comment = require("../models/comments");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/home/:id/comments/new", isLoggedIn, (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (!err) {
      res.render("comments/new", { item });
    }
  });
});

router.post("/home/:id/comments", isLoggedIn, (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (err) {
      res.redirect("/home");
    } else {
      Comment.create(req.body.comment, (err, result) => {
        if (!err) {
          result.author.id = req.user._id;
          result.author.username = req.user.username;
          result.save();
          item.comments.push(result);
          item.save();
          res.redirect(`/home/${item._id}`);
        }
      });
    }
  });
});

router.get("/home/:id/comments/:comment_id/edit", (req, res) => {
  res.send("edit comment");
});

module.exports = router;
