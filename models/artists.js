const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide artist's name"],
    maxlength: [40, "Name should be within 40 characters"],
  },
  genre: {
    type: String,
    required: [true, "Please provide artist's genre"],
    maxlength: [20, "Genre should be within 20 characters"],
  },
  numberOfFollowers: {
    type: Number,
    default: 0,
  },
  photos: [
    {
      id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  ],
  albums: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Album",
    },
  ],
});

module.exports = mongoose.model("Artist", artistSchema);
