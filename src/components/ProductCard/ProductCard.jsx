import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Button,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({ to: `/product/${product.slug}` });
  };

  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        className="card-image"
        image={product.image}
        alt={product.title}
      />

      <CardContent className="card-content">
        <Typography variant="h6" component="div" className="product-title">
          {product.title}
        </Typography>

        <Box className="rating-section">
          <Rating value={product.rating} readOnly size="small" />
          <Typography variant="caption">
            ({product.reviews})
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          className="description"
        >
          {product.description}
        </Typography>

        <Box className="card-footer">
          <Typography variant="h6" className="price">
            ${product.price}
          </Typography>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className="view-btn"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;