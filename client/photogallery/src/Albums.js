import React from 'react';
import {Link} from "@reach/router"
import CreateAlbum from './CreateAlbum';

const APP_URL = process.env.REACT_APP_URL;

function Albums(props) {
  return (
    <>
      <h3>Albums</h3>
      <ul>
        {props.albums.map((element, index) => 
          <Link to={`${element.name}`} key={index}><li>{element.name}</li></Link>
        )}
      </ul>
      <CreateAlbum createAlbum={props.createAlbum}></CreateAlbum>
    </>
  );
}

export default Albums;
