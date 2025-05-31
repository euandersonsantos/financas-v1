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
  const navItems = [{
    id: 'home',
    icon: HomeIcon,
    label: 'Início'
  }, {
    id: 'finance',
    icon: DollarIcon,
    label: 'Financeiro'
  }, {
    id: 'documents',
    icon: DocumentActiveIcon,
    label: 'Documentos'
  }, {
    id: 'reports',
    icon: ChartIcon,
    label: 'Relatórios'
  }, {
    id: 'menu',
    icon: MenuIcon,
    label: 'Menu'
  }];
  return <nav className="fixed w-full h-[82px] left-0 bottom-0 z-50">
      <div className="w-full h-full bg-white shadow-[0px_-5px_18px_0px_rgba(0,0,0,0.06)] backdrop-blur-[2px] rounded-[10px_10px_0px_0px]" />
      <div className="absolute inset-0 flex items-center justify-center px-4 py-0 my-0">
        <div className="flex items-center justify-between w-full max-w-sm">
          {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return <button key={item.id} onClick={() => onTabChange(item.id)} aria-label={item.label} className="flex flex-col items-center justify-center w-12 h-12 p-2">
                <IconComponent className={`w-8 h-8 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
              </button>;
        })}
        </div>
      </div>
    </nav>;
};