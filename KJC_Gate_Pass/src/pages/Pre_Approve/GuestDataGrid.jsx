import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Badge,
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Container,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL, formatDateWithPadding } from "../../library/helper";
import { ToastContainer, toast, Slide } from "react-toastify";
import dayjs from "dayjs";

const GuestDataGrid = ({ userINFO }) => {
  const [editMode, setEditMode] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const fetchGuestHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userEmail = payload.email;
        if (!userEmail) {
          console.error("User email not found in token payload");
          return;
        }

        const response = await axios.get(`${API_URL}/guest/guest-history`, {
          params: {
            HODEmail: userEmail,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const guests = Array.isArray(response.data)
          ? response.data
          : [response.data];

        const formattedGuests = guests.map((guest) => ({
          id: guest._id,
          passId: guest.passId,
          name: guest.name || "",
          mobileNo: guest.mobile || "",
          date: guest.eventDateTime
            ? dayjs(guest.eventDateTime).format("YYYY-MM-DD, hh:mm A")
            : "",
          email: guest.email || "",
          event: guest.event || "",
          invitedAs: guest.invitedAs || "",
          guestCategory: guest.guestCategory || "",
          groupSize: guest.groupSize || "",
          entryGate: guest.entryGate || "",
          vehicleParkingInfo: guest.vehicleParkingInfo || "",
          noOfemailSent: guest.noOfemailSent || 0,
          isVisited: guest.isVisited || false,
          checkedInTime: guest.checkedInTime || null,
        }));

        setRows(formattedGuests);
        setOriginalRows(formattedGuests);
      } catch (error) {
        console.error("Error fetching guest history data:", error);
      }
    };

    fetchGuestHistory();
  }, [API_URL]);

  const notifyErr = (text) =>
    toast.error(text, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "custom-toast",
      transition: Slide,
    });

  const notifySuccess = (text) =>
    toast.success(text, {
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

  const handleOnChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (date) => {
    setFilterDate(date);
  };

  const handleDeleteClick = async (id) => {
    const rowToUpdate = rows.find((row) => row.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the Guest with name: ${rowToUpdate?.name}?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        notifyErr("Authentication token missing. Please log in again.");
        return;
      }

      await axios.delete(`${API_URL}/guest/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notifySuccess(`Deleted Guest: ${rowToUpdate?.name}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting row:", error);
      notifyErr("Failed to delete row. Please try again later.");
    }
  };

  const handleSaveClick = async (id) => {
    const rowToUpdate = rows.find((row) => row.id === id);
    if (!rowToUpdate) {
      console.error("Row not found for ID:", id);
      notifyErr("Row data not found.");
      return;
    }

    // Validate mobile number format
    const phoneNumberPattern = /^\d{10}$/;
    if (!phoneNumberPattern.test(rowToUpdate.mobileNo)) {
      notifyErr("Invalid phone number. Please ensure it is exactly 10 digits.");
      return;
    }

    const confirmSave = window.confirm(
      `Are you sure you want to save changes and resend the email for ${rowToUpdate.name}?`
    );
    if (!confirmSave) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        notifyErr("Authentication token missing. Please log in again.");
        return;
      }

      const payload = {
        name: rowToUpdate.name,
        mobileNo: rowToUpdate.mobileNo,
        date: rowToUpdate.date,
        email: rowToUpdate.email,
        event: rowToUpdate.event,
        invitedAs: rowToUpdate.invitedAs,
        isVisited: rowToUpdate.isVisited,
        checkedInTime: rowToUpdate.checkedInTime,
      };

      await axios.put(`${API_URL}/guest/update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notifySuccess("Update complete; email successfully resent!");
    } catch (error) {
      console.error("Error saving row data:", error);
      notifyErr("Failed to save changes. Please try again later.");
    }
  };

  const handleCancelClick = () => {
    setRows(originalRows);
    window.location.reload();
  };

  const handleCellEditCommit = useCallback(
    async (params) => {
      const updatedRows = rows.map((row) => {
        if (row.id === params.id) {
          return { ...row, [params.field]: params.value };
        }
        return row;
      });
      setRows(updatedRows);

      // try {
      //   const token = localStorage.getItem("token");
      //   if (!token) {
      //     console.error("No token found");
      //     return;
      //   }

      //   await axios.put(
      //     `${API_URL}/guest/update/${params.id}`,
      //     { [params.field]: params.value },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     }
      //   );
      // } catch (error) {
      //   console.error("Error saving row data:", error);
      //   notifyErr("Failed to save changes. Please try again later.");
      // }
    },
    [rows]
  );

  const handleResendEmail = async (row) => {
    if (row.isVisited && row.checkedInTime) {
      notifyErr(
        `Guest has already entered the campus on ${formatDateWithPadding(
          row.checkedInTime
        )}`
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to send an invitation to: ${row.email}`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Couldn't get token!");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          name: payload.name,
          email: payload.email,
          phone_number: payload.phone_number,
        };

        const response = await axios.post(
          `${API_URL}/guest/resend-invitation/${row.passId}`,
          { userInfo: user },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        notifySuccess(response.data.message);
      } catch (error) {
        console.error("Error resending email:", error);
        notifyErr("Failed to resend email. Please try again later.");
      }
    }
  };

  const handleDateChange = (params, date) => {
    handleCellEditCommit({
      id: params.id,
      field: "date",
      value: date ? dayjs(date).format("YYYY-MM-DD") : null,
    });
  };

  const filteredRows = rows.filter(
    (row) =>
      (searchTerm === "" ||
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.passId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterDate || row.date === dayjs(filterDate).format("YYYY-MM-DD"))
  );

  const columns = [
    { field: "passId", headerName: "Pass Id", width: 80, editable: editMode },
    { field: "name", headerName: "Name", width: 150, editable: editMode },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      width: 130,
      editable: editMode,
    },
    { field: "email", headerName: "Email", width: 200, editable: editMode },
    {
      field: "date",
      headerName: "Event Date",
      width: 130,
      editable: false,
      renderCell: (params) =>
        editMode ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={params.value ? dayjs(params.value) : null}
              onChange={(date) => handleDateChange(params, date)}
              slotProps={{ textField: { variant: "outlined" } }}
            />
          </LocalizationProvider>
        ) : (
          params.value
        ),
    },
    {
      field: "invitedAs",
      headerName: "Invited As",
      width: 110,
      editable: editMode,
    },
    {
      field: "guestCategory",
      headerName: "Guest Category",
      width: 110,
      editable: editMode,
    },
    {
      field: "groupSize",
      headerName: "Group Size",
      width: 110,
      editable: editMode,
    },
    {
      field: "entryGate",
      headerName: "Entry Gate",
      width: 110,
      editable: editMode,
    },
    {
      field: "vehicleParkingInfo",
      headerName: "Parking Info",
      width: 110,
      editable: editMode,
    },

    {
      field: "isVisited",
      headerName: "Visited",
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Badge
          badgeContent={params.row.isVisited ? "Visited" : "Not Visited"}
          color={params.row.isVisited ? "success" : "error"}
          sx={{ marginLeft: 4 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const { id } = params.row;
        return (
          <Stack direction="row" spacing={1} sx={{ paddingTop: "5px" }}>
            <IconButton
              onClick={() => handleResendEmail(params.row)}
              color="primary"
              disabled={params.row.isVisited}
            >
              <Badge badgeContent={params.row.noOfemailSent} color="error">
                <EmailIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={() => handleSaveClick(id)} color="success">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelClick} color="error">
              <ReplayIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteClick(id)}
              color="error"
              disabled={params.row.isVisited}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ width: "97vw", paddingBottom: "40px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={handleDateFilterChange}
            slotProps={{ textField: { variant: "outlined" } }}
          />
        </LocalizationProvider>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleOnChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={editMode}
              onChange={() => setEditMode((prev) => !prev)}
            />
          }
          label="Enable Edit Mode"
        />
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          onCellEditCommit={handleCellEditCommit}
          components={{ Toolbar: GridToolbar }}
        />
        <ToastContainer />
      </Box>
    </Container>
  );
};

export default GuestDataGrid;
