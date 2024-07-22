const express = require("express");
const router = express.Router();
const {
  getAllArtists,
  getArtistByID,
  updateArtistsFollowers,
  addNewArtist,
} = require("../controller/artistController");

router.route("/artists").get(getAllArtists);
router.route("/artists/:id").get(getArtistByID);
router.route("/artists/updateFollowers/:id").put(updateArtistsFollowers);
router.route("/artists/add").post(addNewArtist);

module.exports = router;