// app/components/dashboard/ProgressStats.tsx
'use client';

import { UserLevel } from '@/app/lib/firebase/auth';

interface ProgressStatsProps {
  total: number;
  completed: number;
  level: UserLevel;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ total, completed, level }) => {
  // Calculate percentage completed
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Get level-specific text and colors
  const getLevelInfo = (level: UserLevel) => {
    switch (level) {
      case 'Sprout':
        return {
          title: 'Growing Your Impact',
          description: 'Complete your assigned tasks to earn seeds and make a difference!',
          color: 'bg-green-400'
        };
      case 'Bud':
        return {
          title: 'Expanding Your Reach',
          description: 'Connect with others locally and choose tasks that interest you.',
          color: 'bg-green-600'
        };
      case 'Bloom':
        return {
          title: 'Leading the Way',
          description: 'Create opportunities and mentor others in your community.',
          color: 'bg-green-800'
        };
      default:
        return {
          title: 'Tracking Progress',
          description: 'Complete tasks to earn seeds and make a difference.',
          color: 'bg-green-500'
        };
    }
  };
  
  const levelInfo = getLevelInfo(level);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold text-lg">{levelInfo.title}</h3>
          <p className="text-gray-600 text-sm">{levelInfo.description}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">{completed} / {total}</p>
          <p className="text-sm text-gray-600">Tasks Completed</p>
        </div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full mt-4">
        <div 
          className={`h-full rounded-full ${levelInfo.color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <p>{percentage}% Complete</p>
        {percentage === 100 ? (
          <p className="text-green-600 font-medium">All tasks completed this week!</p>
        ) : (
          <p>{total - completed} task{total - completed !== 1 ? 's' : ''} remaining</p>
        )}
      </div>
      
      {/* Weekly reward info */}
      <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
        <div className="flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-green-800">
            <span className="font-medium">Weekly Reward:</span> Complete all tasks to earn 5 seeds!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
