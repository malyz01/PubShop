const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-malyz:test123@cluster0-bpx1g.mongodb.net/pubShopDB",
  { useNewUrlParser: true }
);

const itemSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Item = mongoose.model("Item", itemSchema);

// Item.create(
//   {
//     name: "Salmon Creek",
//     image:
//       "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     description: "This is a huge granite hill, no bathrooms."
//   },
//   (err, itemlist) => {
//     if (!err) {
//       console.log(`Successfully saved: ${itemlist}`);
//     }
//   }
// );

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/home", (req, res) => {
  Item.find({}, (err, items) => {
    if (!err) {
      res.render("home", { items });
    }
  });
});

app.post("/home", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  Item.create({ name, image, description }, (err, newItem) => {
    if (!err) {
      console.log(`Successfully added: ${newItem}`);
      res.redirect("/home");
    }
  });
});

app.get("/home/new", (req, res) => {
  res.render("new");
});

app.get("/home/:id", (req, res) => {
  Item.findById(req.params.id, (err, found) => {
    if (!err) {
      console.log(found);
      res.render("show", { item: found });
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
