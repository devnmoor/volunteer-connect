// app/components/dashboard/TasksList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from './TaskCard';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import Link from 'next/link';

interface TasksListProps {
  tasks: VolunteerTask[];
  userId: string;
  onTaskClick: (task: VolunteerTask) => void;
  activeTaskId: string | null;
  onTaskStart: (taskId: string) => void;
  onTaskPause: () => void;
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
  const [scheduledTasks, setScheduledTasks] = useState<{
    task: VolunteerTask;
    scheduledTime: Date;
  }[]>([]);
  
  // Group tasks by status
  const openTasks = tasks.filter(task => 
    !task.completedBy?.includes(userId) && 
    (!task.status || task.status === 'open' || task.status === 'scheduled')
  );
  
  const inProgressTasks = tasks.filter(task => 
    !task.completedBy?.includes(userId) && 
    (task.status === 'in-progress' || task.status === 'paused')
  );
  
  const completedTasks = tasks.filter(task => 
    task.completedBy?.includes(userId) || 
    task.status === 'completed'
  );

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
    activeTab === 'open' ? openTasks :
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
              className="h-full bg-green-500 rounded-full transition-all duration-300" 
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
              <svg width="32" height="32" viewBox="0 0 48 48" className="animate-pulse">
                <circle cx="24" cy="24" r="22" fill="white" stroke="#10B981" strokeWidth="2" />
                <circle cx="24" cy="24" r="1.5" fill="#065F46" />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-700">
                {tasks.find(t => t.id === activeTaskId)?.title} in progress
              </p>
              <p className="text-xs text-gray-500">
                Task timer is running
              </p>
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
            Open Tasks
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'in-progress'
                ? 'text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            In-Progress Tasks
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'completed'
                ? 'text-gray-700 border-b-2 border-gray-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed Tasks
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
        <div className="fixed top-20 right-4 z-50">
          {tasksStartingSoon.map((scheduled, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-3 mb-2 flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">{scheduled.task.title}</p>
                <p className="text-xs text-gray-500">
                  {`Starts in ${Math.ceil((scheduled.scheduledTime.getTime() - now.getTime()) / 60000)} minutes`}
                </p>
              </div>
              <button 
                onClick={() => onTaskClick(scheduled.task)}
                className="ml-3 text-gray-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
              onComplete={() => onTaskClick(task)}
              userId={userId}
              isDisabled={activeTaskId !== null && activeTaskId !== task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;