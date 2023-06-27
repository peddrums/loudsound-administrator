import { Fragment, useState } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { updateDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function UploadForm({
  record,
  recordRef,
  preview,
  formFields,
  docPathHandler,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { slug, id } = router.query;
  const { register, errors, handleSubmit, formState, reset, watch, setValue } =
    useForm({
      defaultValues: {
        recordId: record._id,
        vendor: record.vendor,
        job: record.job,
        downloadUrl: record.imgUrl,
        netTotal: record.netTotal,
        grossTotal: record.grossTotal,
        taxes: record.taxes,
        vatId: record.vatId,
        location: record.location,
        receiptDate: record.receiptDate,
        transactionDate: record.transactionDate,
        transactionId: record.transactionId,
        entryComplete: record.entryComplete,
      },
      mode: "onChange",
    });

  const { isValid, isDirty } = formState;

  async function updateRecord({
    vendor,
    job,
    downloadUrl,
    articleType,
    netTotal,
    grossTotal,
    vat5,
    vat12,
    vat20,
    vatId,
    location,
    receiptDate,
    receiptTime,
    transactionDate,
    transactionId,
    entryComplete,
  }) {
    setLoading(true);
    const filteredObj = [
      { vendor: vendor },
      { job: job },
      { articleType: articleType },
      { netTotal: netTotal === "" ? "" : Number(netTotal).toFixed(2) },
      { grossTotal: grossTotal === "" ? "" : Number(grossTotal).toFixed(2) },
      { vat5: vat5 === "" ? "" : Number(vat5).toFixed(2) },
      { vat12: vat12 === "" ? "" : Number(vat12).toFixed(2) },
      { vat20: vat20 === "" ? "" : Number(vat20).toFixed(2) },
      { vatId: vatId },
      { location: location },
      { receiptDate: receiptDate },
      { receiptTime: receiptTime },
      { transactionDate: transactionDate },
      { transactionId: transactionId },
    ].reduce((a, b) => {
      const [arr] = Object.entries(b);
      return arr[1] !== "" ? { ...a, [arr[0]]: arr[1] } : a;
    }, {});

    try {
      await updateDoc(recordRef, {
        ...filteredObj,
        entryComplete,
      });

      //reset({ vendor });

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setError(err);
      console.log(err);
    }
  }
  if (error) return <h1>{error}</h1>;

  if (loading) return <CircularProgress />;

  if (!loading && success) {
    return (
      <Fragment>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Record Updated Successfully!
        </Typography>
        <Button
          fullWidth
          type="submit"
          size="large"
          color="primary"
          variant="contained"
          onClick={() => docPathHandler(null)}
        >
          Add Another Record
        </Button>
      </Fragment>
    );
  }

  if (!loading && !error && !success) {
    return (
      <form onSubmit={handleSubmit(updateRecord)}>
        <Box sx={{ my: 3, overflow: "scroll" }}>
          {!imageLoaded && <CircularProgress />}
          <img
            onLoad={() => setImageLoaded(true)}
            src={record.imgUrl}
            height="300px"
            alt="preview"
          />
        </Box>

        <Grid container spacing={1}>
          <Grid item md={12}>
            <Link href={record.imgUrl} passHref>
              <a download rel="noopener noreferrer" target="_blank">
                <Typography variant="body1">Download</Typography>
              </a>
            </Link>
          </Grid>

          {loading && <CircularProgress />}
          {formFields &&
            formFields.map((field, idx) => {
              const [key, value] = Object.entries(field).flat();
              if (key.toLowerCase().includes("complete")) {
                return (
                  <Grid key={idx} item md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultValue={record.entryComplete}
                          name={value}
                          id={value}
                          {...register(`${value}`)}
                        />
                      }
                      label={key}
                    />
                  </Grid>
                );
              }
              return (
                <Grid key={idx} item xs={12} md={6}>
                  <TextField
                    type={!key.toLowerCase().includes("date") ? "text" : "date"}
                    name={value}
                    id={value}
                    label={key}
                    {...register(`${value}`)}
                  />
                </Grid>
              );
            })}
        </Grid>
        <Box sx={{ py: 2 }}>
          {" "}
          <Button
            fullWidth
            type="submit"
            size="large"
            color="primary"
            variant="contained"
          >
            Update Record
          </Button>
        </Box>
      </form>
    );
  }
}
