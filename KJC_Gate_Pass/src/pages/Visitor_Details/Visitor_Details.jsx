import React, { useState, useEffect } from "react";
import SideBarNavi from "../../components/SideBarNavi/SideBarNavi.jsx";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import VisitorTable2 from "./VisitorTable2.jsx";
import Download_Button from "./Download_Button.jsx";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";
import useWindowSize from "../../hooks/useWindowSize";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = API_BASE_URL + "/visitors/visitor-sessions";

const Visitor_Details = () => {
  const { width, height } = useWindowSize();
  const [filterText, setFilterText] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Visitor Details: ${width} x ${height}`;
  }, [width, height]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVisitorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);

  useEffect(() => {
    const filtered = visitorData.filter(
      (visitor) =>
        visitor.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        visitor.phone_number?.includes(filterText)
    );
    setFilteredVisitors(filtered);
  }, [filterText, visitorData]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  return (
    <div
      className="fakeBody"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div className="totalContent" style={{ flexGrow: 1, display: "flex" }}>
        <CompleteSidebar isActive="visitorDetails" />
        <main
          className="mainContent"
          style={{ flexGrow: 1, paddingBottom: "90px" }} // Increased padding to make room for footer
        >
          <Container
            maxWidth="lg"
            sx={{
              backgroundColor: "transparent",
              padding: { xs: 2, sm: 3, md: 4 },
              minHeight: "100vh",
              paddingBottom: "80px", // Ensure there is enough space at the bottom for the footer
            }}
          >
            <Typography
              variant="h4"
              sx={{
                marginBottom: 2,
                fontSize: {
                  xs: "1.5rem", // Smaller font size on extra-small screens
                  sm: "2rem", // Medium font size on small screens
                  md: "2.125rem", // Default h4 size on medium and larger screens
                },
              }}
            >
              Visitor Details
            </Typography>

            <Box
              sx={{
                display: "flex",

                justifyContent: "flex-end", // This will only apply when display is flex
                alignItems: "center", // This will only apply when display is flex
                marginBottom: 3,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search"
                value={filterText}
                onChange={handleFilterChange}
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
                    xs: "80%",
                    sm: "80%",
                    md: "60%",
                  },
                  marginRight: 2,
                  padding: {
                    xs: "6px 8px", // Smaller padding for small screens
                    sm: "8px 12px", // Normal padding for larger screens
                  },
                }}
              />
              <Download_Button />
            </Box>

            <Box sx={{ pb: "40px" }}>
              {loading ? (
                <LoadingSpinner />
              ) : filteredVisitors.length === 0 ? (
                <Typography variant="h6">No Visitor Found!</Typography>
              ) : (
                <VisitorTable2 visitors={filteredVisitors} />
              )}
            </Box>
          </Container>
        </main>
      </div>
      <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
    </div>
  );
};

export default Visitor_Details;
