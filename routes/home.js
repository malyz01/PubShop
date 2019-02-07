const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Comment = require("../models/comments");
const _ = require("lodash");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const checkItemOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Item.findById(req.params.id, (err, found) => {
      if (!err) {
        if (found.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

// show Homepage
router.get("/home", (req, res) => {
  Item.find({}, (err, items) => {
    if (!err) {
      res.render("items/home", { items });
    }
  });
});

// create new Post
router.post("/home", isLoggedIn, (req, res) => {
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
router.get("/home/new", isLoggedIn, (req, res) => {
  res.render("items/new");
});

// Show
router.get("/home/:id", (req, res) => {
  Item.findById(req.params.id)
    .populate("comments")
    .exec((err, found) => {
      if (!err) {
        const foundUser = _.upperFirst(found.author.username);
        res.render("items/show", { item: found, foundUser });
      }
    });
});

// show edit form page
router.get("/home/:id/edit", checkItemOwnership, (req, res) => {
  Item.findById(req.params.id, (err, found) => {
    res.render("items/edit", { item: found });
  });
});

// submit Post update
router.put("/home/:id", checkItemOwnership, (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body.item, (err, updatedItem) => {
    if (err) {
      res.redirect("/home");
    } else {
      res.redirect(`/home/${updatedItem._id}`);
    }
  });
});

// delete Post
router.delete("/home/:id", checkItemOwnership, (req, res) => {
  Item.findByIdAndDelete(req.params.id, (err, result) => {
    if (!err) {
      Comment.deleteMany({ _id: { $in: result.comments } }, err => {
        if (err) {
          res.redirect("/home");
        }
      });
      res.redirect("/home");
    }
  });
});

module.exports = router;
