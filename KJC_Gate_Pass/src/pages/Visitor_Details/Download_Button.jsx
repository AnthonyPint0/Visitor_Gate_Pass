import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DownloadIcon from "@mui/icons-material/Download";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import useWindowSize from "../../hooks/useWindowSize";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { API_BASE_URL } from "../../library/helper";

const Download_Button = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("today");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { width } = useWindowSize();
  const API_URL = API_BASE_URL;

  const togglePopover = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleProceed = async (e) => {
    e.preventDefault();

    let formattedStartDate, formattedEndDate;

    const today = new Date();

    if (selectedOption === "today") {
      formattedStartDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString();
    } else if (selectedOption === "lastWeek") {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);
      formattedStartDate = new Date(
        lastWeekStart.setHours(0, 0, 0, 0)
      ).toISOString();
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString();
    } else if (selectedOption === "lastMonth") {
      const lastMonthStart = new Date(today);
      lastMonthStart.setMonth(today.getMonth() - 1);
      formattedStartDate = new Date(
        lastMonthStart.setHours(0, 0, 0, 0)
      ).toISOString();
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString();
    } else if (selectedOption === "lastYear") {
      const lastYearStart = new Date(today);
      lastYearStart.setFullYear(today.getFullYear() - 1);
      formattedStartDate = new Date(
        lastYearStart.setHours(0, 0, 0, 0)
      ).toISOString();
      formattedEndDate = new Date(
        today.setHours(23, 59, 59, 999)
      ).toISOString();
    } else {
      formattedStartDate = new Date(
        new Date(startDate).setHours(0, 0, 0, 0)
      ).toISOString();
      formattedEndDate = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      ).toISOString();
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/reports/export-visitor-report`,
        {
          params: { startDate: formattedStartDate, endDate: formattedEndDate },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Visitor_Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error fetching report:", error);
    }

    setIsOpen(false);
  };

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Stack direction="row" spacing={1}>
        {width <= 600 ? (
          <IconButton
            aria-label="download"
            onClick={togglePopover}
            sx={{
              backgroundColor: "blue",
              color: "white",
              border: "1px solid white",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            <DownloadIcon />
          </IconButton>
        ) : (
          <Button
            variant="outlined"
            onClick={togglePopover}
            sx={{
              textTransform: "none",
              backgroundColor: "#2a58f6", // #2a58f6 background
              color: "white", // White text color
              border: "1px solid white", // White border
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
            startIcon={<DownloadIcon />}
          >
            <Typography variant="h6">Download</Typography>
          </Button>
        )}
      </Stack>

      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "50px",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            padding: 2,
            width: 160,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            <label>
              <input
                type="radio"
                value="today"
                checked={selectedOption === "today"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Today
            </label>
            <label>
              <input
                type="radio"
                value="lastWeek"
                checked={selectedOption === "lastWeek"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Week
            </label>
            <label>
              <input
                type="radio"
                value="lastMonth"
                checked={selectedOption === "lastMonth"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Month
            </label>
            <label>
              <input
                type="radio"
                value="lastYear"
                checked={selectedOption === "lastYear"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Last Year
            </label>
            <label>
              <input
                type="radio"
                value="custom"
                checked={selectedOption === "custom"}
                onChange={(e) => setSelectedOption(e.target.value)}
              />{" "}
              Custom
            </label>
          </Box>

          {selectedOption === "custom" && (
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="body1">Start from:</Typography>
              <CustomDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />
              <Typography variant="body1">End on:</Typography>
              <CustomDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </Box>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: "blue",
              color: "white",
              mt: 2,
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
            onClick={handleProceed}
          >
            Proceed
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Download_Button;
