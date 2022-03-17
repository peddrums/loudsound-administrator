import { useContext, useEffect, useState, Fragment } from "react";
import { UserContext } from "../../../utils/auth/AuthContext";

import { auth } from '../../../utils/firebase/db'
import { query, getDoc, doc, getFirestore } from "firebase/firestore";

import UploadForm from "../Forms/UploadForm";
import { getDocData } from "../../../utils/firebase/helpers";

export default function RecordManager({ path, formFields, docPathHandler }) {
  const [record, setRecord] = useState(null);

  const user = auth.currentUser

  const recordRef = doc(getFirestore(), `${path}`);

  useEffect(() => {
    /*async function getData() {
      const q = query(recordRef);

      const result = await getDoc(q);

      const data = result.data();

      setRecord(data);
    }*/

    async function getData() {
      const data = await getDocData(path);
      setRecord(data);
    }
    getData();
  }, [user]);

  return (
    <Fragment>
      {record && (
        <UploadForm
          record={record}
          recordRef={recordRef}
          formFields={formFields}
          docPathHandler={docPathHandler}
        />
      )}
    </Fragment>
  );
}
