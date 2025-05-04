import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const login = (token, user) => {
    setUserToken(token);
    setUserData(user);
  };

  const logout = () => {
    setUserToken(null);
    setUserData(null);
  };


  return (
    <AuthContext.Provider value={{ userToken,  userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};