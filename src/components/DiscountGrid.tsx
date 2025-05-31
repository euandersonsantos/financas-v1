
import React from 'react';
import { DiscountCard } from './DiscountCard';

interface DiscountItem {
  id: string;
  title: string;
  amount: string;
  description: string;
  fontWeight?: 'bold' | 'extrabold';
  type?: 'income' | 'expense';
}

interface DiscountGridProps {
  title: string;
  discounts: DiscountItem[];
  onDiscountClick?: (discount: DiscountItem) => void;
}

export const DiscountGrid: React.FC<DiscountGridProps> = ({
  title,
  discounts,
  onDiscountClick
}) => {
  return (
    <section className="flex flex-col justify-center items-start gap-4 w-full">
      <h2 className="text-[#43464D] font-bold text-base tracking-[0.14px] max-sm:text-sm">
        {title}
      </h2>
      <div className="flex h-[232px] items-start gap-2 flex-wrap w-full max-sm:h-auto">
        {discounts.map((discount) => (
          <DiscountCard
            key={discount.id}
            title={discount.title}
            amount={discount.amount}
            description={discount.description}
            fontWeight={discount.fontWeight}
            type={discount.type}
            onClick={() => onDiscountClick?.(discount)}
          />
        ))}
      </div>
    </section>
  );
};
