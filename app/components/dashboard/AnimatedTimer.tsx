// app/components/dashboard/AnimatedTimer.tsx
'use client';

import { useState, useEffect } from 'react';

interface AnimatedTimerProps {
  totalSeconds: number; // Total estimated time for the task
  elapsedSeconds: number; // Time already spent on the task
  isRunning: boolean; // Whether timer is currently running
  size?: number; // Size of the timer (default 48)
  showLabels?: boolean; // Whether to show time labels
}

const AnimatedTimer: React.FC<AnimatedTimerProps> = ({
  totalSeconds,
  elapsedSeconds,
  isRunning,
  size = 48,
  showLabels = false
}) => {
  const [currentElapsed, setCurrentElapsed] = useState(elapsedSeconds);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update elapsed time and current time every second when running
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentElapsed(prev => prev + 1);
        setCurrentTime(new Date());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);
  
  // Reset when elapsedSeconds prop changes (for paused tasks)
  useEffect(() => {
    setCurrentElapsed(elapsedSeconds);
  }, [elapsedSeconds]);
  
  // Calculate progress and remaining time
  const progress = Math.min(currentElapsed / totalSeconds, 1);
  const remainingSeconds = Math.max(totalSeconds - currentElapsed, 0);
  
  // Calculate hand positions for real clock movement
  const secondsInCurrentMinute = currentTime.getSeconds();
  const minutesInCurrentHour = currentTime.getMinutes() + (secondsInCurrentMinute / 60);
  const hoursIn12Format = (currentTime.getHours() % 12) + (minutesInCurrentHour / 60);
  
  // Calculate angles for hands (360 degrees = full rotation)
  const secondAngle = (secondsInCurrentMinute / 60) * 360;
  const minuteAngle = (minutesInCurrentHour / 60) * 360;
  const hourAngle = (hoursIn12Format / 12) * 360;
  
  // Task progress angle (for the progress indicator)
  const progressAngle = progress * 360;
  
  // Get estimated completion time
  const getEstimatedCompletion = () => {
    if (!isRunning || remainingSeconds <= 0) return null;
    
    const now = new Date();
    const completionTime = new Date(now.getTime() + (remainingSeconds * 1000));
    return completionTime;
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  const estimatedCompletion = getEstimatedCompletion();
  const center = size / 2;
  const radius = (size - 4) / 2;
  
  return (
    <div className="flex flex-col items-center">
      {/* Animated Timer SVG */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Outer ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          
          {/* Progress ring - shows task completion progress */}
          <circle
            cx={center}
            cy={center}
            r={radius - 3}
            fill="none"
            stroke={isRunning ? "#10B981" : progress >= 1 ? "#EF4444" : "#6B7280"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * (radius - 3)}`}
            strokeDashoffset={`${2 * Math.PI * (radius - 3) * (1 - progress)}`}
            className="transition-all duration-1000 ease-linear"
          />
          
          {/* Clock face markings */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = center + (radius - 8) * Math.cos(angle);
            const y1 = center + (radius - 8) * Math.sin(angle);
            const x2 = center + (radius - 4) * Math.cos(angle);
            const y2 = center + (radius - 4) * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9CA3AF"
                strokeWidth={i % 3 === 0 ? "2" : "1"}
                className="transform rotate-90"
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
            );
          })}
          
          {/* Minute markers (smaller) */}
          {[...Array(60)].map((_, i) => {
            if (i % 5 !== 0) { // Skip hour markers
              const angle = (i * 6) * (Math.PI / 180);
              const x1 = center + (radius - 6) * Math.cos(angle);
              const y1 = center + (radius - 6) * Math.sin(angle);
              const x2 = center + (radius - 4) * Math.cos(angle);
              const y2 = center + (radius - 4) * Math.sin(angle);
              
              return (
                <line
                  key={`min-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#D1D5DB"
                  strokeWidth="0.5"
                  className="transform rotate-90"
                  style={{ transformOrigin: `${center}px ${center}px` }}
                />
              );
            }
            return null;
          })}
          
          {/* Hour hand */}
          <line
            x1={center}
            y1={center}
            x2={center + (radius * 0.5) * Math.cos((hourAngle - 90) * (Math.PI / 180))}
            y2={center + (radius * 0.5) * Math.sin((hourAngle - 90) * (Math.PI / 180))}
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
            className={isRunning ? "transition-all duration-1000 ease-linear" : "transition-all duration-500"}
          />
          
          {/* Minute hand */}
          <line
            x1={center}
            y1={center}
            x2={center + (radius * 0.75) * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
            y2={center + (radius * 0.75) * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            className={isRunning ? "transition-all duration-1000 ease-linear" : "transition-all duration-500"}
          />
          
          {/* Second hand - only show when running */}
          {isRunning && (
            <line
              x1={center}
              y1={center}
              x2={center + (radius * 0.9) * Math.cos((secondAngle - 90) * (Math.PI / 180))}
              y2={center + (radius * 0.9) * Math.sin((secondAngle - 90) * (Math.PI / 180))}
              stroke="#EF4444"
              strokeWidth="1"
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
          )}
          
          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="3"
            fill="#1F2937"
          />
          
          {/* Center status indicator */}
          {isRunning && (
            <circle
              cx={center}
              cy={center}
              r="1.5"
              fill="#10B981"
              className="animate-pulse"
            />
          )}
        </svg>
        
        {/* Status badge */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isRunning ? 'bg-green-500 animate-pulse' : 
          progress >= 1 ? 'bg-red-500' : 'bg-gray-400'
        }`}></div>
      </div>
      
      {/* Time information */}
      {showLabels && (
        <div className="mt-2 text-center">
          <div className="text-xs font-medium text-gray-700">
            {formatTime(currentElapsed)} / {formatTime(totalSeconds)}
          </div>
          {remainingSeconds > 0 && (
            <div className="text-xs text-gray-500">
              {formatTime(remainingSeconds)} remaining
            </div>
          )}
          {estimatedCompletion && (
            <div className="text-xs text-blue-600">
              Est. done: {estimatedCompletion.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimatedTimer;