const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: [true, "Please provide track name"],
    maxlength: [20, "Track Name should be within 20 characters"],
  },
  duration: {
    type: Number,
    default: 0,
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: "Album",
  },
  artists: [
    {
      type: "String",
    },
  ],
  uri: {
    type: String,
  },
  numberOfLikes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Track", trackSchema);
