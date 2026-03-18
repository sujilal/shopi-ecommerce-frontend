import { getCurrentToken } from "../utils/tokenStore";

export const isAuthenticated = () => {
  return !!getCurrentToken();
};

export const publicGuard = async ({ context, location }) => {
  if (isAuthenticated()) {
    throw new Error("AUTHENTICATED_REDIRECT");
  }
};

export const protectedGuard = async ({ context, location }) => {
  if (!isAuthenticated()) {
    throw new Error("UNAUTHENTICATED_REDIRECT");
  }
};
