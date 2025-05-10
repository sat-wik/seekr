import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReelContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const ReelContext = createContext<ReelContextType | undefined>(undefined);

export const ReelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ReelContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </ReelContext.Provider>
  );
};

export const useReelContext = () => {
  const context = useContext(ReelContext);
  if (context === undefined) {
    throw new Error('useReelContext must be used within a ReelProvider');
  }
  return context;
};
