/**** Node.js libraries *****/
const fs = require('fs');
const path = require('path');

/**** External libraries ****/
const express = require('express'); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

/**** Configuration ****/
const app = express(); 
const contentDir = '../content/';

function createServer(config) {
  const db = require("./photoDb")(config.photosDb, config.albumsDb);
  const routes = require("./routes")(db, contentDir);

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined')); 
  app.use(cors());
  app.use(fileUpload());
  app.use(express.static(path.resolve('..', 'client', 'react-app', 'build'))); 
  app.use('/static', express.static(contentDir));
  
  fs.mkdirSync(contentDir, { recursive: true });
  
  /**** Add routes ****/
  app.use("/api", routes);

  // "Redirect" all other get requests to React's entry point (index.html) to be handled by Reach router.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'react-app', 'build', 'index.html'))
  );
  
  return app;
}

module.exports = createServer;
