import React from 'react';

interface TaskIconProps {
  emoji: string;
  size?: number;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ emoji, size = 36 }) => {
  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-lg select-none"
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
};
