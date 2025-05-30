
import React from 'react';
import { ArrowLeftIcon, SettingsIcon } from './icons';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBackClick, 
  onSettingsClick 
}) => {
  return (
    <header className="w-full h-[116px] bg-black relative border-b border-[rgba(255,255,255,0.16)] safe-area-inset-top">
      <div className="flex justify-between items-center absolute w-full px-[21px] h-6 top-[61px] max-sm:px-[15px]">
        <button 
          onClick={onBackClick}
          className="w-6 h-6 flex-shrink-0 z-10"
          aria-label="Voltar"
        >
          <ArrowLeftIcon />
        </button>
        
        <h1 className="text-white text-lg font-bold tracking-normal max-sm:text-base flex-1 text-center">
          {title}
        </h1>
        
        <button 
          onClick={onSettingsClick}
          className="w-6 h-6 flex-shrink-0 z-10"
          aria-label="Configurações"
        >
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};
