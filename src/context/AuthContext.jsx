import { createContext, useState } from "react";
import { encryptToken, decryptToken } from "../utils/encryption";
import { setCurrentToken, clearCurrentToken } from "../utils/tokenStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [encryptedToken, setEncryptedToken] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = (userData, authToken) => {
    const encrypted = encryptToken(authToken);
    setEncryptedToken(encrypted);
    setUser(userData);
    setError(null);
    setCurrentToken(authToken);
  };

  const register = (userData, authToken) => {
    const encrypted = encryptToken(authToken);
    setEncryptedToken(encrypted);
    setUser(userData);
    setError(null);
    setCurrentToken(authToken);
  };

  const logout = () => {
    setEncryptedToken(null);
    setUser(null);
    clearCurrentToken();
  };

  const getToken = () => {
    return encryptedToken ? decryptToken(encryptedToken) : null;
  };

  const isAuthenticated = !!encryptedToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        encryptedToken,
        token: getToken(),
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        setError,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};