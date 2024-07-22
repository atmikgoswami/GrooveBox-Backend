const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide album name"],
    maxlength: [20, "Album Name should be within 20 characters"],
  },
  releaseDate: {
    type: Date,
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  artists: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Artist",
      required: true,
    },
  ],
  tracks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Track",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Album", albumSchema);
