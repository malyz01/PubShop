const Item = require("../models/item");
const Comment = require("../models/comments");

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login or Register first...");
    res.redirect("/login");
  },
  checkItemOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Item.findById(req.params.id, (err, found) => {
        if (err || !found) {
          req.flash("error", "Item not found");
          res.redirect("back");
        } else {
          if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that...");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "Please log in first...");
      res.redirect("back");
    }
  },
  checkCommentOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, found) => {
        if (err || !found) {
          req.flash("error", "Comment does not exist.");
          res.redirect("back");
        } else {
          if (found.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that...");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "Please log in first...");
      res.redirect("back");
    }
  }
};
