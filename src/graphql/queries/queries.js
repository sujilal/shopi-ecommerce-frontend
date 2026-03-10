import { gql } from "@apollo/client";

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
  query SearchProducts($keyword: String!) {
    searchHomeProducts(keyword: $keyword) {
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
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    getProductBySlug(slug: $slug) {
      id
      title
      slug
      price
      rating
      reviews
      image
      images
      video
      description
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($slug: String!, $cursor: String) {
    getProductReviews(slug: $slug, cursor: $cursor) {
      reviews {
        id
        author
        rating
        comment
        date
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;