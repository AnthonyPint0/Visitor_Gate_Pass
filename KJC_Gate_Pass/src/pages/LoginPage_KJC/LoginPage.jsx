import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  DirectionsCar,
  Group,
  Assignment,
  Timeline,
  Gavel,
} from "@mui/icons-material";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Footer from "../../components/Footer/Footer";

function LoginPage() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60vh",
          backgroundColor: "#F0EBFA",
          clipPath: "ellipse(150% 100% at 50% 0%)",
          zIndex: 1,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Header />
      </Box>

      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          px: 1,
          py: 4,
          pb: 2,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction="column"
          textAlign="center"
        >
          <Grid item xs={12}>
            <Box
              sx={{
                px: { xs: 2, sm: 0, md: 4, lg: 2 },
                maxWidth: { xs: "100%", sm: "100%", md: "80%", lg: "80%" },
                mx: "auto",
                width: "100%",
                p: 0,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="700"
                gutterBottom
                sx={{
                  lineHeight: 1.2,
                  mb: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  fontFamily: "Inter, sans-serif",
                  color: "#35414B",
                }}
              >
                Welcome to
              </Typography>
              <Typography
                variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  lineHeight: 1.2,
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontFamily: "Inter, sans-serif",
                  color: "#35414B",
                }}
              >
                Secure Campus
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                paragraph
                sx={{
                  lineHeight: 1.3, // Adjust this to make the lines closer
                  fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" }, // Slightly smaller font
                  color: "#4E5A65",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Secure Campus is your trusted partner in college security. From
                managing visitors to upholding student discipline, we ensure a
                safe and efficient environment. Experience peace of mind with
                our comprehensive safety solutions.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <LoginForm />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          py: 1,
          width: "100%",
          pb: {
            xs: 1,
            md: 5,
          },
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <DirectionsCar fontSize="large" color="primary" />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1, fontFamily: "Inter, sans-serif" }}
              >
                Vehicle Management
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <Group fontSize="large" color="primary" />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
              >
                Visitors Management
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <Assignment fontSize="large" color="primary" />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
              >
                Visitors Logs
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <Timeline fontSize="large" color="primary" />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
              >
                Real Time Reports
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center" sx={{ mb: 1 }}>
              <Gavel fontSize="large" color="primary" />
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}
              >
                Student Discipline
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}

export default LoginPage;
