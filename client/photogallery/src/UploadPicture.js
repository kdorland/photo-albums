import React, {useEffect, useState} from 'react';

const APP_URL = process.env.REACT_APP_URL;

function UploadPicture(props) {
  const [file, setFile] = useState();

  function handleFileChange(event) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  async function handleClick(event) {
    const formData = new FormData();
    formData.append('uploadFile', file);

    const response = await fetch(`${APP_URL}api/pictures`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <h3>Upload picture</h3>
      <input type="file" name="uploadFile" onChange={handleFileChange}/><br/>
      <input type="text" name="album" placeholder="album name"/><br/>
      <button onClick={handleClick}>Upload!</button>
    </>
  );
}

export default UploadPicture;
