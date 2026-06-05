import React from 'react';

type Props = React.ComponentPropsWithoutRef<'svg'>;

export function MeSmile({ ...props }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill="#FFD700"/>
      <circle cx="8" cy="9" r="2" fill="#333"/>
      <circle cx="16" cy="9" r="2" fill="#333"/>
      <path d="M7 15 Q12 20 17 15" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
