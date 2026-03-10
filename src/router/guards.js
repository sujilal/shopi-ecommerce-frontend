export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
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
