import { useState, useRef } from 'react';
import { useMusicStore } from '../../../../store/useMusicStore';

export const useGalleryPhysics = (containerRef: React.RefObject<HTMLDivElement>) => {
  const { playlist, currentTrackIndex, playTrack } = useMusicStore();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0); // 🔥 Naya: Y tracking for vertical swipes
  const isVerticalSwipe = useRef(false); // 🔥 Naya: Lock for vertical swipes

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
    touchStartY.current = e.touches[0].clientY;
    isVerticalSwipe.current = false;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isVerticalSwipe.current) return; // Agar upar swipe ho raha hai, toh left-right rok do

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    // 🔥 SMART LOCK: Agar user X se zyada Y axis pe move kar raha hai, matlab swipe up/down hai!
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      isVerticalSwipe.current = true;
      setIsDragging(false);
      return;
    }

    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (isVerticalSwipe.current) return; // Vertical tha toh snap mat karo
    handleGestureEnd(dragOffset);
  };

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
    
    // 🔥 Smoother scaling formula
    const scale = Math.max(0.75, 1 - Math.abs(pos) * 0.12);
    const opacity = Math.max(0, 1 - Math.abs(pos) * 0.6);
    const xTranslate = pos * width;
    const zIndex = 30 - Math.abs(Math.round(pos * 10));
    
    return {
      transform: `translate3d(${xTranslate}px, 0, 0) scale(${scale})`, // translate3d forces GPU hardware acceleration
      opacity,
      zIndex,
      pointerEvents: Math.abs(pos) < 0.5 ? 'auto' : 'none' as any,
      transition: isDragging ? 'none' : `transform ${ANIM_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${ANIM_DURATION}ms ease-out`
    };
  };

  return { dragOffset, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel, snapToTarget, getCardStyle };
};