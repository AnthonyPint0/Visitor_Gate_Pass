import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  Avatar,
  TablePagination,
  Typography,
  Grid,
  TextField,
  IconButton,
  TableSortLabel,
} from "@mui/material";
import { ExpandMore, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import profile from "../../assets/profile.svg";
import { formatDateWithPadding } from "../../library/helper.js";

const VisitorTable2 = ({ visitors }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Define filteredVisitors before using it
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

  const sortedVisitors = useMemo(() => {
    return filteredVisitors.slice().sort((a, b) => {
      if (orderBy === "check_in_time" || orderBy === "check_out_time") {
        // Convert date strings to timestamps for sorting
        const dateA = new Date(a[orderBy]).getTime();
        const dateB = new Date(b[orderBy]).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      // Sort alphabetically for other fields
      const valueA = a[orderBy].toLowerCase();
      const valueB = b[orderBy].toLowerCase();
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredVisitors, order, orderBy]);

  const columns = useMemo(
    () => [
      { id: "name", label: "Name" },
      { id: "phone_number", label: "Phone Number" },
      { id: "check_in_time", label: "Check-in Time" },
      { id: "check_out_time", label: "Check-out Time" },
      {
        id: "details",
        label: "Details",
        disableSorting: true,
      },
    ],
    []
  );

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

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === " ") {
      event.preventDefault();
      const input = event.target;
      const cursorPos = input.selectionStart;
      const value = input.value;
      input.value =
        value.slice(0, cursorPos) + "Ctrl+Shift" + value.slice(cursorPos);
      input.selectionStart = cursorPos + 10;
      input.selectionEnd = cursorPos + 10;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
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
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      onKeyDown: handleKeyDown,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="To Date"
                value={toDate ? dayjs(toDate) : null}
                onChange={(newValue) =>
                  setToDate(newValue ? dayjs(newValue).toDate() : null)
                }
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      onKeyDown: handleKeyDown,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="visitor table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ fontWeight: "bold" }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.disableSorting ? (
                      column.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedVisitors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      hover
                      onClick={() => toggleRow(index)}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === "check_in_time" ||
                          column.id === "check_out_time" ? (
                            formatDateWithPadding(row[column.id])
                          ) : column.id === "details" ? (
                            <Box>
                              {/* Your custom details rendering logic */}
                              <Typography variant="body2">
                                See More <b>v</b>
                              </Typography>
                              {/* Add more details as needed */}
                            </Box>
                          ) : (
                            row[column.id]
                          )}
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
                                  {row.vehicle_number && (
                                    <Typography
                                      variant="subtitle1"
                                      gutterBottom
                                    >
                                      <b>Vehicle Number:</b>{" "}
                                      {row.vehicle_number}
                                    </Typography>
                                  )}
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Check-In Time:</b>{" "}
                                    {formatDateWithPadding(row.check_in_time)}
                                  </Typography>
                                  <Typography variant="subtitle1" gutterBottom>
                                    <b>Check-Out Time:</b>{" "}
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
      </Box>
    </LocalizationProvider>
  );
};

export default VisitorTable2;
