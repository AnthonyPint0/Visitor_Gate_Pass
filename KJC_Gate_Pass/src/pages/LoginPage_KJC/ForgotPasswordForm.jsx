import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Button, Stack, Box, Typography, TextField, Grid } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleOtpChange = (newValue) => setOtp(newValue);
  const handleNewPasswordChange = (event) => setNewPassword(event.target.value);
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);

  const sendOtp = (event) => {
    event.preventDefault();
    if (email === "") {
      toast.error("Email is required");
    } else {
      axios
        .post(`${API_BASE_URL}/auth/send-otp`, { email })
        .then(() => {
          toast.success("OTP sent to your email");
          setOtpSent(true);
        })
        .catch(() => {
          toast.error("Enter correct E-mail address");
        });
    }
  };

  const verifyOtp = (event) => {
    event.preventDefault();
    axios
      .post(`${API_BASE_URL}/auth/verify-otp`, { email, otp })
      .then(() => {
        toast.success("OTP verified successfully");
        setOtpVerified(true);
      })
      .catch(() => {
        toast.error("Invalid OTP");
      });
  };

  const changePassword = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      axios
        .post(`${API_BASE_URL}/auth/change-password`, { email, newPassword })
        .then(() => {
          toast.success("Password changed successfully");
          onBackToLogin();
        })
        .catch(() => {
          toast.error("Failed to change password");
        });
    }
  };

  return (
    <>
      {!otpSent ? (
        <>
          <Typography variant="h6" gutterBottom>
            Forgot Password
          </Typography>
          <TextField
            fullWidth
            label="Enter your email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            margin="normal"
            required
          />
          <Stack spacing={2} mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={sendOtp}
            >
              Send OTP
            </Button>
          </Stack>
        </>
      ) : !otpVerified ? (
        <>
          <Typography variant="h6" gutterBottom>
            Verify OTP
          </Typography>
          <MuiOtpInput
            value={otp}
            onChange={handleOtpChange}
            length={5}
            sx={{ marginY: 2, justifyContent: "center" }}
          />
          <Stack spacing={2} mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={verifyOtp}
            >
              Verify OTP
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter new password"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            margin="normal"
            required
          />
          <Stack spacing={2} mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={changePassword}
            >
              Change Password
            </Button>
          </Stack>
        </>
      )}
      <Stack mt={3} direction="row" justifyContent="center">
        <Button color="primary" onClick={onBackToLogin}>
          Back to Login
        </Button>
      </Stack>
    </>
  );
};

export default ForgotPasswordForm;
