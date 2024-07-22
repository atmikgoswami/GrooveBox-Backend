const Artist = require("../models/artists");
const Album = require("../models/albums");
const BigPromise = require("../middleware/bigPromise");
const cloudinary = require("cloudinary");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");

exports.addNewArtist = BigPromise(async (req, res, next) => {
  let imageArray = [];
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "artists",
        }
      );
      console.log(result.public_id)
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }

    

    req.body.photos = imageArray;

    const artist = await Artist.create(req.body);

    res.status(200).json({
      success: true,
      artist,
    });
  }
});

exports.getArtistByID = BigPromise(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new CustomError("No artist found with this id", 401));
  }

  res.status(200).json({
    success: true,
    artist,
  });
});

exports.getAllArtists = BigPromise(async (req, res, next) => {
  const resultPerPage = 10;

  const artistsObj = new WhereClause(Artist.find(), req.query)
    .searchArtist()
    .filter();

  let artists = await artistsObj.base;
  const filteredArtistNumber = artists.length;

  artistsObj.pager(resultPerPage);
  artists = await artistsObj.base.clone();

  res.status(200).json({
    success: true,
    artists,
    filteredArtistNumber,
  });
});

exports.updateArtistsFollowers = BigPromise(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new CustomError("No artist found with this id", 401));
  }

  artist.numberOfFollowers += 1;
  await artist.save();

  res.status(200).json({
    success: true,
    artist,
  });
});
