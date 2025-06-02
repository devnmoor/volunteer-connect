// app/components/dashboard/TaskStartModal.tsx
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
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Start Task</h2>
              <p className="text-sm text-gray-600 mt-1">{task.title}</p>
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
            <div className="space-y-4">
              <p className="text-gray-700 mb-6">
                How would you like to start this volunteering task?
              </p>

              {/* Start Timer Now Option */}
              <div 
                onClick={handleStartNow}
                className="border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Start Timer Now</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Begin working on this task immediately. The timer will start and you can track your progress.
                </p>
              </div>

              {/* Schedule for Later Option */}
              <div 
                onClick={() => setShowScheduleForm(true)}
                className="border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Schedule for Later</h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Set a specific date and time to start this task. You'll see a countdown until it begins.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-500 hover:text-gray-700 mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold">Schedule Task</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  min={getMinTime()}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {scheduledDate && scheduledTime && (
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-purple-800">
                    <strong>Scheduled for:</strong> {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    You'll see a countdown timer and can start when the time arrives.
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  disabled={loading || !scheduledDate || !scheduledTime}
                  className={`flex-1 px-4 py-2 ${
                    loading || !scheduledDate || !scheduledTime
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white rounded-md`}
                >
                  {loading ? 'Scheduling...' : 'Schedule Task'}
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