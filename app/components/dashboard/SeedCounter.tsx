// app/components/dashboard/SeedCounter.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


interface SeedCounterProps {
  seeds: number;
}

const SeedCounter: React.FC<SeedCounterProps> = ({ seeds }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <div className="bg-green-50 border border-green-100 rounded-full px-4 py-2 flex items-center">
        <img
          src="/images/seed-icon.png"
          alt="Seeds"
          className="w-5 h-5 mr-2"
        />
        <span className="font-bold text-green-800">{seeds}</span>
        <button
          type="submit"
          onClick={() => router.push('/store')}
        >
          <div className="bg-green-200 hover:bg-green-300 border border-green-300 hover:cursor-pointer rounded-full ml-4 px-4 py-2 flex items-center">
            <span className="font-bold text-green-800">Buy Seeds</span>
          </div>
        </button>

      </div>
      <p className="text-xs text-gray-500 mt-1">Total Seeds</p>
    </div>
  );
};

export default SeedCounter;
