import React, { createContext, useState } from 'react';

export const NotesRefreshContext = createContext();

export const NotesRefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState('none');
  const [searchMode, setSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

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
    <NotesRefreshContext.Provider
      value={{ refresh, toggleRefresh, setRefresh, sort, sortRefresh, searchMode, setSearchMode, searchResult, setSearchResult }}
    >
      {children}
    </NotesRefreshContext.Provider>
  );
};
