// Persistent datastore using nedb (similar to MongoDB, but embedded)
const Datastore = require('nedb');
const db = new Datastore({ filename: 'photoGallery.db', autoload: true });

async function savePicture(fileName, albumTitle, photoTitle) {
  const doc = { 
    fileName,
    albumTitle,
    photoTitle
  };
  db.insert(doc, (err, newDoc) => {  
    console.log("Inserted", newDoc);
    return newDoc;
  });
}

async function getPictures() {
  return new Promise((resolve, reject) => {
    db.find({}, function (err, docs) {
      console.log("found", docs);
      resolve(docs);
    });
  }) 
}

module.exports = {
  savePicture,
  getPictures
}