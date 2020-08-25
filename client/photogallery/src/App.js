import React, {useEffect, useState} from 'react';
import UploadPicture from "./UploadPicture";
import "./App.css";

const APP_URL = process.env.REACT_APP_URL;

function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getData() {
      const url = `${APP_URL}api/pictures`;
      console.log("data url", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setPhotos(data);
    }
    getData();
  }, []); // Only use effect once! ([] means don't depend on anything in the app)

  return (
    <>
      <h1>Photo Gallery</h1>
      <div id="photo-gallery">
        {photos.map(element => 
          <a href={`${APP_URL}static/${element.fileName}`} target="_blank">
            <img key={element.fileName} alt={`file name: ${element.fileName}`}
              src={`${APP_URL}static/${element.fileName}`}>
            </img>
          </a>
          )}
      </div>
      <UploadPicture></UploadPicture>
    </>
  );
}

export default App;
