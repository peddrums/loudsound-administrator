import { useState } from "react";

import { storage } from "../../../utils/firebase/db";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CircularProgress, tabScrollButtonClasses } from "@mui/material";
import { LoadBundleTask } from "firebase/firestore";

export default function ImageUploader(props) {
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [image, setImage] = useState(null);

  function setFileHandler(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImage({
        file: file,
        imagePreviewURL: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  const uploadFile = async (e) => {
    e.preventDefault();

    const file = image.file;
    const extension = image.file.type.split("/")[1];

    const fileRef = ref(storage, `${props.imgPath}.${extension}`);
    setUploading(true);

    task
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        setDownloadURL(url);
        setImage(null);
        setUploading(false);
        props.url(downloadURL);
      });
  };

  return (
    <div>
      {!uploading ? (
        <form onSubmit={uploadFile}>
          <label className="btn">Upload Receipt</label>
          <input
            type="file"
            //onChange={setImage(Array.from(e.target.files[0]))}
            onChange={fookinHell}
            accept="image/x-png,image/gif,image/jpeg"
          />
          <button type="submit">Upload Image</button>
        </form>
      ) : (
        <CircularProgress />
      )}

      {image && <img src={image.imagePreviewUrl} height="250px" />}
    </div>
  );
}
