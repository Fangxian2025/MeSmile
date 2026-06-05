import React from 'react';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export function MeSmileWordmark({ ...props }: Props) {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Smiley */}
      <circle cx="12" cy="12" r="10" fill="#FFD700"/>
      <circle cx="8" cy="10" r="1.5" fill="#333"/>
      <circle cx="16" cy="10" r="1.5" fill="#333"/>
      <path d="M7 14 Q12 18 17 14" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Text: MeSmile */}
      <text x="28" y="16" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#333">MeSmile</text>
    </svg>
  );
}
