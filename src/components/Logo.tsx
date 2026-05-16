import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect x="40" y="40" width="432" height="432" rx="85" fill="#6B4A35"/>
      <path d="M256 135L125 192L256 249L387 192L256 135Z" fill="#F8F4EE"/>
      <path d="M168 225C168 225 168 273 168 294C186 294 209 304 230 323C238 330 247 336 256 342V281L168 225Z" fill="#F8F4EE"/>
      <path d="M344 225C344 225 344 273 344 294C326 294 303 304 282 323C274 330 265 336 256 342V281L344 225Z" fill="#F8F4EE"/>
      <path d="M365 194V285" stroke="#F8F4EE" strokeWidth="10" strokeLinecap="round"/>
      <rect x="356" y="284" width="18" height="36" rx="8" fill="#F8F4EE"/>
      <path d="M185 308C210 308 233 319 256 340C279 319 302 308 327 308" stroke="#F8F4EE" strokeWidth="16" strokeLinecap="round"/>
    </svg>
  );
}
