// app/components/dashboard/TasksList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from './TaskCard';
import TaskCompletionModal from './TaskCompletionModal';
import ProgressRecordingModal from './ProgressRecordingModal';
import TaskStartModal from './TaskStartModal';
import PauseConfirmationModal from './PauseConfirmationModal';
import TaskTimeDisplay from './TaskTimeDisplay';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp, increment, collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import Link from 'next/link';
import CompletionAnimation from './CompletionAnimation';

interface TasksListProps {
  tasks: VolunteerTask[];
  userId: string;
  onTaskClick?: (task: VolunteerTask) => void;
  activeTaskId?: string | null;
  onTaskStart?: (taskId: string) => void;
  onTaskPause?: (taskId: string) => void;
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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPauseConfirmation, setShowPauseConfirmation] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [currentActiveTaskId, setCurrentActiveTaskId] = useState<string | null>(activeTaskId || null);
  const [mysteryRewardReceived, setMysteryRewardReceived] = useState<string | null>(null);
  const [pausedTaskData, setPausedTaskData] = useState<{
    taskId: string;
    pauseTime: Date;
    elapsedAtPause: number;
  } | null>(null);
  
  const [taskStartTimes, setTaskStartTimes] = useState<{[taskId: string]: Date}>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weeklyTarget, setWeeklyTarget] = useState(5);
  const [showWeeklyStats, setShowWeeklyStats] = useState(true);

  // Update current time every second for live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Group tasks by status with enhanced logic
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

  // Calculate remaining time for active task
  const getRemainingTime = () => {
    if (!activeTask) return 0;
    const totalEstimated = (activeTask.estimatedTime || 60) * 60;
    const elapsed = getLiveElapsedTime();
    return Math.max(totalEstimated - elapsed, 0);
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

  // Get estimated completion time
  const getEstimatedCompletion = () => {
    const remaining = getRemainingTime();
    if (remaining <= 0) return null;
    
    const completionTime = new Date(currentTime.getTime() + (remaining * 1000));
    return completionTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Combine open and scheduled tasks for the "Open Tasks" tab
  const allOpenTasks = [...openTasks, ...scheduledTasksList];

  // Handle complete task action
  const handleCompleteTask = async (task: VolunteerTask) => {
    try {
      if (!task || !task.id) {
        console.error('Invalid task or missing task ID');
        return;
      }
      
      const taskRef = doc(db, 'tasks', task.id);
      
      const updateData: Record<string, any> = {
        completionDate: serverTimestamp(),
        status: 'completed'
      };
      
      if (userId) {
        updateData.completedBy = arrayUnion(userId);
      }
      
      await updateDoc(taskRef, updateData);
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        seeds: increment(1),
        completedTasks: increment(1)
      });
      
      // Check for mystery seed
      const mysteryReward = checkForMysteryReward();
      if (mysteryReward) {
        setMysteryRewardReceived(mysteryReward);
        
        await updateDoc(userRef, {
          [`mysterySeeds.${mysteryReward}`]: increment(1)
        });
        
        await addDoc(collection(db, 'shoutouts'), {
          userId: userId,
          seedType: mysteryReward,
          timestamp: serverTimestamp()
        });
      }
      
      // Clear active task if it was the completed one
      if (currentActiveTaskId === task.id) {
        setCurrentActiveTaskId(null);
        setTaskStartTimes(prev => {
          const updated = { ...prev };
          delete updated[task.id!];
          return updated;
        });
      }
      
      setShowCompletionAnimation(true);
      
      setTimeout(() => {
        setShowCompletionAnimation(false);
        setMysteryRewardReceived(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  
  const checkForMysteryReward = (): string | null => {
    const random = Math.random() * 100;
    
    if (random <= 0.001) return 'mystery';
    if (random <= 0.01) return 'eternity';
    if (random <= 0.1) return 'diamond';
    if (random <= 5) return 'gold';
    if (random <= 10) return 'silver';
    
    return null;
  };

  const handleTaskCardClick = (task: VolunteerTask) => {
    setSelectedTask(task);
    
    if (task.status === 'in-progress' || task.status === 'paused') {
      setShowCompletionModal(true);
    } else if (task.completedBy?.includes(userId)) {
      setShowCompletionModal(true);
    } else {
      setShowStartModal(true);
    }
    
    // Call parent component's onTaskClick if provided
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  const closeAllModals = () => {
    setShowCompletionModal(false);
    setShowProgressModal(false);
    setShowStartModal(false);
    setShowPauseConfirmation(false);
    setSelectedTask(null);
    setPausedTaskData(null);
  };
  
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

      // Call parent component's onTaskStart if provided
      if (onTaskStart) {
        onTaskStart(taskId);
      }
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };
  
  const handleTaskPause = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      let currentElapsed = task.timeSpent || 0;
      if (taskStartTimes[taskId]) {
        const sessionElapsed = Math.floor((new Date().getTime() - taskStartTimes[taskId].getTime()) / 1000);
        currentElapsed += Math.max(sessionElapsed, 0);
      }
      
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'paused',
        timeSpent: currentElapsed,
        lastPauseTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setCurrentActiveTaskId(null);
      setTaskStartTimes(prev => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
      
      setPausedTaskData({
        taskId,
        pauseTime: new Date(),
        elapsedAtPause: currentElapsed
      });
      
      setSelectedTask(task);
      setShowPauseConfirmation(true);

      // Call parent component's onTaskPause if provided
      if (onTaskPause) {
        onTaskPause(taskId);
      }
      
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  };

  const handlePauseConfirm = () => {
    setShowPauseConfirmation(false);
    setShowProgressModal(true);
  };

  const handlePauseCancel = async () => {
    if (pausedTaskData && selectedTask) {
      try {
        const taskRef = doc(db, 'tasks', pausedTaskData.taskId);
        await updateDoc(taskRef, {
          status: 'in-progress',
          startTime: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setCurrentActiveTaskId(pausedTaskData.taskId);
        setTaskStartTimes(prev => ({
          ...prev,
          [pausedTaskData.taskId]: new Date()
        }));
        
      } catch (error) {
        console.error('Error resuming task:', error);
      }
    }
    
    setShowPauseConfirmation(false);
    setSelectedTask(null);
    setPausedTaskData(null);
  };

  const handleProgressSubmit = () => {
    setCurrentActiveTaskId(null);
    setSelectedTask(null);
    setShowProgressModal(false);
    setPausedTaskData(null);
  };

  const handleTaskScheduled = () => {
    setSelectedTask(null);
    setShowStartModal(false);
  };

  // Calculate time until next scheduled task
  const getNextScheduledTask = () => {
    const now = new Date();
    const scheduledWithTimes = scheduledTasksList
      .filter(task => task.scheduledTime)
      .map(task => ({
        task,
        scheduledTime: task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime)
      }))
      .filter(({ scheduledTime }) => scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

    return scheduledWithTimes[0] || null;
  };

  const nextScheduled = getNextScheduledTask();

  // Determine which tasks to display based on active tab
  const displayedTasks = 
    activeTab === 'open' ? allOpenTasks :
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
              Complete all {weeklyProgress.total} tasks to earn {weeklyTarget} seeds! 
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
                      {getEstimatedCompletion() && (
                        <span className="text-gray-500 ml-2">
                          (Est. done: {getEstimatedCompletion()})
                        </span>
                      )}
                    </div>
                  )}

                  {getRemainingTime() <= 0 && (
                    <div className="mt-1 text-sm text-red-600 font-medium animate-pulse">
                      ⚠️ Task is {formatTime(Math.abs(getRemainingTime()))} overtime
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
                  onClick={() => handleTaskPause(currentActiveTaskId)}
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

        {/* Next Scheduled Task */}
        {!currentActiveTaskId && nextScheduled && (
          <div className="mt-4 bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-purple-800">Next Scheduled Task</h5>
                <p className="text-sm text-purple-700">{nextScheduled.task.title}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-800">
                  {nextScheduled.scheduledTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-xs text-purple-600">
                  in {Math.ceil((nextScheduled.scheduledTime.getTime() - currentTime.getTime()) / 60000)} min
                </div>
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
            Open Tasks ({allOpenTasks.length})
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
            Completed ({completedTasks.length})
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
                : "Complete tasks to earn seeds and build your volunteering history."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleted={task.completedBy?.includes(userId) || task.status === 'completed'}
              onComplete={() => handleTaskCardClick(task)}
              userId={userId}
              isDisabled={currentActiveTaskId !== null && currentActiveTaskId !== task.id}
              onTaskStart={handleTaskStart}
              onTaskPause={handleTaskPause}
              activeTaskId={currentActiveTaskId}
            />
          ))}
        </div>
      )}

      {/* Pause Confirmation Modal */}
      {showPauseConfirmation && selectedTask && (
        <PauseConfirmationModal
          task={selectedTask}
          onConfirm={handlePauseConfirm}
          onCancel={handlePauseCancel}
        />
      )}

      {/* Task Start Modal */}
      {showStartModal && selectedTask && (
        <TaskStartModal
          task={selectedTask}
          onClose={closeAllModals}
          onStartTimer={handleTaskStart}
          onScheduled={handleTaskScheduled}
        />
      )}

      {/* Task Completion Modal */}
      {showCompletionModal && selectedTask && (
        <TaskCompletionModal
          task={selectedTask}
          userId={userId}
          onClose={closeAllModals}
          onComplete={() => handleCompleteTask(selectedTask)}
          onTaskStart={handleTaskStart}
          onTaskPause={handleTaskPause}
        />
      )}

      {/* Progress Recording Modal */}
      {showProgressModal && selectedTask && (
        <ProgressRecordingModal
          task={selectedTask}
          userId={userId}
          onClose={() => setShowProgressModal(false)}
          onSubmit={handleProgressSubmit}
        />
      )}

      {/* Completion Animation */}
      {showCompletionAnimation && (
        <CompletionAnimation 
          mysteryReward={mysteryRewardReceived}
        />
      )}
    </div>
  );
};

export default TasksList;