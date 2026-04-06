import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, animated = true }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty('--progress-width', `${value}%`);
    }
  }, [value]);

  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        ref={barRef}
        style={{ width: `${value}%`, '--progress-width': `${value}%` } as React.CSSProperties}
        className={`h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] transition-all duration-700 ease-out ${animated ? 'animate-pulse-dot' : ''}`}
      />
    </div>
  );
};
