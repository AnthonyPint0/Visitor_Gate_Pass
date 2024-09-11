import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function DashboardWidget(props) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        minWidth: 170,
        p: 1,
        boxShadow: 3,
        width: "100%",
        maxWidth: { xs: "90%", sm: 200, md: 240 },
        height: { xs: 80, sm: 90, md: 100 },
        margin: "10",
        borderRadius: 2,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 32, sm: 50, md: 60 },
          height: { xs: 32, sm: 50, md: 60 },
        }}
      >
        <img
          src={props.icon}
          alt={props.title}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
      <CardContent
        sx={{
          textAlign: "left",
          flexGrow: 1,
          ml: 0,
          //p: 0,
          minWidth: 0,
        }}
      >
        {props.isCountWidget && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#333",
              mt: 0.5,
              fontSize: { xs: 16, sm: 18, md: 20 },
            }}
          >
            {props.count}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#4f4f4f",
            fontSize: { xs: 14, sm: 17, md: 20 },
            whiteSpace: "nowrap", //for one line text
          }}
        >
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardWidget;
