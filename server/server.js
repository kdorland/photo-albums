/**** External libraries ****/
const express = require('express'); // The express.js library for implementing the API
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

/**** Our modules ****/
const db = require("./photoDb");

/**** Configuration ****/
const appName = "Photo Gallery API"; // Change the name of your server app!
const port = process.env.PORT || 8080; // Pick port 8080 if the PORT env variable is empty.
const app = express(); // Get the express app object.

app.use(bodyParser.json()); // Add middleware that parses JSON from the request body.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined')); // Add middleware that logs all http requests to the console.
app.use(cors()); // Avoid CORS errors. https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use(fileUpload());
app.use(express.static('../client/photogallery/build')); // Needed for serving production build of React
app.use('/static', express.static('../content/'));

/**** Routes ****/
app.post('/api/pictures', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const uploadFile = req.files.uploadFile;
  const album = req.body.album;
  console.log("body", req.body);

  // Moving uploaded file to "../content"
  uploadFile.mv(`../content/${req.files.uploadFile.name}`, async function(err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      const doc = await db.savePicture(
        req.files.uploadFile.name, 
        album ? album : "default", 
        req.files.uploadFile.name);
      res.json({msg: "data inserted", data: doc});
    }
  });
});

app.get('/api/pictures', async (req, res) => {
  const pics = await db.getPictures();
  console.log("pics", pics);
  res.json(pics);
});

app.get('/api/:album/pictures', async (req, res) => {
  const pics = await db.getPictures({albumTitle: req.params.album});
  console.log("pics", pics);
  res.json(pics);
});

app.get('/api/albums', async (req, res) => {
  const albums = await db.getAlbums();
  res.json(albums);
});

app.post('/api/albums', async (req, res) => {
  const album = req.body.album;
  const newDoc = await db.createAlbum(album);
  res.json({msg: "album created", data: newDoc});
});

/**** Start! ****/
app.listen(port, () => console.log(`${appName} running on port ${port}!`));