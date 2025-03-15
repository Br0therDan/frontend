// src/context/AppContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';

interface AppType {
  name: string;
  path: string;
  plan?: string;
  logo?: React.ElementType;
}

interface AppContextType {
  activeApp: AppType;
  setActiveApp: React.Dispatch<React.SetStateAction<AppType>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // 초기값은 필요에 따라 설정하세요.
  const [activeApp, setActiveApp] = useState<AppType>({ name: 'Quant', path: 'quant' });

  return (
    <AppContext.Provider value={{ activeApp, setActiveApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
