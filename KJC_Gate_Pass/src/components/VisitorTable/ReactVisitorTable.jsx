import React, { useEffect, useMemo, useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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

  // Use effect to process the visitors data
  useEffect(() => {
    const updatedVisitors = visitors.map((visitor) => ({
      ...visitor,
      check_in_time: visitor.check_in_time
        ? formatDateWithPadding(visitor.check_in_time)
        : "",
      check_out_time: visitor.check_out_time
        ? formatDateWithPadding(visitor.check_out_time)
        : "",
    }));
    setProcessedVisitors(updatedVisitors);
  }, [visitors]);

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 90, sortable: true },
      {
        field: "phone_number",
        headerName: "Phone Number",
        width: 110,
        sortable: true,
      },
      {
        field: "purpose_of_visit",
        headerName: "Purpose of Visit",
        width: 130,
        sortable: true,
      },
      {
        field: "entry_gate",
        headerName: "Entry Gate",
        width: 95,
        sortable: true,
      },
      {
        field: "check_in_time",
        headerName: "Check-In Time",
        width: 180,
        sortable: true,
      },
      {
        field: "exit_gate",
        headerName: "Exit Gate",
        width: 90,
        sortable: true,
      },
      {
        field: "check_out_time",
        headerName: "Check-Out Time",
        width: 180,
        sortable: true,
      },
      {
        field: "visitor_cards",
        headerName: "Visitor ID Cards",
        width: 220,
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
            <img src={params.value} alt="Visitor" width="50" height="60" />
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

  return (
    <Container
      maxWidth="lg"
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
          />
        </Box>
      </StyledTableContainer>
    </Container>
  );
};

export default ReactVisitorTable;
