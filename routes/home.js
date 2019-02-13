const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Comment = require("../models/comments");
const _ = require("lodash");
const middleware = require("../middleware");
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "malyz",
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET
});

// show Homepage
router.get("/home", (req, res) => {
  Item.find({}, (err, items) => {
    if (!err) {
      res.render("items/home", { items });
    }
  });
});

// create new Post
router.post(
  "/home",
  middleware.isLoggedIn,
  upload.single("image"),
  (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      req.body.item.image = result.secure_url;
      req.body.item.imageId = result.public_id;
      req.body.item.author = {
        id: req.user._id,
        username: req.user.username
      };
      Item.create(req.body.item, (err, item) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        res.redirect(`/home/${item._id}`);
      });
    });
  }
);

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
router.put(
  "/home/:id",
  middleware.checkItemOwnership,
  upload.single("image"),
  (req, res) => {
    Item.findById(req.params.id, async (err, item) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        if (req.file) {
          try {
            await cloudinary.v2.uploader.destroy(item.imageId);
            let result = await cloudinary.v2.uploader.upload(req.file.path);
            item.imageId = result.public._id;
            item.image = result.secure_url;
          } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
        }
        item.name = req.body.name;
        item.price = req.body.price;
        item.description = req.body.description;
        item.save();
        req.flash("success", "Update successful");
        res.redirect(`/home/${item._id}`);
      }
    });
  }
);

// delete Post
router.delete("/home/:id", middleware.checkItemOwnership, (req, res) => {
  Item.findById(req.params.id, async (err, result) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      await cloudinary.v2.uploader.destroy(result.imageId);
    } catch (err) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
    }
    Comment.deleteMany({ _id: { $in: result.comments } }, err => {
      if (err) {
        res.redirect("/home");
      }
    });
    result.remove();
    req.flash("success", `Successfully deleted: ${result.name.toUpperCase()}`);
    res.redirect("/home");
  });
});

module.exports = router;
