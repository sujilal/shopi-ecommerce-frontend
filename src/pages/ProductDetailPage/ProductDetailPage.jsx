import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Container,
  Box,
  Typography,
  Rating,
  Button,
  Tabs,
  Tab,
  Alert,
  Grid,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import ReviewItem from "../../components/ReviewItem/ReviewItem";
import AddReviewDialog from "../../components/AddReviewDialog/AddReviewDialog";
import Loader from "../../components/Loader/Loader";
import { GET_PRODUCT_BY_SLUG, GET_PRODUCT_REVIEWS } from "../../graphql/queries/queries";
import { ADD_PRODUCT_REVIEW } from "../../graphql/mutations/login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Carousel from "../../components/Carousel/Carousel";
import "./ProductDetailPage.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage = () => {
  const { slug } = useParams({ from: "/product/$slug" });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);


  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);


  const { data: productData, loading: productLoading, error: productError } = useQuery(
    GET_PRODUCT_BY_SLUG,
    {
      variables: { slug },
      skip: !isAuthenticated
    }
  );

  const product = productData?.getProductBySlug;

  const { data: reviewsData, loading: reviewsLoading, refetch: refetchReviews } = useQuery(
    GET_PRODUCT_REVIEWS,
    {
      variables: { productId: product?.id },
      skip: !isAuthenticated || !product?.id
    }
  );


  const [addReview, { loading: addingReview }] = useMutation(ADD_PRODUCT_REVIEW, {
    onCompleted: () => {
      setReviewDialogOpen(false);
      refetchReviews();
    }
  });

  const reviews = reviewsData?.getProductReviews?.reviewList || [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddReview = async (formData) => {
    if (!product) return;

    try {
      await addReview({
        variables: {
          payload: {
            product: product.id,
            review: formData.comment,
            rating: formData.rating,
            isImages: formData.images ? true : false,
            media: formData.images ? formData.images.map(img => ({
              secure_url: img
            })) : []
          }
        }
      });
    } catch (error) {
      throw error;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (productError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error loading product: {productError.message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate({ to: "/products" })}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      {productLoading ? (
        <Loader message="Loading product details..." />
      ) : !product ? (
        <Typography variant="h6" color="error">Product not found</Typography>
      ) : (
        <Grid container spacing={4}>

          <Grid item xs={12} md={6}>
            <Carousel 
              images={product.images?.map(img => img.secure_url) || []} 
              video={product.video?.secure_url} 
            />
          </Grid>


          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              {product.title}
            </Typography>

            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {product.currency}{product.price}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Rating value={product.averageRating} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {product.averageRating} ({product.totalReviews} reviews)
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Brand:</strong> {product.brand || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {product.category || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Stock:</strong> {product.inStock ? "In Stock" : "Out of Stock"} ({product.quantityRemaining} available)
              </Typography>
              <Typography variant="body2">
                <strong>Seller:</strong> {product.shop?.owner || "N/A"}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </Grid>
        </Grid>
      )}

      {product && (
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product tabs"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Description" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Reviews" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>


          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </Typography>
            <Box sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Product Details
              </Typography>
              <Typography variant="body2">• Premium quality materials</Typography>
              <Typography variant="body2">• Durable construction</Typography>
              <Typography variant="body2">• Backed by manufacturer warranty</Typography>
              <Typography variant="body2">• Free shipping on orders over $50</Typography>
            </Box>
          </TabPanel>


          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">
                Customer Reviews ({reviews.length})
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setReviewDialogOpen(true)}
              >
                Add Review
              </Button>
            </Box>

            {reviewsLoading ? (
              <Loader message="Loading reviews..." />
            ) : reviews.length === 0 ? (
              <Alert severity="info">
                No reviews yet. Be the first to share your experience!
              </Alert>
            ) : (
              <Box>
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </Box>
            )}

            <AddReviewDialog
              open={reviewDialogOpen}
              onClose={() => setReviewDialogOpen(false)}
              onSubmit={handleAddReview}
              loading={addingReview}
            />
          </TabPanel>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;