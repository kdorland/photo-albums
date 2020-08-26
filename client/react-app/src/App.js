import React, {useEffect, useState} from 'react';
import { Router } from "@reach/router"

import Albums from "./Albums";
import Album from "./Album";
import "./App.css";

const APP_URL = process.env.REACT_APP_URL;

function App() {
  const [albums, setAlbums] = useState([]);
  const [updates, setUpdates] = useState(0);

  async function getPictures(album) {
    const url = `${APP_URL}api/${album}/pictures`;
    const response = await fetch(url);
    return response.json();
  }
  
  async function getAlbums() {
    const url = `${APP_URL}api/albums`;
    const response = await fetch(url);
    return response.json();
  }

  async function createAlbum(name) {
    const formData = new FormData();
    console.log("album name", name);
    formData.append('album', name);

    const response = await fetch(`${APP_URL}api/albums`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();


    setUpdates(updates + 1); // Force reload of album
  }
  
  async function uploadPicture(file, album) {
    const formData = new FormData();
    formData.append('uploadFile', file);
    formData.append('album', album);
  
    const response = await fetch(`${APP_URL}api/pictures`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log("Picture upload", data);

    setUpdates(updates + 1); // Force reload of album
  }

  // Only use effect once! ([] means don't depend on anything in the app)
  useEffect(() => {
    async function getData() {
      const data = await getAlbums();
      setAlbums(data);
    }
    getData();
  }, [updates]); 

  return (
    <>
      <h1>Photo Gallery</h1>
      <Router>
        <Albums path="/" 
          albums={albums} 
          createAlbum={createAlbum}
          updates={updates}></Albums>
        <Album path="/:album" 
          getPictures={getPictures} 
          uploadPicture={uploadPicture}
          updates={updates}></Album>
      </Router>
    </>
  );
}

export default App;
