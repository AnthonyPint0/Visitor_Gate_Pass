import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Collapse,
  Avatar,
  TablePagination,
  Typography,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import { ExpandMore, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import profile from "../../assets/profile.svg";
import { formatDateWithPadding } from "../../library/helper.js";

const parseDate = (dateString) => new Date(dateString).getTime();

const VisitorTable2 = ({ visitors }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState(null); // From date state
  const [toDate, setToDate] = useState(null); // To date state

  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const checkInTime = new Date(visitor.check_in_time).getTime();

      if (fromDate && toDate) {
        return (
          checkInTime >= fromDate.getTime() && checkInTime <= toDate.getTime()
        );
      }
      if (fromDate) {
        return checkInTime >= fromDate.getTime();
      }
      if (toDate) {
        return checkInTime <= toDate.getTime();
      }
      return true;
    });
  }, [visitors, fromDate, toDate]);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Phone Number", accessor: "phone_number" },
      { Header: "Check-in Time", accessor: "check_in_time" },
      { Header: "Check-out Time", accessor: "check_out_time" },
      {
        Header: "Details",
        accessor: "details",
        Cell: ({ row }) => (
          <Button
            sx={{
              backgroundColor: "white !important",
              color: "black !important",
              border: "1px",
              borderRadius: "px !important",
              padding: "6px 12px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#f0f0f0 !important",
                borderColor: "black",
              },
            }}
            endIcon={
              <ExpandMore
                sx={{
                  transform: expandedRows.includes(row.index)
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
            onClick={() => toggleRow(row.index)}
          >
            Details
          </Button>
        ),
        disableSortBy: true,
      },
    ],
    [expandedRows]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Date Range Filter */}
        <Box
          sx={{
            mb: 2,
            "@media (max-width: 600px)": {
              justifyContent: "center",
            },
          }}
        >
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="From Date"
                value={fromDate ? dayjs(fromDate) : null}
                onChange={(newValue) =>
                  setFromDate(newValue ? dayjs(newValue).toDate() : null)
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="To Date"
                value={toDate ? dayjs(toDate) : null}
                onChange={(newValue) =>
                  setToDate(newValue ? dayjs(newValue).toDate() : null)
                }
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="visitor table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.accessor} sx={{ fontWeight: "bold" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {column.Header}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVisitors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      hover
                      onClick={() => toggleRow(index)}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.accessor}>
                          {column.accessor === "check_in_time" ||
                          column.accessor === "check_out_time"
                            ? formatDateWithPadding(row[column.accessor])
                            : column.accessor === "details"
                            ? column.Cell({ row })
                            : row[column.accessor]}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows.includes(index) && (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <Collapse
                            in={expandedRows.includes(index)}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{ padding: 2, backgroundColor: "#f9f9f9" }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Purpose of Visit:</b>{" "}
                                    {row.purpose_of_visit}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Entry Gate:</b> {row.entry_gate}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Check-In Time:</b>{" "}
                                    {formatDateWithPadding(row.check_in_time)}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Exit Gate:</b> {row.exit_gate}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Check-out Time:</b>{" "}
                                    {formatDateWithPadding(row.check_out_time)}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Group Size:</b> {row.group_size}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  {row.photos ? (
                                    <Avatar
                                      src={row.photos}
                                      alt="Profile"
                                      sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: "8px",
                                      }}
                                    />
                                  ) : (
                                    <Avatar
                                      src={profile}
                                      alt="Default Profile"
                                      sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: "8px",
                                      }}
                                    />
                                  )}
                                </Grid>
                              </Grid>
                              {row.visitor_cards.length > 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                  }}
                                >
                                  {" "}
                                  {/* New Flexbox container */}
                                  {row.visitor_cards.map((card, cardIndex) => (
                                    <Box
                                      key={cardIndex}
                                      sx={{
                                        backgroundColor:
                                          card.status === "checked_out"
                                            ? "#e8f5e9"
                                            : "#ffebee",
                                        padding: "10px",
                                        marginBottom: "10px",
                                        borderRadius: "8px",
                                        width: "30%",
                                        boxShadow: "1px 1px 10px #80808059",
                                        border: "0.5px solid #00000014",
                                      }}
                                    >
                                      <Typography variant="body2" gutterBottom>
                                        <b>Card ID:</b> {card.card_id}
                                      </Typography>
                                      <Typography variant="body2" gutterBottom>
                                        <b>Exit Gate:</b>{" "}
                                        {card.exit_gate || "N/A"}
                                      </Typography>
                                      <Typography variant="body2" gutterBottom>
                                        <b>Check-out Time:</b>{" "}
                                        {formatDateWithPadding(
                                          card.check_out_time
                                        )}
                                      </Typography>
                                      <Typography variant="body2" gutterBottom>
                                        <b>Status:</b>{" "}
                                        <Box
                                          component="span"
                                          sx={{
                                            padding: "2px 8px",
                                            borderRadius: "4px",
                                            backgroundColor:
                                              card.status === "checked_out"
                                                ? "#28a745"
                                                : "#f44336",
                                            color: "#fff",
                                          }}
                                        >
                                          {card.status}
                                        </Box>
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  No group members found.
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVisitors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <IconButton
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            <ChevronLeft />
          </IconButton>
          <Typography>
            Page {page + 1} of{" "}
            {Math.ceil(filteredVisitors.length / rowsPerPage)}
          </Typography>
          <IconButton
            onClick={() =>
              setPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.floor(filteredVisitors.length / rowsPerPage)
                )
              )
            }
            disabled={page >= Math.floor(filteredVisitors.length / rowsPerPage)}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default VisitorTable2;
