module.exports = (photoDbFile, albumsDbFile) => {
  // Persistent datastore using nedb (similar to MongoDB, but embedded)
  const Datastore = require('nedb');
  const dbPhotos = new Datastore({ filename: photoDbFile, autoload: true });
  const dbAlbums = new Datastore({ filename: albumsDbFile, autoload: true });

  async function savePicture(fileName, albumTitle, photoTitle) {
    const doc = { 
      fileName,
      albumTitle,
      photoTitle
    };

    return new Promise(async (resolve, reject) => {
      dbPhotos.insert(doc, (err, newDoc) => { 
        createAlbum(albumTitle).then(() => resolve(newDoc));
      });
    });
  }

  async function getPictures(filter) {
    return new Promise((resolve, reject) => {
      dbPhotos.find(filter, function (err, docs) {
        resolve(docs);
      });
    }) 
  }

  async function createAlbum(name) {
    const doc = { 
      name
    };

    return new Promise((resolve, reject) => {
      dbAlbums.update(doc, doc, { upsert: true }, (err, numAffected, upsert) => {  
        resolve(upsert);
      });
    });
  }

  async function getAlbums() {
    return new Promise((resolve, reject) => {
      dbAlbums.find({}).sort({ name: 1 }).exec(function (err, docs) {
        resolve(docs);
      });
    }) 
  }


  return {
    savePicture,
    getPictures,
    createAlbum,
    getAlbums
  }
}