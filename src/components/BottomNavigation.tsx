import React from 'react';
import { HomeIcon, DollarIcon, DocumentActiveIcon, ChartIcon, MenuIcon } from './icons';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Início' },
    { id: 'finance', icon: DollarIcon, label: 'Financeiro' },
    { id: 'documents', icon: DocumentActiveIcon, label: 'Documentos' },
    { id: 'reports', icon: ChartIcon, label: 'Relatórios' },
    { id: 'menu', icon: MenuIcon, label: 'Menu' }
  ];

  return (
    <nav className="absolute w-full h-[82px] left-0 bottom-0">
      <div className="w-full h-full bg-white shadow-[0px_-5px_18px_0px_rgba(0,0,0,0.06)] backdrop-blur-[2px] rounded-[10px_10px_0px_0px]" />
      <div className="inline-flex items-center gap-[43px] absolute left-[35px] top-[24px] w-[332px] h-[32px] max-sm:gap-[30px] max-sm:left-[20px] max-sm:w-[calc(100%-40px)]">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center w-8 h-8"
              aria-label={item.label}
            >
              <IconComponent className={`w-8 h-8 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
