import React from 'react';

interface DiscountCardProps {
  title: string;
  amount: string;
  description: string;
  fontWeight?: 'bold' | 'extrabold';
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  title,
  amount,
  description,
  fontWeight = 'bold'
}) => {
  return (
    <article className="flex w-44 h-28 flex-col items-start gap-2.5 bg-[#FDFDFD] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] px-[18px] py-[25px] rounded-xl max-sm:w-[calc(50%-4px)] max-sm:h-auto max-sm:px-[15px] max-sm:py-5">
      <div className="flex flex-col justify-center items-start gap-2">
        <div className="flex flex-col items-start">
          <h3 className="text-[#43464D] font-medium text-sm tracking-[0.14px] max-sm:text-xs">
            {title}
          </h3>
          <div className={`${fontWeight === 'extrabold' ? 'font-extrabold' : 'font-bold'} text-lg tracking-[0.18px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-base`}>
            {amount}
          </div>
        </div>
        <p className="text-[#5E626C] font-medium text-xs tracking-[0.12px] max-sm:text-[10px]">
          {description}
        </p>
      </div>
    </article>
  );
};
