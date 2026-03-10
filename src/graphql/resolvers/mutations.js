import { MOCK_PRODUCTS } from "../mocks/products.js";
import { MOCK_USERS } from "../mocks/users.js";
import { MOCK_REVIEWS } from "../mocks/reviews.js";
import { generateToken } from "../mocks/utils.js";

export const mutationResolvers = {
  login: (_, { email, password }) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return {
      token: generateToken(user.id, user.email, user.name),
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  },

  createUser: (_, { email, password, name }) => {
    const userExists = MOCK_USERS.find(u => u.email === email);
    if (userExists) {
      throw new Error("User already exists");
    }
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email,
      password,
      name
    };
    MOCK_USERS.push(newUser);
    return {
      token: generateToken(newUser.id, newUser.email, newUser.name),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    };
  },

  addProductReview: (_, { product, review, rating }, { user }) => {
    const productSlug = MOCK_PRODUCTS.find(p => p.id === product)?.slug;
    const newReview = {
      id: `r${Date.now()}`,
      author: user?.name || "Anonymous",
      rating,
      comment: review,
      date: new Date().toISOString().split('T')[0]
    };
    if (productSlug && MOCK_REVIEWS[productSlug]) {
      MOCK_REVIEWS[productSlug].push(newReview);
    }
    return newReview;
  }
};
