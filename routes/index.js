const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "secretcode") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome ${user.username} to PubShop!`);
      res.redirect("/home");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to PubShop!"
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged out");
  res.redirect("/home");
});

module.exports = router;
