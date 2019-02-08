const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Comment = require("../models/comments");
const middleware = require("../middleware");

router.get("/home/:id/comments/new", middleware.isLoggedIn, (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (!err) {
      res.render("comments/new", { item });
    }
  });
});

router.post("/home/:id/comments", middleware.isLoggedIn, (req, res) => {
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

router.get(
  "/home/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, result) => {
      if (!err) {
        res.render("comments/edit", { item: req.params.id, comment: result });
      }
    });
  }
);

router.put(
  "/home/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, result) => {
        if (!err) {
          req.flash("success", "Updated comment successfully");
          res.redirect(`/home/${req.params.id}`);
        }
      }
    );
  }
);

router.delete(
  "/home/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, err => {
      if (!err) {
        req.flash("success", "comment removed");
        res.redirect(`/home/${req.params.id}`);
      }
    });
  }
);

module.exports = router;
