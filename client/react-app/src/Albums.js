import React from 'react';
import {Link} from "@reach/router"
import CreateAlbum from './CreateAlbum';

function Albums(props) {
  return (
    <>
      <h3>Albums</h3>
      <div className="album-container">
        {props.albums.map((element, index) => 
          <div className="album-box">
         
              <Link to={`${element.name}`} key={index}>{element.name}</Link>
           
          </div>
        )}
      </div>
      <CreateAlbum createAlbum={props.createAlbum}></CreateAlbum>
    </>
  );
}

export default Albums;
