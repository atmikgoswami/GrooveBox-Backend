const Artist = require("../models/artists");
const Album = require("../models/albums");
const Track = require("../models/tracks");
const BigPromise = require("../middleware/bigPromise");
const cloudinary = require("cloudinary");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

exports.addNewTrack = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return res.status(400).send("No file uploaded");
  }

  let file = req.files.uri;
  console.log(file.tempFilePath);
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "tracks",
    resource_type: "video",
  });

  console.log(result.secure_url);

  req.body.uri = result.secure_url;

  const track = await Track.create(req.body);

  const updatedAlbum = await Album.findByIdAndUpdate(
    req.body.album,
    { $push: { tracks: track._id } },
    { new: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    track,
  });
});

exports.updateNumberOfLikes = BigPromise(async (req, res, next) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return next(new CustomError("No track found with this id", 401));
  }

  track.numberOfLikes += 1;

  await track.save();

  res.status(200).json({
    success: true,
    track,
  });
});

exports.getTrackByID = BigPromise(async (req, res, next) => {
  const track = await Track.findById(req.params.id);

  if (!track) {
    return next(new CustomError("No track found with this id", 401));
  }

  res.status(200).json({
    success: true,
    track,
  });
});

exports.getAllTracks = BigPromise(async (req, res, next) => {
  const resultPerPage = 10;

  const trackObj = new WhereClause(Track.find(), req.query)
    .searchTrack()
    .filter();

  let tracks = await trackObj.base;
  const filteredTrackNumber = tracks.length;

  trackObj.pager(resultPerPage);
  tracks = await trackObj.base.clone();

  res.status(200).json({
    success: true,
    tracks,
    filteredTrackNumber,
  });
});
