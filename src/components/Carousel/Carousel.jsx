import React, { useState } from "react";
import {
  Box,
  IconButton,
  MobileStepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import "./Carousel.scss";

const Carousel = ({ images = [], video = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [viewMode, setViewMode] = useState(images.length > 0 ? "image" : "video");

  const hasMultipleImages = images && images.length > 1;
  const hasVideo = !!video;

  const handleNext = () => {
    if (viewMode === "image") {
      setActiveStep((prevStep) => (prevStep + 1) % images.length);
    }
  };

  const handleBack = () => {
    if (viewMode === "image") {
      setActiveStep((prevStep) =>
        prevStep === 0 ? images.length - 1 : prevStep - 1
      );
    }
  };

  const handleDotClick = (index) => {
    setActiveStep(index);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      setActiveStep(0);
    }
  };


  if ((!images || images.length === 0) && !video) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          aspectRatio: "1",
        }}
      >
        No media available
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {hasVideo && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
          >
            {images.length > 0 && (
              <ToggleButton value="image" aria-label="images">
                <ImageIcon sx={{ mr: 1 }} />
                <Typography variant="button">Images ({images.length})</Typography>
              </ToggleButton>
            )}
            <ToggleButton value="video" aria-label="video">
              <VideoLibraryIcon sx={{ mr: 1 }} />
              <Typography variant="button">Video</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {viewMode === "image" && images.length > 0 && (
        <Box sx={{ position: "relative", width: "100%" }}>
          <Box
            component="img"
            src={images[activeStep]}
            alt={`Product ${activeStep + 1}`}
            sx={{
              width: "100%",
              borderRadius: "8px",
              objectFit: "cover",
              maxHeight: "500px",
              display: "block",
            }}
          />

          {hasMultipleImages && (
            <>
              <IconButton
                onClick={handleBack}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                <KeyboardArrowRight />
              </IconButton>
            </>
          )}

          {hasMultipleImages && (
            <MobileStepper
              steps={images.length}
              position="bottom"
              activeStep={activeStep}
              sx={{
                backgroundColor: "transparent",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                "& .MuiMobileStepper-dot": {
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  margin: "0 4px",
                  cursor: "pointer",
                  "&.Mui-active": {
                    backgroundColor: "white",
                  },
                },
              }}
              backButton={<Box />}
              nextButton={<Box />}
            />
          )}
        </Box>
      )}

      {viewMode === "video" && video && (
        <Box
          sx={{
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          <video
            width="100%"
            height="auto"
            controls
            style={{
              maxHeight: "500px",
              objectFit: "contain",
            }}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
    </Box>
  );
};

export default Carousel;