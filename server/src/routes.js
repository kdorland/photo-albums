module.exports = (db, contentDir) => {
  const express = require("express");
  const router = express.Router();

  /**** Routes ****/
  router.post('/pictures', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const uploadFile = req.files.uploadFile;
    const album = req.body.album;

    // Moving uploaded file to "../content"
    uploadFile.mv(`${contentDir}${req.files.uploadFile.name}`, async function(err) {
      if (err) {
        console.error(err);
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
