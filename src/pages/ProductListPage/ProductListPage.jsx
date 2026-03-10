import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader";
import { GET_LANDING_PRODUCTS, SEARCH_PRODUCTS } from "../../graphql/queries/queries";
import LogoutIcon from "@mui/icons-material/Logout";
import "./ProductListPage.scss";

const ProductListPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");


  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);


  const { data, loading, error } = useQuery(
    searchTerm ? SEARCH_PRODUCTS : GET_LANDING_PRODUCTS,
    {
      variables: searchTerm ? { keyword: searchTerm } : { cursor: null },
      skip: !isAuthenticated
    }
  );

  const products = searchTerm
    ? data?.searchHomeProducts || []
    : data?.getLandingProducts?.products || [];

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error loading products: {error.message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="product-list-page">
      <Box className="header">
        <Box>
          <Typography variant="h4" component="h1">
            Products
          </Typography>
          {user && (
            <Typography variant="body2" color="textSecondary">
              Welcome, {user.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          color="error"
          className="logout-btn"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>


      <Box className="search-bar">
        <SearchBar onSearch={setSearchTerm} disabled={loading} />
      </Box>


      {loading ? (
        <Loader message="Loading products..." />
      ) : products.length === 0 ? (
        <Box className="empty-state">
          <Typography variant="h6" color="textSecondary">
            No products found. Try a different search term.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} className="products-grid">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductListPage;