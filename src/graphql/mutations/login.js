import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!, $name: String!) {
    createUser(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const ADD_PRODUCT_REVIEW = gql`
  mutation AddProductReview($product: ID!, $review: String!, $rating: Int!, $isImages: Boolean) {
    addProductReview(product: $product, review: $review, rating: $rating, isImages: $isImages) {
      id
      author
      rating
      comment
      date
    }
  }
`;