import React from 'react';

interface KeyboardHintProps {
  keys: string[];
  label?: string;
}

export const KeyboardHint: React.FC<KeyboardHintProps> = ({ keys, label }) => {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
      {label && <span>{label}</span>}
      {keys.map((key, idx) => (
        <kbd
          key={idx}
          className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px] leading-none"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
};
