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
app.use(express.static('../client/')); // Needed for serving production build of React

/**** Routes ****/

// Return all recipes in data
app.get('/api/hello', (req, res) => {
    console.log("Hello");  
    res.json({msg: "hello"});
});

app.post('/api/uploadPicture', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const uploadFile = req.files.uploadFile;
  const album = req.body.album;

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

app.get('/api/getPictures', async (req, res) => {
  const pics = await db.getPictures();
  console.log("pics", pics);
  res.json(pics);
});

/**** Start! ****/
app.listen(port, () => console.log(`${appName} running on port ${port}!`));