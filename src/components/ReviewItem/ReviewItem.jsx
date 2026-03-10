import React from "react";
import {
  Box,
  Typography,
  Rating,
  Paper,
} from "@mui/material";

const ReviewItem = ({ review }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {review.author}
          </Typography>
          <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
        </Box>
        <Typography variant="caption" color="textSecondary">
          {new Date(review.date).toLocaleDateString()}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {review.comment}
      </Typography>
    </Paper>
  );
};

export default ReviewItem;