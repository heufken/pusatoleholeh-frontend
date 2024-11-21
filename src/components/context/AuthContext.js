import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken"); 
    setToken(authToken); 

    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken); 
        setUser(decodedToken); 
        setIsAuthenticated(true); 
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
        setUser(null); 
      }
    } else {
      setIsAuthenticated(false);
      setUser(null); 
    }

    setIsLoading(false); 
  }, []);

  const login = (authToken) => {
    Cookies.set("authToken", authToken); 
    setToken(authToken); 
    try {
      const decoded = jwtDecode(authToken);
      setUser(decoded); 
      setIsAuthenticated(true); 
    } catch (error) {
      console.error("Error decoding token during login:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    Cookies.remove("authToken"); 
    setToken(null); 
    setIsAuthenticated(false); 
    setUser(null); 
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token, 
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
