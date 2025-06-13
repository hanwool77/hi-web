import React, { createContext, useContext, useState } from 'react';

const SelectedStoreContext = createContext();

export const useSelectedStore = () => {
  const context = useContext(SelectedStoreContext);
  if (!context) {
    throw new Error('useSelectedStore must be used within a SelectedStoreProvider');
  }
  return context;
};

export const SelectedStoreProvider = ({ children }) => {
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  return (
    <SelectedStoreContext.Provider value={{ selectedStoreId, setSelectedStoreId }}>
      {children}
    </SelectedStoreContext.Provider>
  );
};
