import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import Register_Guest from "./Register_Guest.jsx";
import ResponsiveAppBar from "./ResponsiveAppBar";
import GuestDataGrid from "./GuestDataGrid.jsx";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "../../components/Footer/Footer.jsx";

const Pre_Approve = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Function to decode token and extract user data
    const fetchUserData = () => {
      try {
        const token = localStorage.getItem("token"); // Ensure token is handled securely

        if (!token) {
          console.error("Couldn't get token!");
          return;
        }

        // Decode token payload
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Set user state
        setUser({
          name: payload.name,
          email: payload.email,
          phone_number: payload.phone_number,
        });
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    };

    // Fetch user data on component mount
    fetchUserData();
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    document.title = `Pre-Approved Guest: ${width} x ${height}`;
  }, [width, height]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ResponsiveAppBar />
      <Container sx={{ my: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            endIcon={<PersonAddAltTwoToneIcon />}
            sx={{
              fontWeight: "600",
              textTransform: "none",
              backgroundColor: "#239700",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#28a800" },
            }}
            onClick={handleOpen}
          >
            New Guest
          </Button>
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={open}
          >
            <Register_Guest handleClose={handleClose} userINFO={user} />
          </Backdrop>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <GuestDataGrid userINFO={user} />
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Pre_Approve;