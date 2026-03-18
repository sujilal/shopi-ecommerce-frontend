import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCurrentToken } from "../utils/tokenStore";

const httpLink = new HttpLink({
  uri: "https://gql-shopping-sample.onrender.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = getCurrentToken();
  return {
    headers: {
      ...headers,
      authorization: token || ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
});

export default client;