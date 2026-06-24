import React from 'react';

interface BatteryIconProps {
  percentage: number;
  size?: number;
  className?: string;
}

export const BatteryIcon: React.FC<BatteryIconProps> = ({ percentage, size = 12, className = '' }) => {
  // Constrain percentage between 0 and 100
  const val = Math.max(0, Math.min(100, percentage));
  
  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      style={{ height: `${size * 0.7}px`, width: `${size * 1.3}px` }}
    >
      {/* Battery body */}
      <div className="relative flex-1 h-full rounded-[2px] border border-white p-[0.75px] flex items-center bg-transparent">
        {/* Fill bar */}
        <div 
          className="h-full rounded-[0.5px] bg-current transition-all duration-300"
          style={{ width: `${val}%` }}
        />
      </div>
      {/* Battery terminal/tip */}
      <div className="w-[1px] h-[30%] rounded-r-[0.5px] bg-white -ml-[0.25px]" />
    </div>
  );
};
