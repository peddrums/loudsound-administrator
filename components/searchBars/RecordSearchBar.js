import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";

import { useRouter } from "next/router";

import { AddRecordModal } from "../modals/addRecordModal";
import { Search as SearchIcon } from "../../images/icons/search";

import { useState, useEffect, useCallback } from "react";

import debounce from "lodash.debounce";

import Link from "next/link";

export function RecordsSearchBar({
  getDataHandler,
  resultsHandler,
  path,
  title,
  searchFields,
  formFields,
  dataKey = null,
}) {
  const [formValue, setFormValue] = useState({
    searchField: "",
    query: "",
  });

  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchBarFields, setSearchBarFields] = useState([]);

  const router = useRouter();
  const { slug } = router.query;
  const fullPath = `${path}/${slug}`;

  // Add No Filter Option to Search
  const makeSearchBarFields = () => {
    if (searchFields.length > 1) {
      setSearchBarFields([{ "No Search Filter": "" }, ...searchFields]);
      return;
    }
    setFormValue({
      ...formValue,
      ["searchField"]: Object.values(searchFields[0])[0],
    });
  };

  useEffect(() => {
    makeSearchBarFields();
    return null;
  }, []);

  useEffect(() => {
    filterResults(formValue);
    return null;
  }, [formValue]);
  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const filterResults = useCallback(
    debounce(async (formValue) => {
      setLoading(true);

      resultsHandler({ loading });

      const res = await getDataHandler(fullPath, dataKey);

      const filteredData = res?.filter((doc) => {
        if (formValue.searchField === "") return doc;

        console.log("hello", doc, formValue.searchField);

        return doc[formValue.searchField]
          ?.trim()
          .toLowerCase()
          .includes(formValue.query);
      });

      setLoading(false);
      resultsHandler({ records: filteredData, loading });
    }, 500),
    []
  );

  function handleClose() {
    setModalShow(false);
  }
  return (
    <Box>
      <Link href="/" passHref>
        <a>&larr;&nbsp;&nbsp;Go Home</a>
      </Link>

      <Modal
        open={modalShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "scroll",
        }}
      >
        <AddRecordModal formFields={formFields} path={path} />
      </Modal>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {title}
        </Typography>

        <Box sx={{ m: 1 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setModalShow(true)}
          >
            Add Record
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 1000 }}>
              {searchFields.length > 1 && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Search Field
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formValue.searchField}
                    label="Search Field"
                    onChange={(e) =>
                      setFormValue({
                        ...formValue,
                        ["searchField"]: e.target.value.trim(),
                      })
                    }
                  >
                    {searchBarFields.length > 1 &&
                      searchBarFields.map((field, idx) => {
                        const [key, value] = Object.entries(field).flat();

                        return (
                          <MenuItem key={idx} value={value ? value : "\n"}>
                            {key}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              )}
              <TextField
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    ["query"]: e.target.value.toLowerCase().trim(),
                  })
                }
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search term"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
