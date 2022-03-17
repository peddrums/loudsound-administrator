import { useState, forwardRef } from "react";

import FileUploader from "../uploaders/FileUploader/FileUploader";
import FileManager from "../uploaders/FileManager/FileManager";

import { Card, Container } from "@mui/material";

export const AddRecordModal = forwardRef((props, ref) => {
  const { path, formFields } = props;

  const [docPath, setDocPath] = useState(null);

  function docPathHandler(path) {
    setDocPath(path);
  }

  return (
    <Container ref={ref} maxWidth="sm" sx={{ outline: "none" }}>
      <Card sx={{ padding: 3 }}>
        {!docPath && (
          <FileUploader docPathHandler={docPathHandler} path={path} />
        )}
        {docPath && (
          <FileManager
            docPathHandler={docPathHandler}
            path={docPath}
            formFields={formFields}
          />
        )}
      </Card>
    </Container>
  );
});

AddRecordModal.displayName = "AddRecordModal";
