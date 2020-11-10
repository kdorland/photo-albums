const BUCKET = "photo-album-bucket-eaaa";
const CONTENT_DIR = '../content/';

module.exports = (db, s3) => {
  const express = require("express");
  const router = express.Router();
  const fs = require('fs');

  // Make sure upload dir exists
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  async function createBucket() {
    // Call S3 to create a new bucket
    try {
      const createResult = await s3.createBucket({ Bucket: BUCKET}).promise();
      console.log("Create bucket", createResult);  
    } catch (e) {
      console.log(e.message);
    }
  }
  createBucket();

  /**** Routes ****/
  router.post('/pictures', async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const uploadFile = req.files.uploadFile;
    const album = req.body.album;

    // Moving uploaded file to "../content"
    const file = `${CONTENT_DIR}${req.files.uploadFile.name}`;
    uploadFile.mv(file, async function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    });

    // Configure the file stream and obtain the upload parameters
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
      console.log('File Error', err);
    });
    const uploadParams = { 
      Bucket: BUCKET, 
      Key: uploadFile.name, 
      ContentType: "image/jpeg",
      Body: fileStream,
      Metadata: {album: album},
    };
    
    // Upload file to specified bucket
    const uploadResult = await s3.upload(uploadParams).promise();
    console.log("Upload Success", uploadResult);
  });

  router.get('/pictures', async (req, res) => {
    const pics = await db.getPictures();
    res.json(pics);
  });

  router.get('/:album/pictures', async (req, res) => {
    const pics = await db.getPictures({albumTitle: req.params.album});
    res.json(pics);
  });

  router.get('/albums', async (req, res) => {
    const albums = await db.getAlbums();
    res.json(albums);
  });

  router.post('/albums', async (req, res) => {
    const album = req.body.album;
    const newDoc = await db.createAlbum(album);
    res.json({msg: "album created", data: newDoc});
  });

  return router;
}
