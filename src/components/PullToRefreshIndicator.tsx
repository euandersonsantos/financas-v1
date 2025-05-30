
import React from 'react';
import { ArrowDown } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  isVisible: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  threshold?: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  isVisible,
  isRefreshing,
  pullDistance,
  threshold = 80
}) => {
  if (!isVisible) return null;

  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center bg-black/90 backdrop-blur-sm transition-all duration-200"
      style={{
        height: Math.min(pullDistance + 20, 100),
        opacity: isVisible ? 1 : 0,
        paddingTop: 'env(safe-area-inset-top, 20px)'
      }}
    >
      <div className="flex flex-col items-center gap-2 text-white">
        {isRefreshing ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <ArrowDown 
            className="w-6 h-6 transition-transform duration-200" 
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
        <span className="text-xs font-medium">
          {isRefreshing ? 'Atualizando...' : pullDistance >= threshold ? 'Solte para atualizar' : 'Puxe para atualizar'}
        </span>
      </div>
    </div>
  );
};
