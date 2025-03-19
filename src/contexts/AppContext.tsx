"use client";
import { AppPublic } from '@/client/iam';
import { AppType } from '@/components/admin/app-switcher';
import { AppsService } from '@/lib/api';
import { handleApiError } from '@/lib/errorHandler';
import { SquareTerminal } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';


interface AppContextType {
  apps: AppPublic[];
  loading: boolean;
  fetchApps: () => Promise<void>;
  activeApp: AppType | undefined;
  setActiveApp: React.Dispatch<React.SetStateAction<AppType | undefined>>;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeApp, setActiveApp] = useState<AppType | undefined>(undefined);
  const [apps, setApps] = useState<AppPublic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // ✅ fetchApps 함수 분리
  const fetchApps = async () => {
    setLoading(true)
    try {
      const response = await AppsService.appsReadApps()
      setApps(response.data)
      const app = response.data[0];
      setActiveApp({
        ...app,
        logo: app.logo || undefined,
      } as AppType);
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

  // 컴포넌트 마운트 시 로컬 스토리지에서 activeApp 값을 불러옴
  useEffect(() => {
    const stored = localStorage.getItem('activeApp');
    if (stored) {
      try {
        // logo는 저장할 수 없으므로 직렬화 가능한 값만 불러옴
        const parsed: Omit<AppType, 'logo'> = JSON.parse(stored);
        // 필요에 따라 앱 이름에 따른 logo 매핑 (여기서는 Quant만 처리)
        let logo = activeApp?.logo;
        if (parsed.name === 'Quant') {
          logo = SquareTerminal;
        }
        setActiveApp({ ...parsed, logo: logo || SquareTerminal });
      } catch (error) {
        console.error("Error parsing stored activeApp", error);
      }
    }
  }, []);

  // activeApp 값이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (activeApp) {
      const { name, description } = activeApp;
      localStorage.setItem('activeApp', JSON.stringify({ name, description }));
    }
  }, [activeApp]);

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
