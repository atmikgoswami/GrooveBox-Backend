const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

app.use(cors());

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//morgan middleware
app.use(morgan("tiny"));

app.get("/", (req, res) => res.send("Welcome to Music Player API"));

const artist = require("./routes/artists");
const album = require("./routes/albums");
const track = require("./routes/tracks");

app.use("/api/v1", artist);
app.use("/api/v1", album);
app.use("/api/v1", track);

//export app js
module.exports = app;
