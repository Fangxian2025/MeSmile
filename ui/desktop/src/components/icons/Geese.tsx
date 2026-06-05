import React from 'react';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export function Geese({ ...props }: Props) {
  return (
    <svg
      width="35"
      height="37"
      viewBox="0 0 35 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect y="0.5" width="35" height="36" rx="14" fill="url(#paint0_linear_4363_9473)" />
      {/* MeSmile mini smiley face */}
      <circle cx="17.5" cy="18.5" r="9" fill="white"/>
      <circle cx="14" cy="16" r="2" fill="url(#paint0_linear_4363_9473)"/>
      <circle cx="21" cy="16" r="2" fill="url(#paint0_linear_4363_9473)"/>
      <path d="M12 21 Q17.5 26 23 21" stroke="url(#paint0_linear_4363_9473)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <defs>
        <linearGradient id="paint0_linear_4363_9473" x1="0" y1="0" x2="35" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700"/>
          <stop offset="1" stopColor="#FFA500"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
