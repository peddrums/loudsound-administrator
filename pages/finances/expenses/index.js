//UI Stuff
import Head from "next/head";
import { Box, Container } from "@mui/material";
import { TaxQuarterTable } from "../../../components/tables/TaxQuarterTable/TaxQuarterTable.js";
import { RecordsSearchBar } from "../../../components/searchBars/RecordSearchBar";
import { getDocData } from "../../../utils/firebase/helpers";

////Firestore Stuff
import { auth } from "../../../utils/firebase/db";
import AuthCheck from "../../../components/authComponents/authCheck";
import { useState } from "react";

export default function ExpensePage() {
  const user = auth.currentUser;

  const [records, setRecords] = useState();
  const [loading, setLoading] = useState(true);

  function resultsHandler(data) {
    setRecords(data.records);
    setLoading(data.loading);
  }

  const path = user ? `/users/${user.uid}/finances/expenses` : "";

  const formFields = [
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
  ];

  return (
    <>
      <Head>
        <title>Bow-chicka-wow-wow</title>
      </Head>
      <AuthCheck>
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
              getDataHandler={getDocData}
              formFields={formFields}
              path={path}
              title="Tax Quarter"
              searchFields={[{ Endpoint: "endpoint" }]}
              dataKey="endpoints"
            />
            <Box sx={{ mt: 3 }}>
              <TaxQuarterTable endPoints={records} loading={loading} />
            </Box>
          </Container>
        </Box>
      </AuthCheck>
    </>
  );
}
