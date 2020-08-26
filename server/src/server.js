/**** Node.js libraries *****/
const fs = require('fs');

/**** External libraries ****/
const express = require('express'); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

/**** Configuration ****/
const app = express(); 
const contentDir = '../content/';

function createServer(photosDb, albumsDb) {
  const db = require("./photoDb")(photosDb, albumsDb);
  const routes = require("./routes")(db, contentDir);

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined')); 
  app.use(cors());
  app.use(fileUpload());
  app.use(express.static('../client/react-app/build')); 
  app.use('/static', express.static(contentDir));
  
  fs.mkdirSync(contentDir, { recursive: true });
  
  /**** Add routes ****/
  app.use("/api", routes);
  
  return app;
}

module.exports = createServer;
