const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Item = require("../models/item");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const _ = require("lodash");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  if (req.body.password === req.body.confirmPassword) {
    let newUser = new User({
      username: req.body.username,
      email: req.body.email
    });
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
  } else {
    req.flash("error", "Password did not match");
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    let username = _.capitalize(req.user.username);
    req.flash("success", `Welcome back to PubShop ${username}!`);
    res.redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged out");
  res.redirect("/home");
});

router.get("/forgot", (req, res) => {
  res.render("forgot");
});

router.post("/forgot", (req, res, next) => {
  async.waterfall(
    [
      done => {
        crypto.randomBytes(20, (err, buf) => {
          let token = buf.toString("hex");
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, foundUser) => {
          if (!foundUser) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          foundUser.resetPasswordToken = token;
          foundUser.resetPasswordExpires = Date.now() + 3600000; //1hour

          foundUser.save(err => {
            done(err, token, foundUser);
          });
        });
      },
      (token, foundUser, done) => {
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          secure: false,
          auth: {
            user: "autoresponse1010@gmail.com",
            pass: process.env.GMAILPW
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        let mailOptions = {
          to: foundUser.email,
          from: "autoresponse1010@gmail.com",
          subject: "PubShop Password Reset",
          text: `You are receiving this email because you have requested to reset your password.\nIf you did not request for this, kindly ignore this email.\nPlease click on the following link or paste this into your browser to complete the process:\nhttps://experimentalpubshop.herokuapp.com/reset/${token}`
        };
        smtpTransport.sendMail(mailOptions, err => {
          req.flash(
            "success",
            `An email has been sent to ${
              foundUser.email
            } with further instructions.`
          );
          done(err, "done");
        });
      }
    ],
    err => {
      if (err) return next(err);
      res.redirect("/home");
    }
  );
});

router.get("/reset/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    (err, foundUser) => {
      if (!foundUser) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", (req, res) => {
  if (req.body.password === req.body.confirmPassword) {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      async (err, foundUser) => {
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          secure: false,
          auth: {
            user: "autoresponse1010@gmail.com",
            pass: process.env.GMAILPW
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        let mailOptions = {
          to: foundUser.email,
          from: "autoresponse1010@gmail.com",
          subject: "Your password has been changed",
          text: `Hello ${
            foundUser.username
          },\nYou have successfully changed your password.\n\nRegards,\nPubShop`
        };
        try {
          let updatedUser = await foundUser.setPassword(req.body.password);
          updatedUser.resetPasswordToken = undefined;
          updatedUser.resetPasswordExpires = undefined;
          let result = await updatedUser.save();
          req.logIn(result, err => {});
          smtpTransport.sendMail(mailOptions);
          req.flash("success", `You have successfully changed your password`);
          return res.redirect("/home");
        } catch (err) {
          req.flash("error", err.message);
          return res.redirect("/home");
        }
      }
    );
  } else {
    req.flash("error", "Passwords does not match");
    return res.redirect("back");
  }
});

module.exports = router;
