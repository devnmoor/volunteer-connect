// app/components/dashboard/TaskTimeDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import AnimatedTimer from './AnimatedTimer';

interface TaskTimeDisplayProps {
    task: VolunteerTask;
    isActive?: boolean;
    size?: 'small' | 'medium' | 'large';
    showLiveUpdates?: boolean;
}

const TaskTimeDisplay: React.FC<TaskTimeDisplayProps> = ({
    task,
    isActive = false,
    size = 'medium',
    showLiveUpdates = true
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [liveElapsed, setLiveElapsed] = useState(0);

    // Update current time every second for live updates
    useEffect(() => {
        if (showLiveUpdates) {
            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showLiveUpdates]);

    // Calculate elapsed time including live updates
    const getElapsedSeconds = () => {
        let totalElapsed = task.timeSpent || 0;

        // If task is currently active, add time since start
        if (isActive && task.startTime && showLiveUpdates) {
            const startTime = task.startTime.toDate ? task.startTime.toDate() : new Date(task.startTime);
            const currentElapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
            totalElapsed += Math.max(currentElapsed, 0);
        }

        return totalElapsed;
    };

    // Get total estimated time in seconds
    const getTotalSeconds = () => {
        return (task.estimatedTime || 60) * 60; // Convert minutes to seconds
    };

    // Calculate remaining time
    const getRemainingSeconds = () => {
        const elapsed = getElapsedSeconds();
        const total = getTotalSeconds();
        return Math.max(total - elapsed, 0);
    };

    // Get estimated completion time
    const getEstimatedCompletion = () => {
        if (!isActive) return null;

        const remaining = getRemainingSeconds();
        if (remaining <= 0) return null;

        const completionTime = new Date(currentTime.getTime() + (remaining * 1000));
        return completionTime;
    };

    // Format time for display with live seconds
    const formatTime = (seconds: number, showSeconds: boolean = true) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return showSeconds ? `${hours}h ${minutes}m ${secs}s` : `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return showSeconds ? `${minutes}m ${secs}s` : `${minutes}m`;
        } else {
            return `${secs}s`;
        }
    };

    // Get progress percentage
    const getProgress = () => {
        const elapsed = getElapsedSeconds();
        const total = getTotalSeconds();
        return Math.min((elapsed / total) * 100, 100);
    };

    const elapsedSeconds = getElapsedSeconds();
    const totalSeconds = getTotalSeconds();
    const remainingSeconds = getRemainingSeconds();
    const estimatedCompletion = getEstimatedCompletion();
    const progress = getProgress();

    // Determine sizes and display options
    const sizeConfig = {
        small: { timer: 32, showLabels: false, showSeconds: false },
        medium: { timer: 48, showLabels: true, showSeconds: true },
        large: { timer: 64, showLabels: true, showSeconds: true }
    };

    const config = sizeConfig[size];

    return (
        <div className="flex flex-col items-center space-y-2">
            {/* Animated Timer */}
            <AnimatedTimer
                totalSeconds={totalSeconds}
                elapsedSeconds={elapsedSeconds}
                isRunning={isActive}
                size={config.timer}
                showLabels={false}
            />

            {/* Time Information */}
            {config.showLabels && (
                <div className="text-center space-y-1">
                    {/* Live Timer Display */}
                    {isActive && (
                        <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-mono font-bold text-green-800">
                                    {formatTime(elapsedSeconds, config.showSeconds)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-1000 ${isActive ? 'bg-green-500' :
                                    progress >= 100 ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>

                    {/* Time Stats */}
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">
                            Elapsed: <span className="font-medium font-mono">{formatTime(elapsedSeconds, false)}</span>
                        </span>
                        <span className="text-gray-600">
                            Total: <span className="font-medium">{formatTime(totalSeconds, false)}</span>
                        </span>
                    </div>

                    {/* Remaining Time - Live Updates */}
                    {remainingSeconds > 0 && (
                        <div className="text-center">
                            <span className={`text-sm font-medium ${isActive ? 'text-orange-600 font-mono' : 'text-orange-600'}`}>
                                {formatTime(remainingSeconds, isActive)} remaining
                            </span>
                        </div>
                    )}

                    {/* Estimated Completion - Live Updates */}
                    {estimatedCompletion && isActive && (
                        <div className="text-center bg-blue-50 px-2 py-1 rounded">
                            <span className="text-xs text-blue-600 font-medium">
                                Est. completion: {estimatedCompletion.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}
                            </span>
                        </div>
                    )}

                    {/* Overtime Warning */}
                    {progress > 100 && (
                        <div className="text-center bg-red-50 px-2 py-1 rounded border border-red-200">
                            <span className="text-xs text-red-600 font-medium">
                                ⚠️ {formatTime(elapsedSeconds - totalSeconds, config.showSeconds)} overtime
                            </span>
                        </div>
                    )}

                    {/* Performance Indicator */}
                    {isActive && elapsedSeconds > 0 && (
                        <div className="text-center">
                            <span className="text-xs text-gray-500">
                                {progress < 50 ? '🚀 On track' :
                                    progress < 80 ? '⏰ Good pace' :
                                        progress < 100 ? '⚡ Final stretch' : '🔥 Overtime'}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskTimeDisplay;