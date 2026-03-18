import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      authToken
      user {
        id
        email
        displayName
      }
    }
  }
`;

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      authToken
      user {
        email
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($payload: CreateUserPayload!) {
    createUser(payload: $payload) {
      accessToken
      authToken
      user {
        displayName
        email
        emailVerified
        sex
        tileDisplay
      }
    }
  }
`;

export const ADD_PRODUCT_REVIEW = gql`
  mutation AddProductReview($payload: ProductReviewsPayload!) {
    addProductReview(payload: $payload) {
      id
      review
      product {
        id
      }
      user {
        displayName
        image
      }
      rating
      likes {
        image
        lastMessage {
          content
        }
      }
      dislikes {
        lastMessage {
          content
        }
      }
      media {
        secure_url
      }
      isImages
      createdAt
      updatedAt
    }
  }
`;