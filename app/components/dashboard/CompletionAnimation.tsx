// app/components/dashboard/CompletionAnimation.tsx
'use client';

import { useState, useEffect } from 'react';

interface CompletionAnimationProps {
  mysteryReward: string | null;
}

const CompletionAnimation: React.FC<CompletionAnimationProps> = ({ mysteryReward }) => {
  const [animationStage, setAnimationStage] = useState(1);
  
  useEffect(() => {
    // Progress through animation stages
    const timer1 = setTimeout(() => setAnimationStage(2), 1000);
    const timer2 = setTimeout(() => setAnimationStage(3), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  // Seed color based on mystery reward
  const getSeedColor = () => {
    if (!mysteryReward) return "#22c55e"; // Regular green seed
    
    switch (mysteryReward) {
      case 'silver': return "linear-gradient(135deg, #f1f5f9, #94a3b8)";
      case 'gold': return "linear-gradient(135deg, #fef3c7, #f59e0b)";
      case 'diamond': return "linear-gradient(135deg, #e0f2fe, #0ea5e9)";
      case 'eternity': return "linear-gradient(135deg, #fae8ff, #d946ef)";
      case 'mystery': return "linear-gradient(135deg, #10b981, #6366f1, #ef4444)";
      default: return "#22c55e";
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="max-w-md w-full bg-white rounded-xl p-8 text-center relative overflow-hidden">
        {/* Flying seeds animation */}
        {animationStage >= 1 && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-fly-seed"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${1 + Math.random() * 3}s`,
                  // Set random direction for each seed
                  '--random-x': `${(Math.random() * 200 - 100)}px`,
                  '--random-y': `${(Math.random() * 200 - 100)}px`
                } as React.CSSProperties}
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ background: getSeedColor() }}
                ></div>
              </div>
            ))}
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {animationStage < 3 ? "Task Completed!" : "You've Earned a Seed!"}
        </h2>
        
        {animationStage >= 2 && (
          <div className="mb-8 flex justify-center">
            <div 
              className="h-24 w-24 rounded-full animate-pulse-grow"
              style={{ background: getSeedColor() }}
            ></div>
          </div>
        )}
        
        {animationStage >= 3 && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Congratulations on completing your task!
            </p>
            
            {mysteryReward && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 font-medium">
                  WOW! You found a {mysteryReward.charAt(0).toUpperCase() + mysteryReward.slice(1)} Seed!
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  These rare seeds will help your Greenhouse flourish and earn you special recognition!
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-600">
              The more tasks you complete each week, the higher your chance to find a mystery seed!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionAnimation;