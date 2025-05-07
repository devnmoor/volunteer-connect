// components/ui/SortButton.tsx
'use client';import { useState } from 'react';

interface SortButtonProps {
  options: { label: string; value: string }[];
  defaultOption?: string;
  onChange: (value: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ 
  options, 
  defaultOption, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultOption || options[0]?.value || '');
  
  const handleSelect = (value: string) => {
    setSelected(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-white border rounded-md px-3 py-1 text-sm"
      >
        <span>Sort by</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-48">
          <ul>
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  selected === option.value ? 'bg-gray-50 font-medium' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortButton;