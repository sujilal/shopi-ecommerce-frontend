import { MOCK_PRODUCTS } from "../mocks/products.js";
import { MOCK_REVIEWS } from "../mocks/reviews.js";

export const queryResolvers = {
  getLandingProducts: (_, { cursor }) => {
    return {
      products: MOCK_PRODUCTS,
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    };
  },

  searchHomeProducts: (_, { keyword }) => {
    return MOCK_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) ||
      p.description.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  getProductBySlug: (_, { slug }) => {
    return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
  },

  getProductReviews: (_, { slug }) => {
    const reviews = MOCK_REVIEWS[slug] || [];
    return {
      reviews,
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    };
  }
};
