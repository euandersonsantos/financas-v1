

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
  return <div className="w-full bg-black fixed top-0 left-0 right-0 z-50">
      {/* Safe area superior com fundo preto garantido */}
      <div className="w-full bg-black" style={{
      height: 'env(safe-area-inset-top, 0px)',
      minHeight: '0px',
      backgroundColor: '#000000'
    }} />
      
      <header className="w-full bg-black relative border-b border-[rgba(255,255,255,0.16)]" style={{
      paddingTop: '6px',
      backgroundColor: '#000000'
    }}>
        <div className="flex justify-center items-center w-full h-[60px] relative px-[24px]">
          <button onClick={onBackClick} className="w-6 h-6 flex-shrink-0 z-10 flex items-center justify-center absolute left-[21px] max-sm:left-[15px]" aria-label="Voltar">
            <ArrowLeftIcon />
          </button>
          
          <h1 className="text-white text-lg font-bold tracking-normal max-sm:text-base">
            {title}
          </h1>
          
          <button onClick={onSettingsClick} className="w-6 h-6 flex-shrink-0 z-10 flex items-center justify-center absolute right-[21px] max-sm:right-[15px]" aria-label="Configurações">
            <SettingsIcon />
          </button>
        </div>
      </header>
    </div>;
};

