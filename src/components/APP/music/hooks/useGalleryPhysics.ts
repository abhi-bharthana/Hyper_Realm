import { useState, useRef } from 'react';
import { useMusicStore } from '../../../../store/useMusicStore';

export const useGalleryPhysics = (containerRef: React.RefObject<HTMLDivElement>) => {
  const { playlist, currentTrackIndex, playTrack } = useMusicStore();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const touchStartX = useRef(0);
  const wheelOffset = useRef(0);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);

  const ANIM_DURATION = 400;
  const validIndex = currentTrackIndex !== null ? currentTrackIndex : 0;

  const snapToTarget = (targetPercent: number) => {
    const width = containerRef.current?.offsetWidth || 500;
    setIsDragging(false);
    setDragOffset(targetPercent * width);

    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      if (targetPercent !== 0 && playlist.length > 0) {
        setIsDragging(true);
        setDragOffset(0);

        let jumpedTracks = -targetPercent;
        let newIndex = (validIndex + jumpedTracks) % playlist.length;
        if (newIndex < 0) newIndex += playlist.length;

        playTrack(newIndex);
        setTimeout(() => setIsDragging(false), 20);
      }
    }, ANIM_DURATION);
  };

  const handleGestureEnd = (finalOffset: number) => {
    const width = containerRef.current?.offsetWidth || 500;
    const targetPercent = Math.round(finalOffset / width);
    snapToTarget(targetPercent);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setDragOffset(e.touches[0].clientX - touchStartX.current);
  };

  const handleTouchEnd = () => handleGestureEnd(dragOffset);

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; 
    
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    setIsDragging(true);
    wheelOffset.current -= e.deltaX;
    setDragOffset(wheelOffset.current);

    if (dragTimeout.current) clearTimeout(dragTimeout.current);
    dragTimeout.current = setTimeout(() => {
      handleGestureEnd(wheelOffset.current);
      wheelOffset.current = 0;
    }, 150);
  };

  const getCardStyle = (offsetIndex: number) => {
    const width = containerRef.current?.offsetWidth || 500;
    const percent = dragOffset / width;
    const pos = offsetIndex + percent; 

    const scale = Math.max(0.7, 1 - Math.abs(pos) * 0.15);
    const opacity = Math.max(0, 1 - Math.abs(pos) * 0.55);
    const xTranslate = pos * width;
    const zIndex = 30 - Math.abs(Math.round(pos * 10));

    return {
      transform: `translateX(${xTranslate}px) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: Math.abs(pos) < 0.5 ? 'auto' : 'none' as any,
      transition: isDragging ? 'none' : `all ${ANIM_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
    };
  };

  return { dragOffset, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, snapToTarget, getCardStyle };
};