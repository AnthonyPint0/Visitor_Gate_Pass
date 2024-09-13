import "./Register_Guest.css";
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = API_BASE_URL;

const Register_Guest = ({ handleClose, userINFO }) => {
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailSubject: "",
    mobileNo: "",
    event: "",
    invitedAs: "",
    date: dayjs(),
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
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [id]: numericValue,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNo: numericValue.length > 0 ? "" : "Mobile number is required",
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

    console.log("Form Data:", {
      name: formData.name,
      email: formData.email,
      subject: formData.emailSubject,
      mobile: formData.mobileNo,
      event: formData.event,
      invitedAs: formData.invitedAs,
      eventDateTime: formData.date.toISOString(), // Ensure the date is in ISO format
    });

    const newErrors = {
      email: validateEmail(formData.email) ? "" : "Invalid email format",
      mobileNo: formData.mobileNo.length > 0 ? "" : "Mobile number is required",
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.mobileNo || !formData.name) {
      notifyErr("Please enter all the fields with appropriate data.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Ensure token is handled securely

      if (!token) {
        alert("No token found.");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
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
          eventDateTime: formData.date.toISOString(), // Ensure the date is in ISO format
          userINFO: userINFO,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
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
        });
        setErrors({ email: "", mobileNo: "" });
        setTimeout(() => {
          navigator("/pre_approved_guest");
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
    });
    setErrors({ email: "", mobileNo: "" });
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Expected Date"
                      value={formData.date}
                      onChange={handleDateChange}
                      slots={{
                        textField: (params) => <TextField {...params} />,
                      }}
                    />
                  </LocalizationProvider>
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
