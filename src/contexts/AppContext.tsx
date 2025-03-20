"use client";
import { AppPublic } from '@/client/iam';
import { AppsService } from '@/lib/api';
import { handleApiError } from '@/lib/errorHandler';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface AppContextType {
  apps: AppPublic[];
  loading: boolean;
  fetchApps: () => Promise<void>;
  activeApp: AppPublic | undefined;
  setActiveApp: React.Dispatch<React.SetStateAction<AppPublic | undefined>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [apps, setApps] = useState<AppPublic[]>([])
  const [activeApp, setActiveApp] = useState<AppPublic | undefined>(undefined);

  // ✅ fetchApps 로 API 호출하여 apps 상태 업데이트
  const fetchApps = async () => {
    setLoading(true)
    try {
      const response = await AppsService.appsReadApps()
      setApps(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchApps()
  }, [])

  // 컴포넌트 마운트 쿠키에 저장된 activeApp 값을 불러와 activeApp 상태 업데이트
  useEffect(() => {
    const stored = Cookies.get('activeApp');
    if (stored) {
      try {
        const activeApp: AppPublic = JSON.parse(stored);
        setActiveApp(activeApp); 
      } catch (error) {
        console.error("Error parsing stored activeApp", error);
      }
    }}, []);
    
  return (
    <AppContext.Provider value={{ 
      apps,
      loading,
      fetchApps,
      activeApp, 
      setActiveApp 
      }}
    >
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



// useEffect(() => {
  //   const stored = localStorage.getItem('activeApp');
  //   if (stored) {
  //     try {
  //       // logo는 저장할 수 없으므로 직렬화 가능한 값만 불러옴
  //       const parsed: Omit<AppPublic, 'logo'> = JSON.parse(stored);
  //       // 필요에 따라 앱 이름에 따른 logo 매핑 (여기서는 Quant만 처리)
  //       let logo = activeApp?.logo;
  //       if (parsed.name === 'Quant') {
  //         logo = SquareTerminal;
  //       }
  //       setActiveApp({ ...parsed, logo: logo || SquareTerminal });
  //     } catch (error) {
  //       console.error("Error parsing stored activeApp", error);
  //     }
  //   }
  // }, []);