const BUCKET = process.env.BUCKET || "photo-album-bucket-eaaa";
const CONTENT_DIR = '../content/';

module.exports = (db, s3) => {
  const express = require("express");
  const router = express.Router();

  // TODO: Enable static site hosting automatically on bucket after creation
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

  async function createBucketPolicy() {
    // Change bucket policy
    const readOnlyAnonUserPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AddPerm",
          Effect: "Allow",
          Principal: "*",
          Action: [
            "s3:GetObject"
          ],
          Resource: [
            ""
          ]
        }
      ]
    };
    
    // Create selected bucket resource string for bucket policy
    const bucketResource = `arn:aws:s3:::${BUCKET}/*`;
    readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;
    
    // Convert policy JSON into string and assign into params
    const bucketPolicyParams = {Bucket: BUCKET, Policy: JSON.stringify(readOnlyAnonUserPolicy)};
    
    // Set the new policy on the selected bucket
    const putPolicy = await s3.putBucketPolicy(bucketPolicyParams).promise();
    console.log("putPolicy", putPolicy);
  }
  createBucketPolicy();

  /**** Routes ****/
  router.post('/pictures', async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const uploadFile = req.files.uploadFile;
    const album = req.body.album;

    const uploadParams = { 
      Bucket: BUCKET, 
      Key: uploadFile.name, 
      ContentType: uploadFile.mimetype,
      Body: req.files.uploadFile.data,
      Metadata: {album: album},
    };
    
    // Upload file to specified bucket
    const uploadResult = await s3.upload(uploadParams).promise();
    console.log("Upload Success", uploadResult);

    // Save metadata to database
    const doc = await db.savePicture(
      req.files.uploadFile.name, 
      album ? album : "default", 
      req.files.uploadFile.name);
    res.json({msg: "data inserted", data: doc});
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
