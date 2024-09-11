import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import KJC_Logo from "../../assets/KJC_Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/profile.svg";

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        width: "100%",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={KJC_Logo} alt="College_Logo" style={{ height: 60 }} />
          </Box>

          <Box>
            <Button
              startIcon={<PowerSettingsNewIcon />}
              color="error"
              onClick={() => handleLogout()}
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
