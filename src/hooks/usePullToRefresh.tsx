
import { useState, useEffect, useRef } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
}

export const usePullToRefresh = ({ 
  onRefresh, 
  threshold = 80, 
  resistance = 2.5 
}: UsePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canPull, setCanPull] = useState(false);
  const touchStartY = useRef(0);
  const scrollableRef = useRef<HTMLElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (scrollableRef.current && scrollableRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!canPull || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 0) {
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);
      
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setCanPull(false);
  };

  useEffect(() => {
    const element = scrollableRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canPull, isRefreshing, pullDistance, threshold]);

  return {
    scrollableRef,
    isRefreshing,
    pullDistance,
    shouldShowIndicator: pullDistance > 20 || isRefreshing
  };
};
