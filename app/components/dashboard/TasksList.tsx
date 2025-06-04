// app/components/dashboard/TasksList.tsx - Enhanced version
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from './TaskCard';
import TaskTimeDisplay from './TaskTimeDisplay';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import Link from 'next/link';

// New component imports
import TaskStartModal from './TaskStartModal';
import PauseReasonModal from './PauseReasonModal';
import TaskProgressModal from './TaskProgressModal';
import TaskCompletionCongratulationsModal from './TaskCompletionCongratulationsModal';
import TaskFinalCompletionModal from './TaskFinalCompletionModal';

interface TasksListProps {
  tasks: VolunteerTask[];
  userId: string;
  onTaskClick?: (task: VolunteerTask) => void;
  activeTaskId?: string | null;
  onTaskStart?: (taskId: string) => void;
  onTaskPause?: (taskId: string) => void;
}

interface PauseEntry {
  timestamp: Date;
  reason: string;
  description: string;
  resumeTimestamp?: Date;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  userId,
  onTaskClick,
  activeTaskId,
  onTaskStart,
  onTaskPause
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  
  // Modal states
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState(false);
  
  // Timer and task state
  const [currentActiveTaskId, setCurrentActiveTaskId] = useState<string | null>(activeTaskId || null);
  const [taskStartTimes, setTaskStartTimes] = useState<{[taskId: string]: Date}>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mysteryRewardReceived, setMysteryRewardReceived] = useState<string | null>(null);
  
  // Pause tracking
  const [pauseEntries, setPauseEntries] = useState<{[taskId: string]: PauseEntry[]}>({});
  
  // Expanded history tasks
  const [expandedHistoryTasks, setExpandedHistoryTasks] = useState<Set<string>>(new Set());

  // Update current time every second for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check for timer completion
  useEffect(() => {
    if (currentActiveTaskId) {
      const activeTask = tasks.find(t => t.id === currentActiveTaskId);
      if (activeTask && taskStartTimes[currentActiveTaskId]) {
        const elapsedTime = getLiveElapsedTime();
        const totalTime = (activeTask.estimatedTime || 60) * 60; // Convert to seconds
        
        if (elapsedTime >= totalTime) {
          // Timer completed - show congratulations
          handleTimerCompletion(activeTask);
        }
      }
    }
  }, [currentTime, currentActiveTaskId, taskStartTimes]);

  // Group tasks by status
  const openTasks = tasks.filter(task => 
    !task.completedBy?.includes(userId) && 
    (!task.status || task.status === 'open')
  );
  
  const scheduledTasksList = tasks.filter(task =>
    !task.completedBy?.includes(userId) && 
    task.status === 'scheduled'
  );
  
  const inProgressTasks = tasks.filter(task => 
    !task.completedBy?.includes(userId) && 
    (task.status === 'in-progress' || task.status === 'paused')
  );
  
  const completedTasks = tasks.filter(task => 
    task.completedBy?.includes(userId) || 
    task.status === 'completed'
  );

  // Calculate weekly progress
  const weeklyProgress = {
    completed: completedTasks.length,
    total: tasks.length,
    percentage: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    inProgress: inProgressTasks.length,
    scheduled: scheduledTasksList.length
  };

  // Get active task details
  const activeTask = currentActiveTaskId ? tasks.find(t => t.id === currentActiveTaskId) : null;
  const activeTaskStartTime = currentActiveTaskId ? taskStartTimes[currentActiveTaskId] : null;

  // Calculate live elapsed time for active task
  const getLiveElapsedTime = () => {
    if (!activeTask || !activeTaskStartTime) return 0;
    
    const baseTime = activeTask.timeSpent || 0;
    const sessionTime = Math.floor((currentTime.getTime() - activeTaskStartTime.getTime()) / 1000);
    return baseTime + sessionTime;
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

  // Handle task card clicks
  const handleTaskCardClick = (task: VolunteerTask) => {
    setSelectedTask(task);
    
    if (task.status === 'completed' || task.completedBy?.includes(userId)) {
      // For completed tasks, just show in expanded view (for history tab)
      if (activeTab === 'completed') {
        toggleHistoryTaskExpansion(task.id!);
      }
      return;
    }
    
    if (task.status === 'in-progress' || task.status === 'paused') {
      // Show progress modal for in-progress/paused tasks
      setShowProgressModal(true);
    } else {
      // Show start modal for new tasks
      setShowStartModal(true);
    }
    
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  // Handle task start from modal
  const handleTaskStart = async (taskId: string) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'in-progress',
        startTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setCurrentActiveTaskId(taskId);
      setTaskStartTimes(prev => ({
        ...prev,
        [taskId]: new Date()
      }));

      if (onTaskStart) {
        onTaskStart(taskId);
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  // Handle task scheduling
  const handleTaskScheduled = () => {
    setSelectedTask(null);
    setShowStartModal(false);
  };

  // Handle pause button click
  const handlePauseClick = () => {
    setShowPauseReasonModal(true);
  };

  // Handle pause reason submission
  const handlePauseReasonSubmit = async (reason: string, description: string) => {
    if (!currentActiveTaskId) return;
    
    try {
      const pauseEntry: PauseEntry = {
        timestamp: new Date(),
        reason,
        description
      };
      
      // Update local pause entries
      setPauseEntries(prev => ({
        ...prev,
        [currentActiveTaskId]: [...(prev[currentActiveTaskId] || []), pauseEntry]
      }));
      
      // Calculate elapsed time
      let currentElapsed = activeTask?.timeSpent || 0;
      if (taskStartTimes[currentActiveTaskId]) {
        const sessionElapsed = Math.floor((new Date().getTime() - taskStartTimes[currentActiveTaskId].getTime()) / 1000);
        currentElapsed += Math.max(sessionElapsed, 0);
      }
      
      // Update task in Firestore
      const taskRef = doc(db, 'tasks', currentActiveTaskId);
      await updateDoc(taskRef, {
        status: 'paused',
        timeSpent: currentElapsed,
        pauseEntries: arrayUnion(pauseEntry),
        lastPauseTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Clear active task
      setCurrentActiveTaskId(null);
      setTaskStartTimes(prev => {
        const updated = { ...prev };
        delete updated[currentActiveTaskId];
        return updated;
      });
      
      setShowPauseReasonModal(false);
      
      if (onTaskPause) {
        onTaskPause(currentActiveTaskId);
      }
      
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  };

  // Handle resume task
  const handleResumeTask = async (taskId: string) => {
    try {
      // Update the last pause entry with resume time
      const currentPauseEntries = pauseEntries[taskId] || [];
      if (currentPauseEntries.length > 0) {
        const updatedEntries = [...currentPauseEntries];
        const lastIndex = updatedEntries.length - 1;
        updatedEntries[lastIndex] = {
          ...updatedEntries[lastIndex],
          resumeTimestamp: new Date()
        };
        
        setPauseEntries(prev => ({
          ...prev,
          [taskId]: updatedEntries
        }));
      }
      
      // Update task status
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'in-progress',
        startTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setCurrentActiveTaskId(taskId);
      setTaskStartTimes(prev => ({
        ...prev,
        [taskId]: new Date()
      }));
      
      setShowProgressModal(false);
      
      if (onTaskStart) {
        onTaskStart(taskId);
      }
    } catch (error) {
      console.error('Error resuming task:', error);
    }
  };

  // Handle timer completion
  const handleTimerCompletion = (task: VolunteerTask) => {
    // Stop the timer
    setCurrentActiveTaskId(null);
    setTaskStartTimes(prev => {
      const updated = { ...prev };
      delete updated[task.id!];
      return updated;
    });
    
    // Show congratulations modal
    setSelectedTask(task);
    setShowCongratulationsModal(true);
  };

  // Handle congratulations modal next
  const handleCongratulationsNext = () => {
    setShowCongratulationsModal(false);
    setShowFinalCompletionModal(true);
  };

  // Handle final task completion
  const handleFinalTaskCompletion = async () => {
    if (!selectedTask) return;
    
    try {
      // Check for mystery seed
      const mysteryReward = checkForMysteryReward();
      if (mysteryReward) {
        setMysteryRewardReceived(mysteryReward);
        
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          [`mysterySeeds.${mysteryReward}`]: increment(1)
        });
        
        await addDoc(collection(db, 'shoutouts'), {
          userId: userId,
          seedType: mysteryReward,
          timestamp: serverTimestamp()
        });
      }
      
      setShowFinalCompletionModal(false);
      setSelectedTask(null);
      
      // Refresh tasks list
      window.location.reload(); // Simple refresh for now
      
    } catch (error) {
      console.error('Error in final completion:', error);
    }
  };

  // Check for mystery reward
  const checkForMysteryReward = (): string | null => {
    const random = Math.random() * 100;
    
    if (random <= 0.001) return 'mystery';
    if (random <= 0.01) return 'eternity';
    if (random <= 0.1) return 'diamond';
    if (random <= 5) return 'gold';
    if (random <= 10) return 'silver';
    
    return null;
  };

  // Toggle history task expansion
  const toggleHistoryTaskExpansion = (taskId: string) => {
    setExpandedHistoryTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Get remaining time for active task
  const getRemainingTime = () => {
    if (!activeTask) return 0;
    const totalEstimated = (activeTask.estimatedTime || 60) * 60;
    const elapsed = getLiveElapsedTime();
    return Math.max(totalEstimated - elapsed, 0);
  };

  // Determine which tasks to display based on active tab
  const displayedTasks = 
    activeTab === 'open' ? [...openTasks, ...scheduledTasksList] :
    activeTab === 'in-progress' ? inProgressTasks :
    completedTasks;

  const handleCreateCustomTask = () => {
    router.push('/tasks/create');
  };

  return (
    <div>
      {/* Enhanced Weekly Reward Banner */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg p-6 mb-6 shadow-sm border border-green-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Weekly Volunteer Challenge
            </h3>
            <p className="text-green-700 mb-3">
              Complete all {weeklyProgress.total} tasks to earn 5 seeds! 
              {weeklyProgress.percentage === 100 && " 🎉 Congratulations!"}
            </p>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="h-4 flex-grow bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    weeklyProgress.percentage === 100 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-green-400 to-green-500'
                  }`}
                  style={{ width: `${weeklyProgress.percentage}%` }}
                >
                  {weeklyProgress.percentage === 100 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-semibold text-gray-700">
                  {weeklyProgress.completed}/{weeklyProgress.total} tasks
                </span>
                <span className="text-sm font-medium text-green-600">
                  {weeklyProgress.percentage}% complete
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-3 py-2 rounded-full shadow-sm border">
              <span className="text-xs text-gray-600">In Progress</span>
              <span className="ml-1 font-bold text-blue-600">{weeklyProgress.inProgress}</span>
            </div>
            <div className="bg-white px-3 py-2 rounded-full shadow-sm border">
              <span className="text-xs text-gray-600">Scheduled</span>
              <span className="ml-1 font-bold text-purple-600">{weeklyProgress.scheduled}</span>
            </div>
            <div className="bg-white px-3 py-2 rounded-full shadow-sm border">
              <span className="text-xs text-gray-600">Completed</span>
              <span className="ml-1 font-bold text-green-600">{weeklyProgress.completed}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Active Timer Display */}
        {currentActiveTaskId && activeTask && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="relative">
                  <TaskTimeDisplay 
                    task={activeTask}
                    isActive={true}
                    size="medium"
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {activeTask.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Started: {activeTaskStartTime?.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                    <span className="font-mono font-semibold text-blue-600">
                      Live: {formatTime(getLiveElapsedTime())}
                    </span>
                  </div>
                  
                  {getRemainingTime() > 0 && (
                    <div className="mt-1 text-sm">
                      <span className="text-orange-600 font-medium">
                        {formatTime(getRemainingTime())} remaining
                      </span>
                    </div>
                  )}

                  {getRemainingTime() <= 0 && (
                    <div className="mt-1 text-sm text-red-600 font-medium animate-pulse">
                      ⚠️ Task timer completed! Ready for final submission.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs font-medium text-blue-800">Timer Active</span>
                </div>
                
                <button
                  onClick={handlePauseClick}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Task Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === 'open'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Open Tasks ({openTasks.length + scheduledTasksList.length})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === 'in-progress'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            In-Progress ({inProgressTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === 'completed'
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            History ({completedTasks.length})
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {weeklyProgress.percentage === 100 && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              🎉 Week Complete!
            </div>
          )}
          
          <button
            onClick={handleCreateCustomTask}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      {/* Tasks Display */}
      {displayedTasks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            {activeTab === 'open' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            ) : activeTab === 'in-progress' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">
            {activeTab === 'open' 
              ? "No open tasks available right now." 
              : activeTab === 'in-progress' 
                ? "No tasks currently in progress." 
                : "No completed tasks yet."}
          </p>
          <p className="text-gray-500 text-sm">
            {activeTab === 'open' 
              ? "New tasks are assigned weekly. Check back soon or create a custom task." 
              : activeTab === 'in-progress' 
                ? "Start a task to begin tracking your progress." 
                : "Complete tasks to build your volunteering history."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'completed' ? (
            // Special rendering for history tab with expandable items
            <div className="space-y-4">
              {displayedTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow-md border">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleHistoryTaskExpansion(task.id!)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-gray-600 text-sm">{task.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Completed
                          </span>
                          {task.completionDate && (
                            <span className="text-xs text-gray-500">
                              Completed: {new Date(task.completionDate.seconds * 1000).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedHistoryTasks.has(task.id!) ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {expandedHistoryTasks.has(task.id!) && (
                    <div className="border-t bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Task Activity</h4>
                      
                      {/* Pause entries */}
                      {task.pauseEntries && task.pauseEntries.length > 0 ? (
                        <div className="space-y-3">
                          {task.pauseEntries.map((entry, index) => (
                            <div key={index} className="bg-white p-3 rounded-md border-l-4 border-yellow-400">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm text-gray-800">Paused</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(entry.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">
                                <strong>Reason:</strong> {entry.reason}
                              </p>
                              <p className="text-sm text-gray-600">{entry.description}</p>
                              {entry.resumeTimestamp && (
                                <p className="text-xs text-green-600 mt-2">
                                  Resumed: {new Date(entry.resumeTimestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No pause entries recorded for this task.</p>
                      )}
                      
                      {/* Completion data */}
                      {task.completionData && (
                        <div className="mt-4 pt-3 border-t">
                          <h5 className="font-medium text-gray-800 mb-2">Completion Details</h5>
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Achievements:</strong> {task.completionData.achievements}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Feedback:</strong> {task.completionData.feedback}
                            </p>
                            {task.completionData.contact && (
                              <p className="text-sm text-gray-700">
                                <strong>Contact:</strong> {task.completionData.contact.name} ({task.completionData.contact.value})
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )