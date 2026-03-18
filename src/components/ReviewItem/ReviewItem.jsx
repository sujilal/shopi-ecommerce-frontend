import React from "react";
import {
  Box,
  Typography,
  Rating,
  Paper,
  Avatar,
} from "@mui/material";

const ReviewItem = ({ review }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "start" }}>
        {review.user?.image && (
          <Avatar 
            src={review.user.image} 
            alt={review.user?.displayName}
            sx={{ width: 40, height: 40 }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {review.user?.displayName || "Anonymous"}
              </Typography>
              <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {review.review}
          </Typography>
          {review.likes && review.likes.length > 0 && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
              👍 {review.likes.length} people found this helpful
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewItem;