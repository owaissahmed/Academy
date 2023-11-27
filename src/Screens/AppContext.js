// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(null);

  return (
    <AppContext.Provider value={{ showAlert, setShowAlert }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
