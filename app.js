const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const Item = require("./models/item");
const Comment = require("./models/comments");
const SeedDB = require("./seeds");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect(
  "mongodb+srv://admin-malyz:test123@cluster0-bpx1g.mongodb.net/pubShopDB",
  { useNewUrlParser: true }
);

// SeedDB();

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/home", (req, res) => {
  Item.find({}, (err, items) => {
    if (!err) {
      res.render("items/home", { items });
    }
  });
});

app.post("/home", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  Item.create({ name, image, description }, (err, newItem) => {
    if (!err) {
      res.redirect("items/home");
    }
  });
});

app.get("/home/new", (req, res) => {
  res.render("items/new");
});

app.get("/home/:id", (req, res) => {
  Item.findById(req.params.id)
    .populate("comments")
    .exec((err, found) => {
      if (!err) {
        res.render("items/show", { item: found });
      }
    });
});

// =====================================================
// COMMENT ROUTES
// =====================================================

app.get("/home/:id/comments/new", (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (!err) {
      res.render("comments/new", { item });
    }
  });
});

app.post("/home/:id/comments", (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (err) {
      res.redirect("/home");
    } else {
      Comment.create(req.body.comment, (err, result) => {
        if (!err) {
          item.comments.push(result);
          item.save();
          res.redirect(`/home/${item._id}`);
        }
      });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started");
});
