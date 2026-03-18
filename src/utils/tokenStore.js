let currentToken = null;

export const setCurrentToken = (token) => {
  currentToken = token;
};

export const getCurrentToken = () => {
  return currentToken;
};

export const clearCurrentToken = () => {
  currentToken = null;
};
