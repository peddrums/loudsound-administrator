import { useState } from "react";

import { storage } from "../../../utils/firebase/db";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  serverTimestamp,
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { v4 } from "uuid";

import { formatDatePath } from "./FileUploaderHelpers";

import kebabCase from "lodash.kebabcase";

import { CircularProgress } from "@mui/material";

export default function CreateNewExpense({ path, docPathHandler }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const slug = kebabCase(formatDatePath());
  const id = v4();

  function setFileHandler(e) {
    const reader = new FileReader();
    const target = e.target.files[0];

    reader.onloadend = () => {
      setFile({
        target: target,
        filePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(target);
  }

  async function uploadFileHandler(e) {
    e.preventDefault();
    const extension = file.target.type.split("/")[1];

    const fileRef = ref(storage, `${path}/${slug}/${id}.${extension}`);
    setUploading(true);

    const task = uploadBytesResumable(fileRef, file.target);

    task
      .then((d) => getDownloadURL(fileRef))
      .then((url) => {
        setUploading(false);
        createRecord(url);
      })
      .catch((err) => toast.error(err));
  }

  async function createRecord(url) {
    try {
      const ref = doc(getFirestore(), `${path}/${slug}/${id}`);

      async function createEndpointDoc(obj) {
        await setDoc(doc(getFirestore(), `${path}`), obj);
      }

      const endpointDoc = await getDoc(doc(getFirestore(), `${path}`));

      if (endpointDoc.exists()) {
        const data = endpointDoc.data();

        if (!data.endpoints) {
          data["endpoints"] = [{ endpoint: slug }];

          await createEndpointDoc(data);
        }

        if (data.endpoints) {
          const endpointData = data.endpoints;
          const filteredData = endpointData.filter(
            (datum) => datum.endpoint === slug
          );
          if (filteredData.length === 0) {
            data.endpoints.push({ endpoint: slug });

            await createEndpointDoc(data);
          }
        }
      }

      if (!endpointDoc.exists()) {
        const obj = { endpoints: [{ endpoint: slug }] };
        await createEndpointDoc(obj);
      }

      const data = {
        _id: id,
        imgUrl: url,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(ref, data);

      const docPath = `${path}/${slug}/${id}`;

      docPathHandler(docPath);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main>
      <div>
        {!uploading ? (
          <form onSubmit={uploadFileHandler}>
            <label>Upload Receipt</label>
            <input
              type="file"
              onChange={setFileHandler}
              accept="image/x-png,image/gif,image/jpeg,application/pdf"
            />
            <button type="submit" disabled={!file}>
              Upload File
            </button>
          </form>
        ) : (
          <CircularProgress />
        )}
        {file && (
          <img src={file.filePreviewUrl} height="250px" alt="File Preview" />
        )}
      </div>
    </main>
  );
}
