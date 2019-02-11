const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  email: { type: String, unique: true, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
