const mongoose = require("mongoose");
const { Schema } = mongoose;

const flowerSchema = new Schema({
  name: String,
  cost: Number,
  image: String
});

mongoose.model("flowers", flowerSchema);
