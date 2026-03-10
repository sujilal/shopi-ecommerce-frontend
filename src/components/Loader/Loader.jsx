import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import "./Loader.scss";

const Loader = ({ message = "Loading...", fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box className="loader loader--fullscreen">
        <CircularProgress />
        {message && <Typography variant="body2">{message}</Typography>}
      </Box>
    );
  }

  return (
    <Box className="loader">
      <CircularProgress />
      {message && <Typography variant="body2">{message}</Typography>}
    </Box>
  );
};

export default Loader;