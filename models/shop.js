const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopSchema = new Schema({
  name: String,
  location: String,

  shopNumber: Number
});

mongoose.model("shops", shopSchema);
