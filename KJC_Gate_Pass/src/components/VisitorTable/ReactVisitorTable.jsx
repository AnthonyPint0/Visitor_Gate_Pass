import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration"; // Import the duration plugin
import {
  TableContainer,
  Paper,
  TextField,
  Container,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { formatDateWithPadding } from "../../library/helper.js";
import "./VisitorTable.css";

// Extend dayjs with the duration plugin
dayjs.extend(durationPlugin);

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const FilterContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "start",
  },
}));

const PhotoCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const HorizontalStatusBadgeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "nowrap",
  gap: "4px",
  marginBottom: "12px", // Adjust this value as needed
  paddingTop: "6px",
  fontSize: "13px",
}));

const ReactVisitorTable = ({ visitors }) => {
  const [filterText, setFilterText] = useState("");
  const [processedVisitors, setProcessedVisitors] = useState([]);

  // Process visitors data
  useEffect(() => {
    const updatedVisitors = visitors.map((visitor) => ({
      ...visitor,
      check_out_time: visitor.check_out_time
        ? formatDateWithPadding(visitor.check_out_time)
        : "",
    }));
    setProcessedVisitors(updatedVisitors);
  }, [visitors]);

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 130, sortable: true },
      {
        field: "phone_number",
        headerName: "Phone Number",
        width: 130,
        sortable: true,
      },
      {
        field: "purpose_of_visit",
        headerName: "Purpose of Visit",
        width: 150,
        sortable: true,
      },
      {
        field: "entry_gate",
        headerName: "Entry Gate",
        width: 120,
        sortable: true,
      },
      {
        field: "check_in_time",
        headerName: "Check-In Time",
        width: 200,
        sortable: true,
        renderCell: (params) =>
          params.row.check_in_time
            ? formatDateWithPadding(params.row.check_in_time)
            : "",
      },
      {
        field: "exit_gate",
        headerName: "Exit Gate",
        width: 120,
        sortable: true,
      },
      {
        field: "check_out_time",
        headerName: "Check-Out Time",
        width: 200,
        sortable: true,
      },
      {
        field: "time_limit",
        headerName: "Time Limit",
        width: 120,
        sortable: true,
        renderCell: (params) => (
          <CountdownTimer
            checkInTime={params.row.check_in_time}
            checkOutTime={params.row.check_out_time}
            timeLimit={params.row.time_limit}
            rowId={params.row._id} // Pass row id for time-up detection
            onTimeUp={handleTimeUp} // Pass callback to handle time-up logic
          />
        ),
      },
      {
        field: "visitor_cards",
        headerName: "Visitor ID Cards",
        width: 230,
        sortable: false,
        renderCell: (params) => (
          <HorizontalStatusBadgeContainer>
            {params.value.map((card) => (
              <StatusBadge key={card.card_id} card={card} />
            ))}
          </HorizontalStatusBadgeContainer>
        ),
      },
      {
        field: "photos",
        headerName: "Photos",
        width: 100, // Adjust width as needed
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => (
          <PhotoCell>
            <img
              src={params.value} // base64 image source
              alt="Visitor"
              style={{ width: "50px", height: "60px" }}
            />
          </PhotoCell>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return processedVisitors.filter(
      (visitor) =>
        visitor.name.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number.includes(filterText)
    );
  }, [filterText, processedVisitors]);

  const [timeUpRows, setTimeUpRows] = useState([]);

  // Handle time-up logic and store the row ID for background animation
  const handleTimeUp = (rowId) => {
    if (!timeUpRows.includes(rowId)) {
      setTimeUpRows((prev) => [...prev, rowId]);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 3,
        px: {
          xs: 0,
          sm: 0,
          md: 1,
          lg: 1,
          xl: 1,
          marginBottom: 6,
        },
      }}
    >
      <FilterContainer>
        <Typography
          variant="h5"
          sx={{
            paddingLeft: {
              xs: 2,
            },
          }}
        >
          Today's Visitors
        </Typography>
        <TextField
          sx={{
            paddingLeft: {
              xs: 2,
            },
          }}
          variant="outlined"
          size="small"
          placeholder="Filter by name or phone number"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </FilterContainer>

      <StyledTableContainer component={Paper}>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            sx={{
              border: "1px solid white",
              borderRadius: "15px",
              boxShadow: "2",
              backgroundColor: "#ffffff",
            }}
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row._id} // Use _id as the unique id
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            components={{
              Toolbar: GridToolbar,
            }}
            disableSelectionOnClick
            disableColumnMenu
            style={{ height: 650, width: "100%" }}
            getRowClassName={(params) =>
              timeUpRows.includes(params.row._id) ? "time-up-row" : ""
            } // Conditionally apply class for rows with time-up
          />
        </Box>
      </StyledTableContainer>
    </Container>
  );
};

// Countdown Timer component
const CountdownTimer = ({
  checkInTime,
  checkOutTime,
  timeLimit,
  rowId,
  onTimeUp,
}) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const checkInDate = dayjs(checkInTime);
    const endTime = checkInDate.add(timeLimit, "hour");

    const interval = setInterval(() => {
      const now = dayjs();
      const difference = endTime.diff(now);

      if (difference <= 0) {
        setRemainingTime("Time's up!");
        if (!checkOutTime) {
          onTimeUp(rowId); // Notify parent when time's up
        }
      } else {
        const duration = dayjs.duration(difference);
        const hours = String(duration.hours()).padStart(2, "0");
        const minutes = String(duration.minutes()).padStart(2, "0");
        const seconds = String(duration.seconds()).padStart(2, "0");
        setRemainingTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInTime, timeLimit, rowId, onTimeUp]);

  const isTimeUp = remainingTime === "Time's up!";
  const textColor = isTimeUp ? "red" : "green";

  return (
    <span style={{ color: textColor, fontWeight: "600", fontSize: "16px" }}>
      {remainingTime}
    </span>
  );
};

export default ReactVisitorTable;
