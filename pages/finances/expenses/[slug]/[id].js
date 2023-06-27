import AuthCheck from "../../../../components/authComponents/authCheck";
import {
  query,
  getDoc,
  doc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, Fragment } from "react";

import { auth } from "../../../../utils/firebase/db";
import { getDocData } from "../../../../utils/firebase/helpers";

import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

export default function UpdateRecord() {
  return (
    <Fragment>
      <AuthCheck>
        <RecordManager />
      </AuthCheck>
    </Fragment>
  );
}

function RecordManager() {
  const router = useRouter();
  const { slug, id } = router.query;

  const [record, setRecord] = useState(null);

  const user = auth.currentUser;

  const recordRef = doc(
    getFirestore(),
    "users",
    user.uid,
    "finances",
    "expenses",
    slug,
    id
  );

  useEffect(() => {
    async function getDataOnMount() {
      await getData();

      //getDocData(recordRef);
    }
    getDataOnMount();
  }, []);

  async function getData() {
    const q = query(recordRef);

    const result = await getDoc(q);

    const data = result.data();
    setRecord(data);
    return data;
  }

  return (
    <Fragment>
      {record && (
        <Form getData={getData} record={record} recordRef={recordRef} />
      )}
    </Fragment>
  );
}

function Form({ record, recordRef, preview, getData }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();
  const { slug, id } = router.query;
  const {
    register,
    errors,
    handleSubmit,
    formState,
    reset,
    watch,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      recordId: record._id,
      vendor: record.vendor,
      job: record.job,
      downloadUrl: record.imgUrl,
      articleType: record.articleType,
      netTotal: record.netTotal,
      grossTotal: record.grossTotal,
      vat5: record.vat5,
      vat12: record.vat12,
      vat20: record.vat20,
      vatId: record.vatId,
      location: record.location,
      receiptDate: record.receiptDate,
      receiptTime: record.receiptTime,
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
    setFormLoading(true);

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
      { entryComplete: entryComplete },
    ].reduce((a, b) => {
      const [arr] = Object.entries(b);
      return arr[1] !== "" ? { ...a, [arr[0]]: arr[1] } : a;
    }, {});

    try {
      await updateDoc(recordRef, {
        ...filteredObj,
      });

      await getData();

      setShowModal(false);

      //reset('defaultValues');

      setFormLoading(false);
    } catch (err) {
      setFormLoading(false);
      console.log(err);
    }
  }

  /*  const fields = [
    { Vendor: "vendor" },
    { "Net Total": "netTotal" },
    { "Gross Total": "grossTotal" },
    { Taxes: "taxes" },
    { "VAT ID": "vatId" },
    { Location: "location" },
    { "Receipt Date": "receiptDate" },
    { "Transaction Date": "transactionDate" },
    { "Transaction ID": "transactionId" },
    { "Entry Complete": "entryComplete" },
  ]; */

  const fields = [
    { Vendor: "vendor" },
    { Job: "job" },
    { "Article Type": "articleType" },
    { "Net Total": "netTotal" },
    { "Gross Total": "grossTotal" },
    { "VAT @ 5%": "vat5" },
    { "VAT @ 12.5%": "vat12" },
    { "VAT @ 20%": "vat20" },
    { "VAT ID": "vatId" },
    { Location: "location" },
    { "Receipt Date": "receiptDate" },
    { "Receipt Time": "receiptTime" },
    { "Transaction Date": "transactionDate" },
    { "Transaction ID": "transactionId" },
    { "Entry Complete": "entryComplete" },
  ];

  function openModal() {
    setShowModal(true);
  }

  return (
    <Fragment>
      <Container sx={{ padding: 6 }}>
        <Grid container alignItems={"center"}>
          <Grid item md={4}>
            {!imageLoaded && <CircularProgress />}
            <img
              onLoad={() => {
                setImageLoaded(true);
              }}
              src={record.imgUrl}
              height="500px"
              alt="image"
            />
          </Grid>
          <Grid item md={8}>
            <Card sx={{ padding: 3 }}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <a href={`${record.imgUrl}`} target="_blank">
                    Download
                  </a>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={openModal}>
                    Update Entry
                  </Button>
                </Grid>
                <Grid item md={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {fields &&
                          fields
                            .slice(0, Math.ceil(fields.length / 2))
                            .map((field, idx) => {
                              const [key, value] = Object.entries(field).flat();
                              return <TableCell key={idx}>{key}</TableCell>;
                            })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {fields &&
                          fields
                            .slice(0, Math.ceil(fields.length / 2))
                            .map((field, idx) => {
                              const [key, value] = Object.entries(field).flat();
                              if (key.toLowerCase().includes("complete")) {
                                return (
                                  <TableCell
                                    key={idx}
                                    sx={{ textAlign: "center" }}
                                  >
                                    {record.entryComplete ? (
                                      <span style={{ color: "rgb(0,255,0)" }}>
                                        &#10003;
                                      </span>
                                    ) : (
                                      <span style={{ color: "rgb(255,0,0)" }}>
                                        &#10005;
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell key={idx}>{record[value]}</TableCell>
                              );
                            })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item md={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {fields &&
                          fields
                            .slice(Math.ceil(fields.length / 2))
                            .map((field, idx) => {
                              const [key, value] = Object.entries(field).flat();
                              return <TableCell key={idx}>{key}</TableCell>;
                            })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {fields &&
                          fields
                            .slice(Math.ceil(fields.length / 2))
                            .map((field, idx) => {
                              const [key, value] = Object.entries(field).flat();
                              if (key.toLowerCase().includes("complete")) {
                                return (
                                  <TableCell
                                    key={idx}
                                    sx={{ textAlign: "center" }}
                                  >
                                    {record.entryComplete ? (
                                      <span style={{ color: "rgb(0,255,0)" }}>
                                        &#10003;
                                      </span>
                                    ) : (
                                      <span style={{ color: "rgb(255,0,0)" }}>
                                        &#10005;
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell key={idx}>{record[value]}</TableCell>
                              );
                            })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <Card sx={{ padding: 3 }}>
          <Grid
            container
            maxWidth={700}
            minWidth={350}
            justifyContent="space-between"
            alignItems="center"
          >
            {formLoading ? (
              <Grid item md={12}>
                <CircularProgress />
              </Grid>
            ) : (
              <form onSubmit={handleSubmit(updateRecord)}>
                <Grid item md={12}>
                  <Grid
                    container
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item md={12}>
                      <Link href={record.imgUrl} passHref>
                        <a download rel="noopener noreferrer" target="_blank">
                          Download
                        </a>
                      </Link>
                    </Grid>
                    {fields &&
                      fields.map((field, idx) => {
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
                          <Grid key={idx} item md={6}>
                            <TextField
                              label={key}
                              type={
                                key.toLowerCase().includes("date")
                                  ? "date"
                                  : "text"
                              }
                              name={value}
                              id={value}
                              {...register(`${value}`)}
                            />
                          </Grid>
                        );
                      })}

                    <Grid item md={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        Update Record
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </Grid>
        </Card>
      </Modal>
    </Fragment>
  );
}

/*
_id
Vendor
Download Url
Net Total
Gross Total
Taxes
Vat Id
Location
Date
Transaction Date
Transaction ID
Entry Complete
*/
