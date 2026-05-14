import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ value = 0, onChange, readonly = false, size = 20 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <FiStar
            size={size}
            className={`transition ${(hover || value) >= star ? 'text-gold-400 fill-gold-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}
