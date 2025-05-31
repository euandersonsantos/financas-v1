import React from 'react';
interface RevenueSummaryProps {
  totalRevenue: string;
  percentageChange: number;
  comparisonText: string;
}
export const RevenueSummary: React.FC<RevenueSummaryProps> = ({
  totalRevenue,
  percentageChange,
  comparisonText
}) => {
  return <section className="flex w-[239px] flex-col items-start gap-2.5 max-sm:w-full">
      <div className="flex flex-col items-start gap-0 w-full py-0">
        <h2 className="text-[#43464D] font-medium text-base tracking-[0.14px] max-sm:text-sm">
          Total faturamento
        </h2>
        <div className="font-black text-[40px] tracking-[0.4px] bg-gradient-to-r from-[#78B60F] to-[#6D96E4] bg-clip-text text-transparent max-sm:text-[32px] whitespace-nowrap">
          {totalRevenue}
        </div>
        <p className="text-[#5E626C] font-medium text-sm tracking-[0.12px] max-sm:text-xs">
          <span className="font-bold">{percentageChange}% de aumento</span>
          <span> {comparisonText}</span>
        </p>
      </div>
    </section>;
};