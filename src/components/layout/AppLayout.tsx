
import React from 'react';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  bottomNavTab: string;
  onBottomNavChange: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  onBackClick,
  onSettingsClick,
  bottomNavTab,
  onBottomNavChange
}) => {
  return (
    <div className="w-full max-w-[100vw] bg-black min-h-screen relative mx-auto font-['Urbanist'] overflow-x-hidden overflow-y-auto" style={{
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 76px)'
    }}>
      <Header 
        title={title} 
        onBackClick={onBackClick} 
        onSettingsClick={onSettingsClick} 
      />
      
      {children}
      
      <BottomNavigation 
        activeTab={bottomNavTab} 
        onTabChange={onBottomNavChange} 
      />
    </div>
  );
};
