import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Pagination,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader";
import { GET_ALL_PRODUCTS, SEARCH_PRODUCTS } from "../../graphql/queries/queries";
import LogoutIcon from "@mui/icons-material/Logout";
import ErrorIcon from "@mui/icons-material/Error";
import "./ProductListPage.scss";

const ProductListPage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;


  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);


  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const { data, loading, error } = useQuery(
    searchTerm ? SEARCH_PRODUCTS : GET_ALL_PRODUCTS,
    {
      variables: searchTerm ? { search: searchTerm } : {},
      skip: !isAuthenticated
    }
  );

  const allProducts = searchTerm
    ? data?.searchHomeProducts || []
    : data?.getAllProducts?.products || [];

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    const isAccessDenied = error.message?.includes("Access denied") ||
      error.networkError?.statusCode === 401 ||
      error.graphQLErrors?.some(e => e.extensions?.code === "UNAUTHENTICATED");

    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header user={user} onLogout={handleLogout} />
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Paper sx={{ p: 4, backgroundColor: "#fff3e0" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <ErrorIcon sx={{ fontSize: 40, color: "#f57c00", mt: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {isAccessDenied ? "Authorization Error" : "Failed to Load Products"}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  {isAccessDenied
                    ? "You don't have permission to access products. Please log in again."
                    : error.message}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Go Back to Login
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header user={user} onLogout={handleLogout} />

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }} className="product-list-page">
        <Box sx={{ mb: 4 }}>
          {/* <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Products
          </Typography> */}
          <Box className="search-bar">
            <SearchBar onSearch={setSearchTerm} disabled={loading} />
          </Box>
        </Box>

        {loading ? (
          <Loader message="Loading products..." />
        ) : error ? (
          <Paper sx={{ p: 4, backgroundColor: "#fff3e0" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <ErrorIcon sx={{ fontSize: 40, color: "#f57c00", mt: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Error Loading Products
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {error.message}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No products found. Try a different search term.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3} className="products-grid" sx={{ mb: 4 }}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                  size="large"
                  variant="outlined"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductListPage;