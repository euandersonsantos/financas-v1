
import React from 'react';

export const MainBackground: React.FC = () => {
  return (
    <main className="w-full h-[1400px] relative">
      <div className="w-full h-full relative">
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 402 1400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 28.3223C0 12.6804 10.7452 0 24 0H378C391.255 0 402 12.6804 402 28.3223V47.2038H0V28.3223Z" fill="url(#paint0_linear_background)" />
          <path d="M0 31.5439C0 18.478 10.7452 7.88599 24 7.88599H378C391.255 7.88599 402 18.478 402 31.5439V1400H0V31.5439Z" fill="#F5F5F5" />
          <defs>
            <linearGradient id="paint0_linear_background" x1="-48" y1="630" x2="448.486" y2="632.664" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7A3E69" />
              <stop offset="0.269231" stopColor="#303E74" stopOpacity="0.9" />
              <stop offset="0.490385" stopColor="#72CE9F" stopOpacity="0.7" />
              <stop offset="0.711538" stopColor="#EAA124" />
              <stop offset="1" stopColor="#907EEF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </main>
  );
};
