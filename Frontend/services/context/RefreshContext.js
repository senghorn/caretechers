import React, { createContext, useState } from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState('none');

  /**
   * Toggles the refreshing context
   */
  const toggleRefresh = () => {
    setRefresh(!refresh);
  };

  /**
   * Sets the sort context to the type of sorting value given
   * @param {string} value
   */
  const sortRefresh = (value) => {
    setSort(value);
  };

  return (
    <RefreshContext.Provider
      value={{ refresh, toggleRefresh, setRefresh, sort, sortRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
};