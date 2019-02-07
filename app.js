const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOveride = require("method-override");
// user made
const Item = require("./models/item");
const Comment = require("./models/comments");
const User = require("./models/user");
const SeedDB = require("./seeds");
// import routes
const indexRoutes = require("./routes/index");
const homeRoutes = require("./routes/home");
const commentRoutes = require("./routes/comments");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));

mongoose.connect(
  "mongodb+srv://admin-malyz:test123@cluster0-bpx1g.mongodb.net/pubShopDB",
  { useNewUrlParser: true }
);

// SeedDB();

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "qwerttyyuuupoiusdfdcfwewv",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(homeRoutes);
app.use(commentRoutes);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started");
});
