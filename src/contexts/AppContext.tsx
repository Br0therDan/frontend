"use client";
import { AppType } from '@/components/admin/app-switcher';
import { capitalizeFirstLetter } from '@/utils/formatName';
import { SquareTerminal } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';


interface AppContextType {
  activeApp: AppType;
  setActiveApp: React.Dispatch<React.SetStateAction<AppType>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 기본값 정의 (기본 앱은 Quant)
const defaultApp: AppType = { name: `${capitalizeFirstLetter("quant")}`, logo: SquareTerminal };

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeApp, setActiveApp] = useState<AppType>(defaultApp);

  // 컴포넌트 마운트 시 로컬 스토리지에서 activeApp 값을 불러옴
  useEffect(() => {
    const stored = localStorage.getItem('activeApp');
    if (stored) {
      try {
        // logo는 저장할 수 없으므로 직렬화 가능한 값만 불러옴
        const parsed: Omit<AppType, 'logo'> = JSON.parse(stored);
        // 필요에 따라 앱 이름에 따른 logo 매핑 (여기서는 Quant만 처리)
        let logo = defaultApp.logo;
        if (parsed.name === 'Quant') {
          logo = SquareTerminal;
        }
        setActiveApp({ ...parsed, logo });
      } catch (error) {
        console.error("Error parsing stored activeApp", error);
      }
    }
  }, []);

  // activeApp 값이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    const { name, description } = activeApp;
    localStorage.setItem('activeApp', JSON.stringify({ name, description }));
  }, [activeApp]);

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
