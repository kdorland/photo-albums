// Persistent datastore using nedb (similar to MongoDB, but embedded)
const Datastore = require('nedb');
const dbPhotos = new Datastore({ filename: 'photos.db', autoload: true });
const dbAlbums = new Datastore({ filename: 'albums.db', autoload: true });

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
  console.log(doc);

  return new Promise((resolve, reject) => {
    dbAlbums.update(doc, doc, { upsert: true }, (err, numAffected, upsert) => {  
      console.log("numAffected", numAffected, upsert);
      resolve(upsert);
    });
  });
}

async function getAlbums() {
  return new Promise((resolve, reject) => {
    dbAlbums.find({}, function (err, docs) {
      resolve(docs);
    });
  }) 
}

module.exports = {
  savePicture,
  getPictures,
  createAlbum,
  getAlbums
}