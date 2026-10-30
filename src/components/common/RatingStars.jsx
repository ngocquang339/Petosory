import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-115 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${sizes[size] || sizes.md} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
export default RatingStars;

