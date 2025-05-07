// app/components/dashboard/TaskCompletionModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import PauseReasonModal from './PauseReasonModal';

interface TaskCompletionModalProps {
  task: VolunteerTask;
  userId: string;
  onClose: () => void;
  onComplete: () => void;
}

const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({ 
  task, 
  userId, 
  onClose,
  onComplete
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
  const [calendarType, setCalendarType] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState(task.completedBy?.includes(userId) ? 'completed' : 'open');
  const [pauseData, setPauseData] = useState<{
    pauseTime: Date;
    resumeTime?: Date;
    reason: string;
    description: string;
  }[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Start timer function
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      setTaskStatus('in-progress');
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimerIntervalId(interval);
      
      // Update task status in Firestore
      updateTaskStatus('in-progress');
    }
  };

  // Stop timer function
  const stopTimer = () => {
    if (timerActive && timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerActive(false);
      setShowPauseReasonModal(true);
    }
  };
  
  // Update task status in Firestore
  const updateTaskStatus = async (status: string) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: status,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Complete task now
  const completeTaskNow = async () => {
    try {
      // Create update data
      const updateData = {
        completedBy: arrayUnion(userId),
        completionDate: serverTimestamp(),
        status: 'completed'
      };
      
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, updateData);
      
      // Add a seed to the user's account
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        seeds: increment(1)
      });
      
      // Call the callback
      onComplete();
      
      // Show completion animation (this will be handled in the parent component)
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Schedule task
  const handleScheduleTask = () => {
    setShowScheduleModal(true);
  };

  // Handle submit schedule
  const handleSubmit = () => {
    if (!scheduledDate || !scheduledTime) return;
    
    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    setScheduledDateTime(dateTime);
    setShowScheduleModal(false);
    setShowConfirmationModal(true);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      // In a real app, you would upload these to storage
      // For now, we'll just create URLs
      const newImages = Array.from(e.target.files).map(file => 
        URL.createObjectURL(file)
      );
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle calendar selection
  const handleCalendarSelect = (type: string) => {
    setCalendarType(type);
    // In a real app, you would generate the appropriate calendar link/file
    // For now, we'll just store the type
  };

  // Handle confirmation
  const handleConfirmation = (addToCalendar: boolean) => {
    setShowConfirmationModal(false);
    
    if (!scheduledDateTime) return;
    
    // Create Date object from scheduled date/time
    const now = new Date();
    
    // Update task with scheduled time in Firestore
    try {
      const taskRef = doc(db, 'tasks', task.id);
      updateDoc(taskRef, {
        scheduledTime: scheduledDateTime,
        status: 'scheduled'
      });
      
      setTaskStatus('scheduled');
      
      // If scheduled time is now or in the past, start timer immediately
      if (scheduledDateTime <= now) {
        setTimerVisible(true);
        startTimer();
      } else {
        // Set a timeout to start the timer at the scheduled time
        const timeUntilStart = scheduledDateTime.getTime() - now.getTime();
        setTimeout(() => {
          setTimerVisible(true);
          startTimer();
        }, timeUntilStart);
      }
    } catch (error) {
      console.error('Error updating task schedule:', error);
    }
    
    // Close the modal
    onClose();
  };
  
  // Handle pause reason submission
  const handlePauseReasonSubmit = (reason: string, description: string) => {
    const pauseInfo = {
      pauseTime: new Date(),
      reason,
      description
    };
    
    setPauseData(prev => [...prev, pauseInfo]);
    setShowPauseReasonModal(false);
    
    // Update task with pause information in Firestore
    try {
      const taskRef = doc(db, 'tasks', task.id);
      updateDoc(taskRef, {
        pauseData: arrayUnion(pauseInfo),
        status: 'paused'
      });
      
      setTaskStatus('paused');
    } catch (error) {
      console.error('Error updating task pause data:', error);
    }
  };
  
  // Resume timer
  const resumeTimer = () => {
    // Update the last pause entry with resume time
    const updatedPauseData = [...pauseData];
    if (updatedPauseData.length > 0) {
      const lastIndex = updatedPauseData.length - 1;
      updatedPauseData[lastIndex] = {
        ...updatedPauseData[lastIndex],
        resumeTime: new Date()
      };
      
      setPauseData(updatedPauseData);
      
      // Update in Firestore
      try {
        const taskRef = doc(db, 'tasks', task.id);
        updateDoc(taskRef, {
          pauseData: updatedPauseData,
          status: 'in-progress'
        });
        
        setTaskStatus('in-progress');
      } catch (error) {
        console.error('Error updating task resume data:', error);
      }
    }
    
    // Start timer again
    startTimer();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [timerIntervalId]);
  
  // Check if start timer should be enabled
  const isStartTimerEnabled = () => {
    if (!scheduledDateTime) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - scheduledDateTime.getTime();
    
    // Enable if scheduled time has passed but not more than 10 minutes ago
    return timeDiff >= 0 && timeDiff <= 10 * 60 * 1000;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {taskStatus === 'completed' ? 'Task Completed: ' : 'Complete Task: '}
              {task.title}
            </h2>
            
            <div className="mb-4 px-3 py-2 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Status: <span className={`font-semibold ${
                  taskStatus === 'completed' ? 'text-green-600' : 
                  taskStatus === 'in-progress' ? 'text-blue-600' :
                  taskStatus === 'paused' ? 'text-yellow-600' :
                  taskStatus === 'scheduled' ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {taskStatus === 'completed' ? 'Completed' : 
                   taskStatus === 'in-progress' ? 'In Progress' :
                   taskStatus === 'paused' ? 'Paused' :
                   taskStatus === 'scheduled' ? 'Scheduled' : 'Open'}
                </span>
              </p>
            </div>
            
            {taskStatus !== 'completed' && (
              <p className="text-gray-700 mb-6">
                Ready to complete this volunteer task? You can either:
              </p>
            )}
            
            {taskStatus !== 'completed' && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Schedule Task</h3>
                      <p className="text-gray-600 text-sm">
                        Schedule this task for a specific time. You'll get a reminder when it's time to start.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={handleScheduleTask}
                      className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 hover:cursor-pointer text-white rounded-md text-sm group"
                    >
                      Schedule Task
                    </button>
                    <div className="hidden group-hover:flex absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md p-2 z-10 justify-around">
                      <button 
                        onClick={() => handleCalendarSelect('google')}
                        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Google
                      </button>
                      <button 
                        onClick={() => handleCalendarSelect('outlook')}
                        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Outlook
                      </button>
                      <button 
                        onClick={() => handleCalendarSelect('ical')}
                        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                      >
                        iCal
                      </button>
                      <button 
                        onClick={() => handleCalendarSelect('office365')}
                        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Office365
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Start Timer</h3>
                      <p className="text-gray-600 text-sm">
                        Start a timer to track the time you spend on this task. The timer will help you log your volunteer hours.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTimerVisible(true);
                      startTimer();
                      onClose();
                    }}
                    disabled={!isStartTimerEnabled()}
                    className={`mt-3 w-full py-2 ${isStartTimerEnabled() ? 'bg-blue-600 hover:bg-blue-700 hover:cursor-pointer' : 'bg-blue-300 cursor-not-allowed'} text-white rounded-md text-sm`}
                  >
                    Start Timer
                  </button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Complete Now</h3>
                      <p className="text-gray-600 text-sm">
                        Mark this task as completed right now. Use this option if you've already finished the task.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={completeTaskNow}
                    disabled={!isStartTimerEnabled()}
                    className={`mt-3 w-full py-2 ${isStartTimerEnabled() ? 'bg-green-600 hover:bg-green-700 hover:cursor-pointer' : 'bg-green-300 cursor-not-allowed'} text-white rounded-md text-sm`}
                  >
                    Complete Now
                  </button>
                </div>
              </div>
            )}
            
            {taskStatus === 'completed' && (
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-green-800 mb-2">Task Already Completed!</h3>
                <p className="text-green-700">
                  You've already completed this task successfully.
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Task</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!scheduledDate || !scheduledTime}
                className={`px-4 py-2 ${!scheduledDate || !scheduledTime ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer'} rounded-md`}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Task Scheduled!</h3>
            
            <p className="text-gray-700 mb-6">
              Your task has been scheduled successfully. Would you like to add it to your calendar?
            </p>
            
            <div className="flex justify-between space-x-4 mb-6">
              <button
                onClick={() => handleConfirmation(true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer"
              >
                Yes, add to calendar
              </button>
              
              <button
                onClick={() => handleConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:cursor-pointer"
              >
                No, thanks
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              Note: The timer for this task will start automatically at the scheduled time. You'll have 10 minutes to start the timer once the scheduled time arrives.
            </p>
          </div>
        </div>
      )}

      {/* Pause Reason Modal */}
      {showPauseReasonModal && (
        <PauseReasonModal 
          onSubmit={handlePauseReasonSubmit}
          onResume={resumeTimer}
        />
      )}

      {/* Floating Timer */}
      {timerVisible && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 z-[70] flex items-center space-x-3">
          <div className="relative w-12 h-12">
            {/* SVG Clock */}
            <svg width="48" height="48" viewBox="0 0 48 48">
              {/* Clock face */}
              <circle cx="24" cy="24" r="22" fill="white" stroke="#10B981" strokeWidth="2" />
              
              {/* Clock ticks */}
              {[...Array(12)].map((_, i) => (
                <line 
                  key={i}
                  x1="24" 
                  y1="4" 
                  x2="24" 
                  y2="8"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 30} 24 24)`}
                />
              ))}
              
              {/* Hour hand */}
              <line 
                x1="24" 
                y1="24" 
                x2="24" 
                y2="12"
                stroke="#065F46"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${(timeSpent / 43200) * 360} 24 24)`}
              />
              
              {/* Minute hand */}
              <line 
                x1="24" 
                y1="24" 
                x2="24" 
                y2="8"
                stroke="#059669"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${(timeSpent / 3600) * 360} 24 24)`}
              />
              
              {/* Second hand */}
              <line 
                x1="24" 
                y1="26" 
                x2="24" 
                y2="7"
                stroke="#EF4444"
                strokeWidth="1"
                strokeLinecap="round"
                transform={`rotate(${(timeSpent % 60) * 6} 24 24)`}
              />
              
              {/* Center dot */}
              <circle cx="24" cy="24" r="1.5" fill="#065F46" />
            </svg>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700">{task.title}</div>
            <div className="font-bold text-green-800">
              {Math.floor(timeSpent / 3600)}h {Math.floor((timeSpent % 3600) / 60)}m {timeSpent % 60}s
            </div>
            
            {/* Image Upload Button */}
            <div className="mt-1 flex items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`text-xs ${timerActive ? 'text-blue-600 hover:underline hover:cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                disabled={!timerActive}
              >
                Upload Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={!timerActive}
              />
            </div>
          </div>
          
          {timerActive ? (
            <button
              onClick={stopTimer}
              className="ml-2 p-2 bg-yellow-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-yellow-600 hover:cursor-pointer"
              title="Pause Timer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              className="ml-2 p-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-600 hover:cursor-pointer"
              title="Resume Timer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default TaskCompletionModal;