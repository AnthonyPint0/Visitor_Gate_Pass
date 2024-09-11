import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Badge, IconButton, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import "./custom-toastify.css"; // Your custom CSS file
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL, formatDateWithPadding } from "../../library/helper";
import { ToastContainer, toast, Slide } from "react-toastify";

const GuestDataGrid = ({ userINFO }) => {
  const [editMode, setEditMode] = useState({}); // Track which rows are in edit mode
  const [filterDate, setFilterDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const fetchGuestHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        const userEmail = payload.email;
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${API_URL}/guest/guest-history`, {
          params: {
            HODEmail: userEmail, // Send HODEmail as query param
          },
          headers: {
            Authorization: `Bearer ${token}`, // Ensure Bearer token is correctly formatted
          },
        });

        const guests = Array.isArray(response.data)
          ? response.data
          : [response.data];

        // Map and format guests data
        const formattedGuests = guests.map((guest) => ({
          id: guest._id,
          passId: guest.passId,
          name: guest.name || "",
          mobileNo: guest.mobile || "",
          date: guest.eventDateTime
            ? new Date(guest.eventDateTime).toISOString().split("T")[0]
            : "",
          email: guest.email || "",
          event: guest.event || "",
          invitedAs: guest.invitedAs || "",
          noOfemailSent: guest.noOfemailSent || 0,
          isVisited: guest.isVisited || false,
          checkedInTime: guest.checkedInTime || null,
        }));

        setRows(formattedGuests);
      } catch (error) {
        console.error("Error fetching guest history data:", error);
      }
    };

    fetchGuestHistory();
  }, []);

  const notifyErr = (text) =>
    toast.error(`${text}`, {
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

  const handleOnChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (date) => {
    setFilterDate(date);
  };

  const toggleEditMode = (id) => {
    setEditMode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveClick = async (id) => {
    // Find the row that is being edited
    const rowToUpdate = rows.find((row) => row.id === id); // Assuming this is the MongoDB _id
    console.log(rowToUpdate);

    if (!rowToUpdate) {
      console.error("Row not found for ID:", id);
      return;
    }

    if (rowToUpdate.isVisited && rowToUpdate.checkedInTime) {
      notifyErr(
        `Guest has already entered the campus on ${formatDateWithPadding(
          rowToUpdate.checkedInTime
        )}`
      );
      return;
    }

    // Prompt the user for confirmation
    const confirmSave = window.confirm(
      `Are you sure you want to save changes and resend the email for ${rowToUpdate.name}?`
    );

    if (!confirmSave) {
      return; // Exit if the user cancels
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      console.log(userINFO);

      // Send the update request to your API using MongoDB _id
      await axios.put(
        `${API_URL}/guest/update/${id}`,
        {
          rowToUpdate,
          userInfo: userINFO, // Assuming userINFO is available in your scope
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notifySuccess("Update complete; email successfully resent!");
    } catch (error) {
      console.error("Error saving row data:", error);
      notifyErr("Failed to save changes. Please try again later.");
    }

    // Exit edit mode
    toggleEditMode(id);
  };

  const handleCancelClick = (id) => {
    // Restore row data from backup if implemented
    toggleEditMode(id);
    window.location.reload();
  };

  const handleCellEditCommit = useCallback(
    (params) => {
      const updatedRows = rows.map((row) => {
        if (row.id === params.id) {
          return { ...row, [params.field]: params.value };
        }
        return row;
      });
      setRows(updatedRows);
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
        const token = localStorage.getItem("token"); // Ensure token is handled securely

        if (!token) {
          console.error("Couldn't get token!");
          return;
        }

        // Decode token payload
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Set user state
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
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );

        notifySuccess(response.data.message); // Notify user of success
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        console.error("Error resending email:", error);
        notifyErr("Failed to resend email. Please try again later."); // Notify user of failure
      }
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
        return editMode[params.id] ? (
          <input
            value={formattedValue}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "passId",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{formattedValue}</div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      sortable: true,

      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "name",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      width: 100,
      sortable: false,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "mobileNo",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      sortable: true,

      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            type="date"
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "date",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: true,

      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "email",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "event",
      headerName: "Event",
      width: 150,
      sortable: true,
      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "event",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "invitedAs",
      headerName: "Invited As",
      width: 105,
      sortable: true,

      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "invitedAs",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value}</div>
        ),
    },
    {
      field: "isVisited",
      headerName: "Has Visited?",
      width: 105,
      sortable: true,

      renderCell: (params) =>
        editMode[params.id] ? (
          <input
            value={params.value}
            onChange={(e) => {
              e.stopPropagation();
              handleCellEditCommit({
                id: params.id,
                field: "isVisited",
                value: e.target.value,
              });
            }}
          />
        ) : (
          <div>{params.value == false ? "No" : "Yes"}</div>
        ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {editMode[params.id] ? (
            <>
              <IconButton
                size="small"
                onClick={() => handleSaveClick(params.id)}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleCancelClick(params.id)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton size="small" onClick={() => toggleEditMode(params.id)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => handleResendEmail(params.row)}
          >
            <Badge
              badgeContent={
                params.row.noOfemailSent ? params.row.noOfemailSent : 0
              } // Use 0 as a fallback value
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  minWidth: "16px",
                  height: "16px",
                  fontSize: "10px", // Adjust the font size
                },
              }}
            >
              <EmailIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f2f9ff",
      }}
    >
      <div
        className="search-filter-txt"
        style={{ display: "flex", justifyContent: "flex-end", padding: "16px" }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            sx={{ backgroundColor: "#ffffff" }}
            id="search-filter"
            label="Search by name or Pass Id"
            variant="outlined"
            value={searchTerm}
            onChange={handleOnChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ backgroundColor: "#ffffff" }}
              label="Filter by Date"
              value={filterDate}
              onChange={handleDateFilterChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Stack>
      </div>
      <DataGrid
        sx={{
          border: "1px solid white",
          borderRadius: "15px",
          boxShadow: "2",
          backgroundColor: "#ffffff",
        }}
        rows={rows.filter((row) => {
          const matchesSearchTerm =
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.passId.toString().includes(searchTerm);
          const matchesDateFilter = filterDate
            ? new Date(row.date).toDateString() ===
              new Date(filterDate).toDateString()
            : true;
          return matchesSearchTerm && matchesDateFilter;
        })}
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
        onCellEditCommit={handleCellEditCommit} // Handle cell edit commits
        style={{ height: 650, width: "100%" }}
      />
      <ToastContainer />
    </div>
  );
};

export default GuestDataGrid;
