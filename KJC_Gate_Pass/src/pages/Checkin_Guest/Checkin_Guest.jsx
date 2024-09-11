import "./Checkin_Guest.css";
import React from "react";
import SecurityGuestDataGrid from "./SecurityGuestDataGrid";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar";
import Footer from "../../components/Footer/Footer";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledMenuItem,
  StyledSelect,
  StyledTextField,
} from "../../components/StyledComponents/StyledComponents.js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast, Slide } from "react-toastify";

const Checkin_Guest = () => {
  return (
    <div className="fakeBody">
      <div className="totalContent">
        <div className="content">
          <CompleteSidebar isActive="checkinGuest" />
          <ToastContainer />
          <main className="mainContent">
            <div className="checkin-guest-security">
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  overflow: "auto",
                }}
              >
                <h2
                  style={{
                    width: "100%",
                    height: "fit-content",
                    fontFamily: "Roboto, Poppins",
                    fontSize: "16px",
                    fontWeight: 500,
                    borderBottom: "1px solid rgb(183, 183, 183)",
                  }}
                >
                  Check-In Guest
                </h2>

                <Box sx={{ margin: { xs: 1, sm: 3, md: 5 } }}>
                  <SecurityGuestDataGrid />
                </Box>
              </Box>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Checkin_Guest;
