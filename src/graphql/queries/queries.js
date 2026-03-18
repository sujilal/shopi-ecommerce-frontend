import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts(filters: { query: null }) {
      products {
        id
        views
        category
        currency
        approved
        slug
        title
        images {
          secure_url
        }
        stockCount
        quantityRemaining
        inStock
        live
        featured
        showStock
        video {
          secure_url
        }
        type
        brand
        color
        description
        price
        negotiable
        isAddedToFavs
        averageRating
        totalReviews
        percentageDiscount
        attributes
        createdAt
      }
    }
  }
`;

export const GET_LANDING_PRODUCTS = gql`
  query GetLandingProducts($cursor: String) {
    getLandingProducts(cursor: $cursor) {
      products {
        id
        title
        slug
        price
        rating
        reviews
        image
        images
        description
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchHomeProducts($search: String!) {
    searchHomeProducts(search: $search) {
      id
      views
      category
      currency
      approved
      slug
      title
      images {
        secure_url
      }
      stockCount
      quantityRemaining
      inStock
      live
      featured
      showStock
      video {
        secure_url
      }
      type
      brand
      color
      description
      price
      negotiable
      isAddedToFavs
      averageRating
      totalReviews
      percentageDiscount
      attributes
      createdAt
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    getProductBySlug(slug: $slug) {
      id
      views
      category
      shop {
        owner
      }
      currency
      approved
      title
      stockCount
      quantityRemaining
      inStock
      live
      featured
      showStock
      images {
        secure_url
      }
      video {
        secure_url
      }
      type
      brand
      color
      description
      price
      negotiable
      slug
      isAddedToFavs
      averageRating
      totalReviews
      percentageDiscount
      attributes
      isAddedToFav
      createdAt
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    getProductReviews(productId: $productId) {
      reviewList {
        isImages
        id
        user {
          displayName
          image
        }
        rating
        review
        likes {
          displayName
          lastMessage {
            content
          }
        }
      }
    }
  }
`;