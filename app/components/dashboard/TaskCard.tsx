// app/components/dashboard/TaskCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { generateTaskResources, TaskResource } from '@/app/lib/tasks/taskResources';
import TaskDetailModal from './TaskDetailModal';

interface TaskCardProps {
  task: VolunteerTask;
  isCompleted: boolean;
  onComplete: (task: VolunteerTask) => void;
  userId: string;
  isDisabled?: boolean;
  onTaskStart?: (taskId: string) => void;
  onTaskPause?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isCompleted, 
  onComplete, 
  userId,
  isDisabled = false,
  onTaskStart,
  onTaskPause
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const resources = generateTaskResources(task);

  // Check if description is too long
  const isDescriptionLong = task.description.length > 120;
  const truncatedDescription = isDescriptionLong 
    ? `${task.description.substring(0, 120)}...` 
    : task.description;

  // Check if task is in progress
  const isInProgress = task.status === 'in-progress' || task.status === 'paused';
  
  // Get time since scheduled (if applicable)
  useEffect(() => {
    if (task.scheduledTime) {
      const scheduledTime = task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime);
      const now = new Date();
      
      // If scheduled time is in the future, show countdown
      if (scheduledTime > now) {
        const interval = setInterval(() => {
          const timeDiff = scheduledTime.getTime() - new Date().getTime();
          setTimeRemaining(timeDiff > 0 ? timeDiff : 0);
        }, 1000);
        
        return () => clearInterval(interval);
      }
    }
  }, [task.scheduledTime]);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communityService':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'environmentalAction':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'educationYouthSupport':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'healthWellness':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format time remaining
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '';
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden relative ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Expand button */}
      <button 
        onClick={() => setShowDetailModal(true)}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white hover:cursor-pointer"
        title="View details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      </button>

      {/* Scheduled indicator */}
      {task.scheduledTime && timeRemaining !== null && (
        <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatTimeRemaining()}</span>
        </div>
      )}

      {/* Category Banner */}
      <div className={`py-1 px-3 text-sm font-medium ${getCategoryColor(task.category)}`}>
        {task.category === 'communityService' ? 'Community Service' : 
         task.category === 'environmentalAction' ? 'Environmental Action' : 
         task.category === 'educationYouthSupport' ? 'Education & Youth' : 
         'Health & Wellness'}
      </div>
      
      {/* Card Content */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold mb-2 pr-6">{task.title}</h3>
        
        <div className="mb-3">
          {showFullDescription ? (
            <p className="text-gray-600 text-sm">{task.description}</p>
          ) : (
            <p className="text-gray-600 text-sm">{truncatedDescription}</p>
          )}
          
          {isDescriptionLong && (
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs text-green-600 mt-1 hover:underline hover:cursor-pointer"
            >
              {showFullDescription ? 'View Less' : 'View More'}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.estimatedTime < 60 
              ? `${task.estimatedTime} minutes` 
              : `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60 > 0 ? `${task.estimatedTime % 60}m` : ''}`}
          </div>
          
          <div className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {task.locationType === 'remote' ? 'Do from home' : 
             task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'}
          </div>
          
          {task.status && (
            <div className={`text-xs rounded-full px-2 py-1 flex items-center ${
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              task.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              task.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <span>
                {task.status === 'in-progress' ? 'In Progress' :
                 task.status === 'paused' ? 'Paused' :
                 task.status === 'scheduled' ? 'Scheduled' :
                 task.status === 'completed' ? 'Completed' :
                 'Open'}
              </span>
            </div>
          )}
        </div>
        
        {/* Resources Section */}
        {resources.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-1">Helpful Resources:</p>
            <div className="flex flex-wrap gap-1">
              {resources.slice(0, 2).map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline"
                >
                  {resource.title}{index < Math.min(resources.length, 2) - 1 ? ', ' : ''}
                </a>
              ))}
              {resources.length > 2 && (
                <button 
                  onClick={() => setShowDetailModal(true)}
                  className="text-xs text-green-600 hover:underline hover:cursor-pointer"
                >
                  +{resources.length - 2} more
                </button>
              )}
            </div>
          </div>
        )}
        
        {isCompleted ? (
          <div className="bg-green-100 text-green-800 text-center py-2 px-4 rounded-md font-medium text-sm">
            Task Completed
          </div>
        ) : isInProgress ? (
          <button
            onClick={() => onComplete(task)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:cursor-pointer"
          >
            View Progress
          </button>
        ) : (
          <button
            onClick={() => onComplete(task)}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 hover:cursor-pointer"
          >
            Start Task
          </button>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <TaskDetailModal
          task={task}
          resources={resources}
          isCompleted={isCompleted}
          isInProgress={isInProgress}
          onStartTask={() => {
            setShowDetailModal(false);
            onComplete(task);
          }}
          onClose={() => setShowDetailModal(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default TaskCard;