require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
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
app.use(flash());

mongoose.connect(`${process.env.MONGO_URL}pubShopDB`, {
  useNewUrlParser: true
});

// SeedDB();

app.locals.moment = require("moment");

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: process.env.SECRET,
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
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(indexRoutes);
app.use(homeRoutes);
app.use(commentRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started");
});
