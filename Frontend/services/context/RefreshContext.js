import React, { createContext, useState } from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <RefreshContext.Provider value={{ refresh, toggleRefresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
