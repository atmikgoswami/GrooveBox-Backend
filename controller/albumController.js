const Artist = require("../models/artists");
const Album = require("../models/albums");
const BigPromise = require("../middleware/bigPromise");
const cloudinary = require("cloudinary");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");

exports.addNewAlbum = BigPromise(async (req, res, next) => {
    let imageArray = [];
    if (req.files) {
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "albums",
          }
        );
        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }
  
    req.body.photos = imageArray;
  
    let artistArray = [];
  
    if (!req.body.artists) {
      return next(new CustomError("Artists field is required", 400));
    }
  
    let artists;
    try {
      artists = JSON.parse(req.body.artists);
    } catch (error) {
      return next(new CustomError("Invalid artists format", 400));
    }
  
    for (let index = 0; index < artists.length; index++) {
      const artist = await Artist.findById(artists[index]);
      if (!artist) {
        return next(new CustomError(`Artist not found with id ${artists[index]}`, 404));
      }
      artistArray.push(artist);
    }
  
    req.body.artists = artistArray;
  
    const album = await Album.create(req.body);
  
    for (let index = 0; index < artists.length; index++) {
      await Artist.findByIdAndUpdate(
        artists[index],
        { $push: { albums: album._id } },
        { new: true, useFindAndModify: false }
      );
    }
  
    res.status(200).json({
      success: true,
      album,
    });
  });

exports.getAllAlbums = BigPromise(async (req, res, next) => {
  const resultPerPage = 10;

  const albumObj = new WhereClause(Album.find(), req.query)
    .searchAlbum()
    .filter();

  let albums = await albumObj.base;
  const filteredAlbumNumber = albums.length;

  albumObj.pager(resultPerPage);
  albums = await albumObj.base.clone();

  res.status(200).json({
    success: true,
    albums,
    filteredAlbumNumber,
  });
});

exports.getAlbumByID = BigPromise(async (req, res, next) => {
  const album = await Album.findById(req.params.id);

  if (!album) {
    return next(new CustomError("No artist found with this id", 401));
  }

  res.status(200).json({
    success: true,
    album,
  });
});
