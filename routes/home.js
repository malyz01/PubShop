const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Comment = require("../models/comments");
const _ = require("lodash");
const middleware = require("../middleware");

// show Homepage
router.get("/home", (req, res) => {
  Item.find({}, (err, items) => {
    if (!err) {
      res.render("items/home", { items });
    }
  });
});

// create new Post
router.post("/home", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user.id,
    username: req.user.username
  };
  Item.create({ name, image, description, author }, (err, newItem) => {
    if (!err) {
      res.redirect("/home");
    }
  });
});

// get Form
router.get("/home/new", middleware.isLoggedIn, (req, res) => {
  res.render("items/new");
});

// Show
router.get("/home/:id", (req, res) => {
  Item.findById(req.params.id)
    .populate("comments")
    .exec((err, found) => {
      if (err || !found) {
        req.flash("error", "Item not found");
        res.redirect("back");
      } else {
        res.render("items/show", { item: found });
      }
    });
});

// show edit form page
router.get("/home/:id/edit", middleware.checkItemOwnership, (req, res) => {
  Item.findById(req.params.id, (err, found) => {
    if (!err) {
      res.render("items/edit", { item: found });
    }
  });
});

// submit Post update
router.put("/home/:id", middleware.checkItemOwnership, (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updatedItem) => {
    if (err) {
      req.flash("error", "Update error");
      res.redirect("/home");
    } else {
      req.flash("success", "Update successful");
      res.redirect(`/home/${updatedItem._id}`);
    }
  });
});

// delete Post
router.delete("/home/:id", middleware.checkItemOwnership, (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err, result) => {
    if (!err) {
      Comment.deleteMany({ _id: { $in: result.comments } }, err => {
        if (err) {
          res.redirect("/home");
        }
      });
      req.flash(
        "success",
        `Successfully deleted: ${result.name.toUpperCase()}`
      );
      res.redirect("/home");
    }
  });
});

module.exports = router;
