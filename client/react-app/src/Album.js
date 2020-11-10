import React, {useState, useEffect} from 'react';
import {Link} from "@reach/router"
import UploadPicture from "./UploadPicture";

//const APP_URL = process.env.REACT_APP_URL;
const BUCKET_URL = process.env.REACT_APP_BUCKET_URL;

function Album(props) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await props.getPictures(props.album);
      setPhotos(data);
    }
    getData();
  }, [props]); // Only runs once!

  return (
    <>
      <h3><Link to="/">Albums</Link> / {props.album}</h3>

      <div id="photo-gallery">
      {photos.map(element => 
        <a href={`${BUCKET_URL}/${element.fileName}`} 
          target="_blank" key={element.fileName} rel="noopener noreferrer">
          <img alt={`file name: ${element.fileName}`}
            src={`${BUCKET_URL}/${element.fileName}`}>
          </img>
        </a>
        )}
      </div>

      <UploadPicture 
        album={props.album} 
        uploadPicture={props.uploadPicture}/>
    </>
  );
}

export default Album;
