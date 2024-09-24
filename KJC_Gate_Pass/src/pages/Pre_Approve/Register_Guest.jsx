import "./Register_Guest.css";
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = API_BASE_URL;

const Register_Guest = ({ handleClose, userINFO }) => {
  const navigator = useNavigate();
  const [shouldReload, setShouldReload] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailSubject: "",
    mobileNo: "",
    event: "",
    invitedAs: "",
    date: dayjs(),
    guestCategory: "",
    groupSize: "",
    entryGate: "",
    vehicleParkingInfo: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobileNo: "",
  });

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
      transition: Slide,
    });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "mobileNo") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prevData) => ({
        ...prevData,
        [id]: numericValue,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNo:
          numericValue.length === 10 ? "" : "Mobile number must be 10 digits",
      }));
    } else if (id === "email") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      date: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number format
    const phoneNumberPattern = /^\d{10}$/; // Regular expression for exactly 10 digits
    if (!phoneNumberPattern.test(formData.mobileNo)) {
      notifyErr("Invalid phone number. Please ensure it is exactly 10 digits.");
      return;
    }

    console.log("Form Data:", {
      name: formData.name,
      email: formData.email,
      subject: formData.emailSubject,
      mobile: formData.mobileNo,
      event: formData.event,
      invitedAs: formData.invitedAs,
      eventDateTime: formData.date.toISOString(),
      groupSize: formData.groupSize,
      guestCategory: formData.guestCategory,
      entryGate: formData.entryGate,
      vehicleParkingInfo: formData.vehicleParkingInfo,
    });

    // Validate inputs
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      email: validateEmail(formData.email) ? "" : "Invalid email format",
      mobileNo: formData.mobileNo.length > 0 ? "" : "Mobile number is required",
      event: formData.event ? "" : "Event is required",
      invitedAs: formData.invitedAs ? "" : "Invited As is required",
      guestCategory: formData.guestCategory ? "" : "Guest Category is required",
      groupSize: formData.groupSize ? "" : "Group Size is required",
      entryGate: formData.entryGate ? "" : "Entry Gate is required",
    };

    setErrors(newErrors);

    // Check if any errors exist
    if (Object.values(newErrors).some((error) => error)) {
      notifyErr("Please fill in all required fields with appropriate data.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found.");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userINFO = {
        name: payload.name,
        email: payload.email,
        phone_number: payload.phone_number,
      };

      const response = await axios.post(
        `${API_URL}/guest/send-invitation`,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.emailSubject,
          mobile: formData.mobileNo,
          event: formData.event,
          invitedAs: formData.invitedAs,
          eventDateTime: formData.date.toISOString(),
          groupSize: formData.groupSize,
          guestCategory: formData.guestCategory,
          entryGate: formData.entryGate,
          vehicleParkingInfo: formData.vehicleParkingInfo || null,
          userINFO: userINFO,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Invitation sent and history updated.") {
        notifySuccess("Guest pre-approval submitted successfully!");
        setFormData({
          name: "",
          email: "",
          emailSubject: "",
          mobileNo: "",
          event: "",
          invitedAs: "",
          date: dayjs(),
          guestCategory: "",
          groupSize: "",
          entryGate: "",
          vehicleParkingInfo: "",
        });
        setErrors({ email: "", mobileNo: "" });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        notifyErr("Failed to submit guest pre-approval.");
      }
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
      notifyErr("An error occurred. Please try again later.");
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      emailSubject: "",
      mobileNo: "",
      event: "",
      invitedAs: "",
      date: dayjs(),
      guestCategory: "",
      groupSize: "",
      entryGate: "",
      vehicleParkingInfo: "",
    });
    setErrors({ email: "", mobileNo: "" });
  };

  const handleGuestCategoryChange = (event) => {
    const category = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      guestCategory: event.target.value || category,
    }));
  };

  const handleEntryGateChange = (event) => {
    const gate = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      entryGate: event.target.value || gate,
    }));
  };

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <div className="content">
          <ToastContainer />
          <main className="main-content">
            <div className="form-container">
              <div className="register-guest-form overflow-auto">
                <div className="form-title">
                  <h2>Guest Pre-Approval Form</h2>
                </div>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    "& > :not(style)": {
                      m: 2,
                      width: { xs: "85%", sm: "40ch" },
                    },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    error={!formData.name}
                    helperText={!formData.name ? "Name is required" : ""}
                  />
                  <TextField
                    id="email"
                    label="E-mail"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    id="emailSubject"
                    label="E-mail Subject"
                    variant="outlined"
                    value={formData.emailSubject}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="mobileNo"
                    label="Mobile NO"
                    variant="outlined"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    required
                    error={!!errors.mobileNo}
                    helperText={errors.mobileNo}
                    maxRows={10}
                  />
                  <TextField
                    id="event"
                    label="Event"
                    variant="outlined"
                    value={formData.event}
                    onChange={handleInputChange}
                  />
                  <TextField
                    id="invitedAs"
                    label="Invited As"
                    variant="outlined"
                    value={formData.invitedAs}
                    onChange={handleInputChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="guest-category-label">
                      Guest Category
                    </InputLabel>
                    <Select
                      labelId="guest-category-label"
                      id="guest-category-select"
                      value={formData.guestCategory}
                      label="Guest Category"
                      onChange={handleGuestCategoryChange}
                    >
                      <MenuItem value={"Institutional Guest"}>
                        Institutional Guest
                      </MenuItem>
                      <MenuItem value={"Departmental Guest"}>
                        Departmental Guest
                      </MenuItem>
                      <MenuItem value={"Personal Guest"}>
                        Personal Guest
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="group-size-label">Group Size</InputLabel>
                    <Select
                      labelId="group-size-label"
                      value={formData.groupSize}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          groupSize: e.target.value,
                        }))
                      }
                      label="Group Size"
                    >
                      {Array.from({ length: 50 }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Expected Date and Time"
                      value={formData.date}
                      onChange={handleDateChange}
                      slots={{
                        textField: (params) => <TextField {...params} />,
                      }}
                    />
                  </LocalizationProvider>
                  <FormControl fullWidth>
                    <InputLabel id="entry-gate-label">Entry Gate</InputLabel>
                    <Select
                      labelId="entry-gate-label"
                      id="entry-gate-select"
                      value={formData.entryGate}
                      label="Entry Gate"
                      onChange={handleEntryGateChange}
                    >
                      <MenuItem value={"Gate 1"}>Gate 1</MenuItem>
                      <MenuItem value={"Gate 2"}>Gate 2</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    id="vehicleParkingInfo"
                    label="Vehicle Parking Info"
                    variant="outlined"
                    value={formData.vehicleParkingInfo}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        vehicleParkingInfo: e.target.value,
                      }))
                    }
                    helperText="*Optional"
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        "& .MuiButton-root": {
                          fontSize: { xs: "0.7rem", sm: "0.875rem" },
                          padding: { xs: "6px 8px", sm: "6px 16px" },
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                      <Button
                        type="submit"
                        variant="outlined"
                        endIcon={<SendIcon />}
                        sx={{
                          color: "white",
                          borderColor: "#4caf50",
                          backgroundColor: "#4caf50",
                          "&:hover": {
                            borderColor: "#006400",
                            backgroundColor: "#006400",
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </div>
                </Box>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Register_Guest;
