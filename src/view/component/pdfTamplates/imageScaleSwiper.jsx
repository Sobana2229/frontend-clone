import { useState, useRef, useEffect } from 'react';
import { ArrowCounterClockwise } from "@phosphor-icons/react";

const ImageScaleSwiper = ({ onScaleChange, logoScale }) => {
  const [currentScale, setCurrentScale] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  
  const scaleOptions = [
    { value: 0.5, size: 'w-8 h-8' },
    { value: 0.75, size: 'w-12 h-12' },
    { value: 1, size: 'w-[76px] h-16' },
    { value: 1.25, size: 'w-22 h-20' },
    { value: 1.5, size: 'w-28 h-24' }
  ];

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const index = scaleOptions.findIndex(opt => opt.value === logoScale?.value);
    if (index !== -1 && index !== currentScale) {
      setCurrentScale(index);
    }
  }, [logoScale]);

  const getThumbPosition = () => {
    return (currentScale / (scaleOptions.length - 1)) * 100;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateScale(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateScale(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateScale(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateScale(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateScale = (event) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const scaleIndex = Math.round((percentage / 100) * (scaleOptions.length - 1));
    
    if (scaleIndex !== currentScale) {
      setCurrentScale(scaleIndex);
      onScaleChange?.(scaleOptions[scaleIndex]);
    }
  };

  const handleReset = () => {
    setCurrentScale(2);
    onScaleChange?.(scaleOptions[2]);
  };

  return (
    <div className="w-full">
      {/* Resize Controls */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">RESIZE</span>
          <button
            onClick={handleReset}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Reset to default size"
          >
            <ArrowCounterClockwise />
          </button>
        </div>
        
        {/* Custom Slider Track */}
        <div 
          ref={trackRef}
          className="relative w-full h-1 bg-gray-200 rounded-full cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Active track */}
          <div 
            className="absolute h-full bg-blue-500 rounded-full transition-all duration-150"
            style={{ width: `${getThumbPosition()}%` }}
          />
          
          {/* Scale markers */}
          {scaleOptions.map((_, index) => (
            <div
              key={index}
              className="absolute top-1/2 w-1 h-1 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 border border-gray-300"
              style={{ left: `${(index / (scaleOptions.length - 1)) * 100}%` }}
            />
          ))}
          
          {/* Draggable thumb */}
          <div
            ref={sliderRef}
            className={`absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab shadow-md transition-all duration-150 ${
              isDragging ? 'cursor-grabbing scale-110 shadow-lg' : 'hover:scale-105'
            }`}
            style={{ left: `${getThumbPosition()}%` }}
          />
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between mt-2 px-1">
          {scaleOptions.map((option, index) => (
            <span
              key={index}
              className={`text-xs transition-colors ${
                index === currentScale ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageScaleSwiper;