const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fname: String,
  lname: String,
  address: String,
  email: String,
  contact: String,
  type: String,
  username: String,
  password: String,
  shopNumber: Number
});

mongoose.model("users", userSchema);
