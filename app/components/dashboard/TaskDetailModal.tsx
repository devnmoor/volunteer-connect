// app/components/dashboard/TaskDetailModal.tsx - Fixed version for date handling and optional properties

// Fix for the lines with Date.toDate() errors
// The issue is that we're treating Date objects as if they were Firestore Timestamps
// Let's create a helper function to safely handle both:

import { useState } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { TaskResource } from '@/app/lib/tasks/taskResources';

interface TaskDetailModalProps {
  task: VolunteerTask;
  resources: TaskResource[];
  isCompleted: boolean;
  isInProgress?: boolean;
  onStartTask: () => void;
  onClose: () => void;
  userId: string;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  resources,
  isCompleted,
  isInProgress = false,
  onStartTask,
  onClose,
  userId
}) => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  // Helper function to safely format dates from either Date objects or Firestore Timestamps
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return 'Not specified';
    
    // Create a JavaScript Date object, handling both regular Date objects and Firestore Timestamps
    let date: Date;
    if (typeof dateValue.toDate === 'function') {
      // It's a Firestore Timestamp
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      // It's already a Date object
      date = dateValue;
    } else {
      // It might be a string or number, try to convert
      date = new Date(dateValue);
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Helper function to safely format time from either Date objects or Firestore Timestamps
  const formatTime = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // Create a JavaScript Date object, handling both regular Date objects and Firestore Timestamps
    let date: Date;
    if (typeof dateValue.toDate === 'function') {
      // It's a Firestore Timestamp
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      // It's already a Date object
      date = dateValue;
    } else {
      // It might be a string or number, try to convert
      date = new Date(dateValue);
    }
    
    return date.toLocaleTimeString();
  };
  
  // Format address if available
  const formatAddress = () => {
    if (!task.location) return 'Remote / Not specified';
    
    if (task.location.address) return task.location.address;
    
    if (task.location.coordinates) {
      return `(${task.location.coordinates.latitude.toFixed(4)}, ${task.location.coordinates.longitude.toFixed(4)})`;
    }
    
    return 'Location not specified';
  };

  // Handle calendar export
  const handleCalendarExport = (type: string) => {
    // In a real implementation, you would generate the appropriate calendar file
    alert(`Exporting to ${type} calendar. This would download a calendar file in a real implementation.`);
    setShowCalendarOptions(false);
  };

  // Format time spent (handle undefined value)
  const formatTimeSpent = (seconds?: number): string => {
    if (seconds === undefined || seconds <= 0) return 'None';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-t">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 pr-8">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex mt-4 border-b">
            <button
              onClick={() => setSelectedTab('details')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === 'details'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setSelectedTab('resources')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === 'resources'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setSelectedTab('history')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === 'history'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setSelectedTab('status')}
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === 'status'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Status
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          {selectedTab === 'details' && (
            <div>
              <div className="mb-6">
                <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <p className="text-gray-900">
                    {task.category === 'communityService' ? 'Community Service' : 
                     task.category === 'environmentalAction' ? 'Environmental Action' : 
                     task.category === 'educationYouthSupport' ? 'Education & Youth Support' : 
                     'Health & Wellness'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Time</h3>
                  <p className="text-gray-900">
                    {task.estimatedTime < 60 
                      ? `${task.estimatedTime} minutes` 
                      : `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60 > 0 ? `${task.estimatedTime % 60}m` : ''}`}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location Type</h3>
                  <p className="text-gray-900">
                    {task.locationType === 'remote' ? 'Remote (do from home)' : 
                     task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Address / Location</h3>
                  <p className="text-gray-900">{formatAddress()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date Added</h3>
                  <p className="text-gray-900">{formatDate(task.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <p className={`font-medium ${
                    isCompleted ? 'text-green-600' : 
                    isInProgress ? 'text-blue-600' :
                    task.status === 'paused' ? 'text-yellow-600' :
                    task.status === 'scheduled' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {isCompleted ? 'Completed' : 
                     isInProgress ? 'In Progress' :
                     task.status === 'paused' ? 'Paused' :
                     task.status === 'scheduled' ? 'Scheduled' : 'Open'}
                  </p>
                </div>
              </div>
              
              {task.impact && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Impact</h3>
                  <p className="text-gray-700">{task.impact}</p>
                </div>
              )}
              
              {task.requirements && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Requirements</h3>
                  <p className="text-gray-700">{task.requirements}</p>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'resources' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Helpful Resources</h3>
              
              {resources.length === 0 ? (
                <p className="text-gray-500">No resources available for this task.</p>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                      )}
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline inline-flex items-center"
                      >
                        Visit Resource
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity History</h3>
              
              {task.pauseData && task.pauseData.length > 0 ? (
                <div className="space-y-4">
                  {task.pauseData.map((pause, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Task Paused</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(pause.pauseTime)} at {formatTime(pause.pauseTime)}
                          </p>
                        </div>
                        {pause.resumeTime && (
                          <div className="text-right">
                            <h4 className="font-medium text-green-600">Resumed</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(pause.resumeTime)} at {formatTime(pause.resumeTime)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Reason: {pause.reason}</p>
                        <p className="text-sm text-gray-600 mt-1">{pause.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No activity recorded for this task yet.</p>
              )}
              
              {isCompleted && task.completionDate && (
                <div className="mt-4 border-l-4 border-green-400 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Task Completed</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(task.completionDate)} at {formatTime(task.completionDate)}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'status' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    isCompleted ? 'bg-green-500' : 
                    isInProgress ? 'bg-blue-500' :
                    task.status === 'paused' ? 'bg-yellow-500' :
                    task.status === 'scheduled' ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></div>
                  <h4 className="font-medium">Current Status:</h4>
                  <span className={`ml-2 ${
                    isCompleted ? 'text-green-600' : 
                    isInProgress ? 'text-blue-600' :
                    task.status === 'paused' ? 'text-yellow-600' :
                    task.status === 'scheduled' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {isCompleted ? 'Completed' : 
                     isInProgress ? 'In Progress' :
                     task.status === 'paused' ? 'Paused' :
                     task.status === 'scheduled' ? 'Scheduled' : 'Open'}
                  </span>
                </div>
                
                {task.scheduledTime && (
                  <div className="ml-5 text-sm text-gray-600">
                    Scheduled for: {formatDate(task.scheduledTime)} at {formatTime(task.scheduledTime)}
                  </div>
                )}
                
                {task.timeSpent !== undefined && task.timeSpent > 0 && (
                  <div className="ml-5 text-sm text-gray-600">
                    Time spent: {formatTimeSpent(task.timeSpent)}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Task Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${task.createdAt ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Created</span>
                    {task.createdAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(task.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${task.scheduledTime ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Scheduled</span>
                    {task.scheduledTime && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(task.scheduledTime)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${task.status === 'in-progress' || task.status === 'paused' || isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Started</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Completed</span>
                    {isCompleted && task.completionDate && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(task.completionDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            {task.isCustom && (
              <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                Custom Task
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            
            {!isCompleted && (
              <div className="relative">
                <button
                  onClick={onStartTask}
                  className={`px-4 py-2 ${
                    isInProgress 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white rounded`}
                >
                  {isInProgress ? 'View Progress' : 'Start Task'}
                </button>
                
                {/* Calendar Options Dropdown */}
                {!isInProgress && !isCompleted && (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowCalendarOptions(true)}
                      onMouseLeave={() => setShowCalendarOptions(false)}
                      className="absolute -top-10 right-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                    >
                      Schedule Task
                    </button>
                    
                    {showCalendarOptions && (
                      <div 
                        className="absolute -top-10 right-full mr-1 bg-white shadow-lg rounded-md overflow-hidden z-10"
                        onMouseEnter={() => setShowCalendarOptions(true)}
                        onMouseLeave={() => setShowCalendarOptions(false)}
                      >
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleCalendarExport('Google')}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                          >
                            Google Calendar
                          </button>
                          <button
                            onClick={() => handleCalendarExport('Outlook')}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                          >
                            Outlook
                          </button>
                          <button
                            onClick={() => handleCalendarExport('iCal')}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                          >
                            iCal
                          </button>
                          <button
                            onClick={() => handleCalendarExport('Office365')}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap"
                          >
                            Office365
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;