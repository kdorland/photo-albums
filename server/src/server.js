/**** Node.js libraries *****/
const path = require('path');

/**** External libraries ****/
const express = require('express'); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const AWS = require("aws-sdk");

/**** Configuration ****/
const app = express();

async function getAwsCredentials() {
  return new Promise(function (resolve, reject) {
    AWS.config.getCredentials(function(err) {
      if (err) {
        console.log("Credentials error");
        console.error(err.stack);
        reject(err.stack);
      } else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        resolve(AWS.config.credentials);
      }
    });
  });
}

function createServer(config) {
  // AWS
  getAwsCredentials();
  AWS.config.update({region: 'eu-central-1'});
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});
  const db = require("./photoDb")(config.photosDb, config.albumsDb);
  const routes = require("./routes")(db, s3);

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined')); 
  app.use(cors());
  app.use(fileUpload());
  app.use(express.static(path.resolve('..', 'client', 'react-app', 'build'))); 
  
  /**** Add routes ****/
  app.use("/api", routes);

  // "Redirect" all other get requests to React's entry point (index.html) to be handled by Reach router.
  app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'react-app', 'build', 'index.html'))
  );
  
  return app;
}

module.exports = createServer;
