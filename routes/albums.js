const express = require("express");
const router = express.Router();
const {
  addNewAlbum,
  getAllAlbums,
  getAlbumByID,
} = require("../controller/albumController");

router.route("/albums/add").post(addNewAlbum);
router.route("/albums").get(getAllAlbums);
router.route("/albums/:id").get(getAlbumByID);

module.exports = router;