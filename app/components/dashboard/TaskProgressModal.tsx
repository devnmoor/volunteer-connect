// app/components/dashboard/TaskProgressModal.tsx
'use client';

import { VolunteerTask } from '@/app/lib/firebase/firestore';

interface PauseEntry {
  timestamp: Date;
  reason: string;
  description: string;
  resumeTimestamp?: Date;
}

interface TaskProgressModalProps {
  task: VolunteerTask;
  pauseEntries: PauseEntry[];
  onClose: () => void;
  onResume: () => void;
}

const TaskProgressModal: React.FC<TaskProgressModalProps> = ({
  task,
  pauseEntries,
  onClose,
  onResume
}) => {
  // Calculate remaining time
  const getRemainingTime = () => {
    const totalTime = (task.estimatedTime || 60) * 60; // Convert to seconds
    const elapsedTime = task.timeSpent || 0;
    return Math.max(totalTime - elapsedTime, 0);
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

  const remainingTime = getRemainingTime();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Task Progress</h2>
              <p className="text-gray-600 mt-1">{task.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Time Status */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-800">Time Remaining</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {formatTime(remainingTime)}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(((task.timeSpent || 0) / ((task.estimatedTime || 60) * 60)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-blue-700 mt-1">
                <span>Elapsed: {formatTime(task.timeSpent || 0)}</span>
                <span>Total: {formatTime((task.estimatedTime || 60) * 60)}</span>
              </div>
            </div>
          </div>

          {/* Task Status */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                task.status === 'paused' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <span className="font-medium text-gray-700">
                Status: <span className={`${
                  task.status === 'paused' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {task.status === 'paused' ? 'Paused' : 'In Progress'}
                </span>
              </span>
            </div>
          </div>

          {/* Pause Entries */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Pause History</h3>
            
            {pauseEntries.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No pause entries yet</p>
                <p className="text-sm text-gray-400">Your pause history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pauseEntries.map((entry, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-400"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-gray-800">
                          Pause #{index + 1}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="ml-7">
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Reason:</span> {entry.reason}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                      
                      {entry.resumeTimestamp && (
                        <div className="flex items-center text-sm text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          Resumed: {new Date(entry.resumeTimestamp).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Task Details</h4>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {task.category === 'communityService' ? 'Community Service' : 
                 task.category === 'environmentalAction' ? 'Environmental Action' : 
                 task.category === 'educationYouthSupport' ? 'Education & Youth' : 
                 'Health & Wellness'}
              </span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {task.locationType === 'remote' ? 'Remote' : 
                 task.locationType === 'inPerson' ? 'In-person' : 'Virtual'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          
          <button
            onClick={onResume}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Resume Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressModal;