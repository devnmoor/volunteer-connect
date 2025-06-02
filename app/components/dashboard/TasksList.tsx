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
}

const TasksList: React.FC<TasksListProps> = ({ tasks, userId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPauseConfirmation, setShowPauseConfirmation] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<{
    task: VolunteerTask;
    scheduledTime: Date;
  }[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [mysteryRewardReceived, setMysteryRewardReceived] = useState<string | null>(null);
  const [pausedTaskData, setPausedTaskData] = useState<{
    taskId: string;
    pauseTime: Date;
    elapsedAtPause: number;
  } | null>(null);

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

  // Combine open and scheduled tasks for the "Open Tasks" tab
  const allOpenTasks = [...openTasks, ...scheduledTasksList];

  // Effect to update scheduled tasks
  useEffect(() => {
    // Find tasks with scheduled times
    const scheduledTasksData = tasks
      .filter(task => task.scheduledTime && !task.completedBy?.includes(userId))
      .map(task => ({
        task,
        scheduledTime: task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime)
      }));
    
    setScheduledTasks(scheduledTasksData);
  }, [tasks, userId]);

  // Handle complete task action
  const handleCompleteTask = async (task: VolunteerTask) => {
    try {
      if (!task || !task.id) {
        console.error('Invalid task or missing task ID');
        return;
      }
      
      const taskRef = doc(db, 'tasks', task.id);
      
      // Create a basic update object without any undefined values
      const updateData: Record<string, any> = {
        completionDate: serverTimestamp(),
        status: 'completed'
      };
      
      // Only add completedBy if userId exists
      if (userId) {
        updateData.completedBy = arrayUnion(userId);
      }
      
      // Update the task in Firestore
      await updateDoc(taskRef, updateData);
      
      // Add a seed to the user
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        seeds: increment(1),
        completedTasks: increment(1)
      });
      
      // Check for mystery seed
      const mysteryReward = checkForMysteryReward();
      if (mysteryReward) {
        setMysteryRewardReceived(mysteryReward);
        
        // Add the mystery seed to user's collection
        await updateDoc(userRef, {
          [`mysterySeeds.${mysteryReward}`]: increment(1)
        });
        
        // Add a public shoutout
        await addDoc(collection(db, 'shoutouts'), {
          userId: userId,
          seedType: mysteryReward,
          timestamp: serverTimestamp()
        });
      }
      
      // Show completion animation
      setShowCompletionAnimation(true);
      
      // After animation finishes, close it
      setTimeout(() => {
        setShowCompletionAnimation(false);
        setMysteryRewardReceived(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  
  // Check for mystery seed based on probabilities
  const checkForMysteryReward = (): string | null => {
    const random = Math.random() * 100; // Percentage
    
    if (random <= 0.001) return 'mystery'; // 0.001% chance for X mystery seed
    if (random <= 0.01) return 'eternity'; // 0.01% chance for Eternity seed
    if (random <= 0.1) return 'diamond'; // 0.1% chance for Diamond seed
    if (random <= 5) return 'gold'; // 5% chance for Gold seed
    if (random <= 10) return 'silver'; // 10% chance for Silver seed
    
    return null; // No mystery seed
  };

  const handleTaskCardClick = (task: VolunteerTask) => {
    setSelectedTask(task);
    
    // Determine which modal to show based on task state
    if (task.status === 'in-progress' || task.status === 'paused') {
      // Show completion modal for in-progress tasks
      setShowCompletionModal(true);
    } else if (task.completedBy?.includes(userId)) {
      // Show completion modal for completed tasks (view only)
      setShowCompletionModal(true);
    } else {
      // Show start modal for open/scheduled tasks
      setShowStartModal(true);
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
      // Update task status to in-progress and record start time
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'in-progress',
        startTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setActiveTaskId(taskId);
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };
  
  const handleTaskPause = async (taskId: string) => {
    try {
      // Find the task
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Calculate elapsed time up to this point
      let currentElapsed = task.timeSpent || 0;
      if (task.startTime) {
        const startTime = task.startTime.toDate ? task.startTime.toDate() : new Date(task.startTime);
        const sessionElapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        currentElapsed += Math.max(sessionElapsed, 0);
      }
      
      // Immediately pause the timer in the database
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: 'paused',
        timeSpent: currentElapsed,
        lastPauseTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Stop the active timer immediately
      setActiveTaskId(null);
      
      // Store pause data for potential resume
      setPausedTaskData({
        taskId,
        pauseTime: new Date(),
        elapsedAtPause: currentElapsed
      });
      
      // Set selected task and show confirmation modal
      setSelectedTask(task);
      setShowPauseConfirmation(true);
      
    } catch (error) {
      console.error('Error pausing task:', error);
    }
  };

  const handlePauseConfirm = () => {
    // User confirmed pause - show progress recording modal
    setShowPauseConfirmation(false);
    setShowProgressModal(true);
  };

  const handlePauseCancel = async () => {
    // User wants to continue - resume the timer
    if (pausedTaskData && selectedTask) {
      try {
        const taskRef = doc(db, 'tasks', pausedTaskData.taskId);
        await updateDoc(taskRef, {
          status: 'in-progress',
          startTime: serverTimestamp(), // Reset start time for new session
          updatedAt: serverTimestamp()
        });
        
        // Resume the active timer
        setActiveTaskId(pausedTaskData.taskId);
        
      } catch (error) {
        console.error('Error resuming task:', error);
      }
    }
    
    // Close modals and clear state
    setShowPauseConfirmation(false);
    setSelectedTask(null);
    setPausedTaskData(null);
  };

  const handleProgressSubmit = () => {
    // Clear active task and refresh
    setActiveTaskId(null);
    setSelectedTask(null);
    setShowProgressModal(false);
    setPausedTaskData(null);
    
    // The task status will be updated to 'paused' by the modal
    // and will appear in the in-progress section
  };

  const handleTaskScheduled = () => {
    // Task has been scheduled, refresh the UI
    setSelectedTask(null);
    setShowStartModal(false);
  };

  // Get current time to check for scheduled tasks that should start
  const now = new Date();
  const tasksStartingSoon = scheduledTasks.filter(
    scheduled => {
      const timeDiff = scheduled.scheduledTime.getTime() - now.getTime();
      return timeDiff <= 15 * 60 * 1000 && timeDiff > 0; // 15 minutes or less
    }
  );

  // Determine which tasks to display based on active tab
  const displayedTasks = 
    activeTab === 'open' ? allOpenTasks :
    activeTab === 'in-progress' ? inProgressTasks :
    completedTasks;

  // Create custom task function
  const handleCreateCustomTask = () => {
    router.push('/tasks/create');
  };

  return (
    <div>
      {/* Weekly Reward Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 shadow-sm border border-green-100">
        <h3 className="text-lg font-medium text-green-800 mb-2">Weekly Reward: Complete all tasks to earn 5 seeds!</h3>
        <div className="flex items-center">
          <div className="h-3 flex-grow bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
            ></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {completedTasks.length}/{tasks.length} tasks
          </span>
        </div>
        
        {/* Active Timer (if any) */}
        {activeTaskId && (
          <div className="mt-4 bg-white p-3 rounded-md shadow-sm border border-green-200 flex items-center">
            <div className="mr-3">
              <TaskTimeDisplay 
                task={tasks.find(t => t.id === activeTaskId)!}
                isActive={true}
                size="small"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-700">
                {tasks.find(t => t.id === activeTaskId)?.title} in progress
              </p>
              <p className="text-xs text-gray-500">
                Timer started at {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
              Active Timer
            </div>
          </div>
        )}
      </div>

      {/* Task Actions Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'open'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Open Tasks ({allOpenTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'in-progress'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            In-Progress Tasks ({inProgressTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'completed'
                ? 'text-gray-700 border-b-2 border-gray-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed Tasks ({completedTasks.length})
          </button>
        </div>
        
        <button
          onClick={handleCreateCustomTask}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Custom Task
        </button>
      </div>

      {/* Scheduled Task Reminders */}
      {tasksStartingSoon.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {tasksStartingSoon.map((scheduled, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-3 mb-2 flex items-center">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">{scheduled.task.title}</p>
                <p className="text-xs text-gray-500">
                  {`Starts in ${Math.ceil((scheduled.scheduledTime.getTime() - now.getTime()) / 60000)} minutes`}
                </p>
              </div>
              <button className="ml-3 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Display */}
      {displayedTasks.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            {activeTab === 'open' 
              ? "You don't have any open tasks." 
              : activeTab === 'in-progress' 
                ? "You don't have any tasks in progress." 
                : "You haven't completed any tasks yet."}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {activeTab === 'open' 
              ? "Check back soon or create a custom task." 
              : activeTab === 'in-progress' 
                ? "Start a task to track your progress." 
                : "Complete tasks to earn seeds and rewards."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleted={task.completedBy?.includes(userId) || task.status === 'completed'}
              onComplete={() => handleTaskCardClick(task)}
              userId={userId}
              isDisabled={activeTaskId !== null && activeTaskId !== task.id}
              onTaskStart={handleTaskStart}
              onTaskPause={handleTaskPause}
              activeTaskId={activeTaskId}
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