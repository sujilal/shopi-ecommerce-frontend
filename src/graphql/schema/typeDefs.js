const typeDefs = `
  type Query {
    getLandingProducts(cursor: String): ProductConnection!
    searchHomeProducts(keyword: String!): [Product!]!
    getProductBySlug(slug: String!): Product
    getProductReviews(slug: String!, cursor: String): ReviewConnection!
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    createUser(email: String!, password: String!, name: String!): AuthResponse!
    addProductReview(product: ID!, review: String!, rating: Int!, isImages: Boolean): Review!
  }

  type Product {
    id: ID!
    slug: String!
    title: String!
    price: Float!
    rating: Float!
    reviews: Int!
    image: String!
    images: [String!]!
    video: String
    description: String!
  }

  type ProductConnection {
    products: [Product!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Review {
    id: ID!
    author: String!
    rating: Int!
    comment: String!
    date: String!
  }

  type ReviewConnection {
    reviews: [Review!]!
    pageInfo: PageInfo!
  }

  type User {
    id: ID!
    email: String!
    name: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }
`;

export default typeDefs;
