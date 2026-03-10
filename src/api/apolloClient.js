import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SchemaLink } from "@apollo/client/link/schema";
import { buildSchema } from "graphql";
import { addMocksToSchema } from "@graphql-tools/mock";
import { typeDefs, resolvers } from "../graphql/index.js";

const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    return null;
  }
};

const schema = buildSchema(typeDefs);
const schemaWithResolvers = addMocksToSchema({
  schema,
  resolvers
});

const schemaLink = new SchemaLink({ 
  schema: schemaWithResolvers,
  context: () => {
    const token = localStorage.getItem("token");
    const user = token ? decodeToken(token) : null;
    return { user };
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(schemaLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
});

export default client;