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
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
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
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/home");
});

module.exports = router;
