import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  TextField,
  Stack,
  InputAdornment,
  Button,
  Backdrop,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import { API_BASE_URL } from "../../library/helper";
import { useNavigate } from "react-router-dom";

const SecurityGuestDataGrid = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = API_BASE_URL;
  const [shouldReload, setShouldReload] = useState(false);
  const navigator = useNavigate();

  const handleClose = () => {
    setOpen(false);
    setSelectedGuest(null);
  };

  const handleOpen = (guest) => {
    setSelectedGuest(guest);
    setOpen(true);
  };

  const notifySuccess = (text) =>
    toast.success(`${text}`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "custom-toast",
      transition: Slide,
    });

  useEffect(() => {
    const fetchGuestHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure token is handled securely

        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/security/guest-details-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );

        const guests = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const formattedGuests = guests.map((guest) => ({
          id: guest._id,
          passId: guest.passId,
          name: guest.name || "",
          email: guest.email || "",
          mobileNo: guest.mobile || "",
          date: guest.eventDateTime
            ? new Date(guest.eventDateTime).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "",
          event: guest.event || "",
          invitedAs: guest.invitedAs || "",
          entryGate: guest.entryGate || "",
          guestCategory: guest.guestCategory || "",
          groupSize: guest.groupSize || "",
          vehicleParkingInfo: guest.vehicleParkingInfo || "",
        }));
        setRows(formattedGuests);
      } catch (error) {
        console.error("Error fetching guest details:", error);
      }
    };

    fetchGuestHistory();
  }, [API_URL]);

  const handleCheckinGuest = async (passId) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is handled securely

      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/security/checkin-guest/${passId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      if (response.status === 200) {
        // Guest checked-in successfully
        // Update the guest's status in the data grid
        const updatedRows = rows.map((row) =>
          row.id === passId ? { ...row, checkedIn: true } : row
        );
        setRows(updatedRows);
        // Close the guest details dialog
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        // Show success message
        notifySuccess("Guest Checked-In Successfully!");
      } else {
        // Handle error response from the API
        console.error("Error checking-in guest:", response.data);
        notifyErr("Failed to check-in guest.");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error checking-in guest:", error);
      notifyErr("Error occurred during check-in.");
    }
  };

  const columns = [
    {
      field: "passId",
      headerName: "Pass Id",
      width: 100,
      type: "number",
      sortable: true,
      renderCell: (params) => {
        const formattedValue = params.value
          ? params.value.toString().padStart(4, "0")
          : "N/A";
        return <div>{formattedValue}</div>;
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      sortable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ mt: 1, ml: 1 }}>
          <Button
            variant="text"
            size="small"
            color="success"
            sx={{ textTransform: "none", fontWeight: "500" }}
            onClick={() => handleOpen(params.row)}
          >
            Check-In
          </Button>
        </Stack>
      ),
    },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      row.name.toLowerCase().includes(searchTermLower) ||
      row.passId.toString().includes(searchTermLower)
    );
  });

  return (
    <div
      style={{
        height: "fit-content",
        width: "fit-content",
        backgroundColor: "#ffffff",
        padding: "16px",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "20px",
              backgroundColor: "#fff",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            },
          }}
          sx={{
            width: {
              xs: "50%",
              sm: "50%",
              md: "50%",
            },
            marginRight: 2,
            padding: {
              xs: "6px 8px", // Smaller padding for small screens
              sm: "8px 12px", // Normal padding for larger screens
            },
          }}
        />
      </Stack>
      <DataGrid
        sx={{
          border: "1px solid white",
          borderRadius: "15px",
          boxShadow: 2,
          backgroundColor: "#ffffff",
          fontWeight: "500",
        }}
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        components={{
          Toolbar: GridToolbar,
        }}
        disableSelectionOnClick
        disableColumnMenu
      />
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={open}
        onClick={handleClose}
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: 2,
            width: "80%",
            maxWidth: 500,
            textAlign: "left",
            position: "relative", // To position the close icon within the box
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedGuest ? (
            <>
              {/* Close Button */}
              <IconButton
                size="large"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CancelIcon color="error" fontSize="inherit" />
              </IconButton>

              {/* Guest Details */}
              <Typography
                variant="h6"
                sx={{ borderBottom: "1px solid black" }}
                gutterBottom
              >
                <strong>Guest Details</strong>
              </Typography>
              <div>
                <strong>Pass ID:</strong>
                <Box
                  sx={{
                    display: "inline-block",
                    ml: 1, // Add some margin to the left
                    padding: "4px 8px", // Add some padding inside the box
                    border: "1px solid #fffff", // Border around the value
                    borderRadius: "4px", // Rounded corners
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)", // Box shadow
                    backgroundColor: "#0b3574", // Background color
                    color: "#ffffff", // Text color
                    fontWeight: "500", // Bold text
                    fontSize: "1.25rem", // Larger font size
                  }}
                >
                  {selectedGuest.passId}
                </Box>
              </div>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Name:</strong> {selectedGuest.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Email:</strong> {selectedGuest.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Mobile Number:</strong> {selectedGuest.mobileNo}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Event:</strong> {selectedGuest.event}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Invited As:</strong> {selectedGuest.invitedAs}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Guest Category:</strong> {selectedGuest.guestCategory}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Entry Gate:</strong> {selectedGuest.entryGate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Group Size:</strong> {selectedGuest.groupSize}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Vehicle Parking:</strong>{" "}
                {selectedGuest.vehicleParkingInfo}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                <strong>Date:</strong> {selectedGuest.date}
              </Typography>
              <Stack>
                <Button
                  endIcon={<SendIcon />}
                  variant="contained"
                  sx={{
                    position: "absolute",
                    bottom: 16, // Adjust as needed
                    right: 16, // Adjust as needed
                    backgroundColor: "#239700",
                  }}
                  onClick={() => handleCheckinGuest(selectedGuest.passId)}
                >
                  Check-in
                </Button>
              </Stack>
            </>
          ) : (
            "Loading..."
          )}
        </Box>
      </Backdrop>
    </div>
  );
};

export default SecurityGuestDataGrid;
