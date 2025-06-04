// app/components/dashboard/TaskStartModal.tsx - Enhanced version
'use client';

import { useState } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';

interface TaskStartModalProps {
  task: VolunteerTask;
  onClose: () => void;
  onStartTimer: (taskId: string) => void;
  onScheduled: () => void;
}

const TaskStartModal: React.FC<TaskStartModalProps> = ({ 
  task, 
  onClose, 
  onStartTimer,
  onScheduled 
}) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time if date is today
  const getMinTime = () => {
    if (scheduledDate === getMinDate()) {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    }
    return '';
  };

  const handleStartNow = () => {
    onStartTimer(task.id!);
    onClose();
  };

  const handleScheduleSubmit = async () => {
    if (!scheduledDate || !scheduledTime) {
      setError('Please select both date and time');
      return;
    }

    // Check if scheduled time is in the future
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    
    if (scheduledDateTime <= now) {
      setError('Please select a future date and time');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update task with scheduled time
      const taskRef = doc(db, 'tasks', task.id!);
      await updateDoc(taskRef, {
        scheduledTime: scheduledDateTime,
        status: 'scheduled',
        updatedAt: serverTimestamp()
      });

      onScheduled();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Start Your Task</h2>
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

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {!showScheduleForm ? (
            <div>
              <p className="text-gray-700 mb-6">
                How would you like to start this volunteering task?
              </p>

              <div className="space-y-4">
                {/* Start Timer Now Option */}
                <div 
                  onClick={handleStartNow}
                  className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all group"
                >
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-3 mr-4 group-hover:bg-green-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Start Timer Now</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Begin working on this task immediately. The timer will start and you can track your progress 
                        in real-time. Perfect for when you're ready to dive in right away.
                      </p>
                      <div className="mt-3 flex items-center text-sm text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Click to start immediately
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule for Later Option */}
                <div 
                  onClick={() => setShowScheduleForm(true)}
                  className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all group"
                >
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Schedule for Later</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Set a specific date and time to start this task. You'll see a countdown until it begins, 
                        and can start the timer when the scheduled time arrives.
                      </p>
                      <div className="mt-3 flex items-center text-sm text-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Click to set schedule
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task info */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Task Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Estimated Time:</span>
                    <span className="ml-2 font-medium">
                      {task.estimatedTime < 60 
                        ? `${task.estimatedTime} minutes` 
                        : `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60 > 0 ? `${task.estimatedTime % 60}m` : ''}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-2 font-medium">
                      {task.locationType === 'remote' ? 'Remote' : 
                       task.locationType === 'inPerson' ? 'In-person' : 'Virtual'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Schedule Form
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-500 hover:text-gray-700 mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold">Schedule Your Task</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    min={getMinTime()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {scheduledDate && scheduledTime && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-purple-800">
                        Scheduled for: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        You'll see a countdown timer and can start when the time arrives.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  disabled={loading || !scheduledDate || !scheduledTime}
                  className={`flex-1 px-4 py-2 rounded-md font-medium ${
                    loading || !scheduledDate || !scheduledTime
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </div>
                  ) : (
                    'Schedule Task'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskStartModal;