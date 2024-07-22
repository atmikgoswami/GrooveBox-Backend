const express = require("express");
const router = express.Router();
const { addNewTrack, getAllTracks, getTrackByID, updateNumberOfLikes } = require("../controller/trackController");

router.route("/tracks/add").post(addNewTrack);
router.route("/tracks").get(getAllTracks);
router.route("/tracks/:id").get(getTrackByID);
router.route("/tracks/updateLikes/:id").put(updateNumberOfLikes);

module.exports = router;