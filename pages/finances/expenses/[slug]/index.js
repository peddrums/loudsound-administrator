import { Fragment } from "react";

import { auth } from "../../../../utils/firebase/db";

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";

import PerfectScrollBar from "react-perfect-scrollbar";

import { RecordsSearchBar } from "../../../../components/searchBars/RecordSearchBar";
import { getCollectionData } from "../../../../utils/firebase/helpers";

import AuthCheck from "../../../../components/authComponents/authCheck";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  return {
    props: { slug },
  };
}

export default function Quarter({ slug }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = auth.currentUser;

  const searchFields = [
    { Vendor: "vendor" },
    { "VAT ID": "vatId" },
    { "Receipt Date": "receiptDate" },
    { "Transaction Date": "transactionDate" },
    { "Transaction ID": "transactionId" },
    { Location: "location" },
    { "Entry Complete": "entryComplete" },
  ];
  /*
  const searchFields = [
    { searchTerm: "vendor", label: "Vendor", type: "string" },
    { searchTerm: "netTotal", label: "Net Total", type: "number" },
    { searchTerm: "grossTotal", label: "Gross Total", type: "number" },
    { searchTerm: "taxes", label: "Taxes", type: "number" },
    { searchTerm: "vatId", label: "VAT ID", type: "string" },
    { searchTerm: "location", label: "Location", type: "string" },
    { searchTerm: "receiptDate", label: "Receipt Date", type: "date" },
    { searchTerm: "transactionDate", label: "Transaction Date", type: "date" },
    { searchTerm: "transactionId", label: "Transaction ID", type: "string" },
    { searchTerm: "entryComplete", label: "Entry Complete", type: "boolean" },
  ]; */

  const formFields = [
    { Vendor: "vendor" },
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

  const path = user ? `/users/${user.uid}/finances/expenses` : "";

  function resultsHandler(data) {
    setRecords(data.records);

    setLoading(data.loading);
  }

  if (error) {
    console.log(error);
    return (
      <div>
        {error.code === "permission-denied" && (
          <Fragment>
            <p>{JSON.stringify(error)}</p>
            <p>Permission Denied: Please Log In</p>
            <Link href="/login" passHref>
              <a>Login</a>
            </Link>
          </Fragment>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <AuthCheck>
        <Head>
          <title>
            Records {`Records ${slug.toUpperCase()}`} | Material Kit
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <RecordsSearchBar
              resultsHandler={resultsHandler}
              getDataHandler={getCollectionData}
              path={path}
              title={`Records ${slug.toUpperCase()}`}
              searchFields={searchFields}
              formFields={formFields}
            />
            <Box sx={{ mt: 3 }}>
              <Card>
                <PerfectScrollBar>
                  <Box sx={{ minWidth: 1050 }}>
                    {!loading ? (
                      records && records.length > 0 ? (
                        <Table>
                          <TableHead>
                            <TableRow><TableCell color="primary">Vendor</TableCell>
                              <TableCell color="primary">Transaction Date</TableCell>
                              <TableCell color="primary">Receipt Date</TableCell>
                              <TableCell color="primary">Receipt Time</TableCell>
                              
                              <TableCell color="primary">
                                Amount (Ex. VAT)
                              </TableCell>
                              <TableCell color="primary">
                                Amount (Inc. VAT)
                              </TableCell>
                              <TableCell
                                color="primary"
                                sx={{ textAlign: "center" }}
                              >
                                Complete
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {records.map((record, idx) => (
                              <Link
                                key={idx}
                                href={`/finances/expenses/${slug}/${record._id}`}
                                passHref
                              >
                                <TableRow hover><TableCell>
                                    {record.vendor || "No vendor date supplied"}
                                  </TableCell>
                                  <TableCell>
                                    {record.transactionDate ||
                                      "No transaction date supplied"}
                                  </TableCell>
                                  <TableCell>
                                    {record.receiptDate ||
                                      "No receipt date supplied"}
                                  </TableCell>
                                  <TableCell>
                                    {record.receiptTime ||
                                      "No receipt time supplied"}
                                  </TableCell>
                                  
                                  <TableCell>
                                    {record.netTotal ? `£ ${record.netTotal}` :
                                      "No net total supplied"}
                                  </TableCell>
                                  <TableCell>
                                    {record.grossTotal ? `£ ${record.grossTotal}` :
                                      "No gross total supplied"}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
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
                                </TableRow>
                              </Link>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="h6">No Results</Typography>
                      )
                    ) : (
                      <CircularProgress />
                    )}
                  </Box>
                </PerfectScrollBar>
              </Card>
            </Box>
          </Container>
        </Box>
      </AuthCheck>
    </Fragment>
  );
}
