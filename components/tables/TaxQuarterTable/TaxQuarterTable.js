import { Fragment } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
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
  CircularProgress,
} from "@mui/material";
import Link from "next/link";

export const TaxQuarterTable = ({ endPoints, loading, ...rest }) => {
  return (
    <Fragment>
      <Card {...rest}>
        {!loading ? (
          endPoints ? (
            <Fragment>
              <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" />
                        </TableCell>
                        <TableCell>Tax Quarter</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {endPoints.map((endPoint, idx) => (
                        <TableRow hover key={idx}>
                          <TableCell padding="checkbox">
                            <Checkbox value="true" />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Link
                                href={`/finances/expenses/${endPoint.endpoint}`}
                                passHref
                              >
                                <a>
                                  <Typography
                                    color="textPrimary"
                                    variant="body1"
                                  >
                                    {endPoint.endpoint.toUpperCase()}
                                  </Typography>
                                </a>
                              </Link>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </PerfectScrollbar>
            </Fragment>
          ) : (
            <Typography variant="h6">No Results</Typography>
          )
        ) : (
          <CircularProgress />
        )}
      </Card>
    </Fragment>
  );
};
