// app/components/dashboard/TaskTimer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';

interface TaskTimerProps {
  task: VolunteerTask;
  userId: string;
  onTaskComplete: () => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ task, userId, onTaskComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set initial time
    if (task.customDuration) {
      setTimeLeft(task.customDuration * 60); // Convert minutes to seconds
    } else {
      setTimeLeft(task.estimatedTime * 60);
    }

    // Start timer
    startTimer();

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [task]);

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up
          if (timerInterval.current) {
            clearInterval(timerInterval.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      startTimer();
    } else {
      // Pause
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    }
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    // Reset to initial time
    if (task.customDuration) {
      setTimeLeft(task.customDuration * 60);
    } else {
      setTimeLeft(task.estimatedTime * 60);
    }
    
    setIsPaused(true);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg transition-all duration-300 z-40 ${isExpanded ? 'w-80' : 'w-auto'}`}>
      <div className="p-3 flex items-center justify-between">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
        
        <div className="font-mono text-lg font-semibold">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex">
          <button
            onClick={togglePause}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 border-t">
          <div className="mb-3">
            <h4 className="font-medium text-sm text-gray-800">{task.title}</h4>
            <p className="text-xs text-gray-600 truncate">{task.description}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={resetTimer}
              className="flex-1 py-1 px-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
            >
              Reset
            </button>
            <button
              onClick={onTaskComplete}
              className="flex-1 py-1 px-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTimer;
