// app/components/dashboard/EnhancedTaskCompletionModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import PauseReasonModal from './PauseReasonModal';
import { storage } from '@/app/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EnhancedTaskCompletionModalProps {
  task: VolunteerTask;
  userId: string;
  onClose: () => void;
  onComplete: () => void;
  onTaskStart: (taskId: string) => void;
  onTaskPause: () => void;
}

const EnhancedTaskCompletionModal: React.FC<EnhancedTaskCompletionModalProps> = ({ 
  task, 
  userId, 
  onClose,
  onComplete,
  onTaskStart,
  onTaskPause
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [timerVisible, setTimerVisible] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timeSpent, setTimeSpent] = useState(task.timeSpent || 0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
  const [calendarType, setCalendarType] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>(task.images || []);
  const [taskStatus, setTaskStatus] = useState(task.completedBy?.includes(userId) ? 'completed' : task.status || 'open');
  const [pauseData, setPauseData] = useState<{
    pauseTime: Date;
    resumeTime?: Date;
    reason: string;
    description: string;
  }[]>(task.pauseData || []);
  const [timerWindowExpired, setTimerWindowExpired] = useState(false);
  const [windowTimerId, setWindowTimerId] = useState<NodeJS.Timeout | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if the scheduled time has arrived and if we're within the 10-minute window
  const isTimerEnabled = () => {
    if (!scheduledDateTime) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - scheduledDateTime.getTime();
    
    // Enable if scheduled time has passed but not more than 10 minutes ago
    return timeDiff >= 0 && timeDiff <= 10 * 60 * 1000;
  };
  
  // Check if task is scheduled and we're in the window
  useEffect(() => {
    if (task.scheduledTime && task.status === 'scheduled') {
      const scheduledTime = task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime);
      setScheduledDateTime(scheduledTime);
      
      const now = new Date();
      const timeDiff = now.getTime() - scheduledTime.getTime();
      
      // If scheduled time has already passed and we're still within 10 minutes
      if (timeDiff >= 0 && timeDiff <= 10 * 60 * 1000) {
        // Set a timer to disable the button after 10 minutes
        const remainingWindowTime = 10 * 60 * 1000 - timeDiff;
        
        const windowTimer = setTimeout(() => {
          setTimerWindowExpired(true);
        }, remainingWindowTime);
        
        setWindowTimerId(windowTimer);
      } else if (timeDiff > 10 * 60 * 1000) {
        // Window already expired
        setTimerWindowExpired(true);
      } else if (timeDiff < 0) {
        // Scheduled time is in the future
        const timeUntilScheduled = Math.abs(timeDiff);
        
        // Set a timer to enable the button at scheduled time
        const scheduleTimer = setTimeout(() => {
          // Schedule another timer for the 10-minute window
          const windowTimer = setTimeout(() => {
            setTimerWindowExpired(true);
          }, 10 * 60 * 1000);
          
          setWindowTimerId(windowTimer);
        }, timeUntilScheduled);
        
        // Clean up on unmount
        return () => {
          clearTimeout(scheduleTimer);
          if (windowTimerId) clearTimeout(windowTimerId);
        };
      }
    }
    
    return () => {
      if (windowTimerId) clearTimeout(windowTimerId);
    };
  }, [task.scheduledTime, task.status]);
  
  // Start timer function
  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      setTaskStatus('in-progress');
      onTaskStart(task.id!);
      
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
      onTaskPause();
    }
  };
  
  // Update task status in Firestore
  const updateTaskStatus = async (status: string) => {
    try {
      if (!task.id) return;
      
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: status,
        timeSpent: timeSpent,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Complete task now
  const completeTaskNow = async () => {
    try {
      if (!task.id) return;
      
      // Create update data
      const updateData = {
        completedBy: arrayUnion(userId),
        completionDate: serverTimestamp(),
        timeSpent: timeSpent,
        status: 'completed',
        images: uploadedImages
      };
      
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, updateData);
      
      // Add a seed to the user's account
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        seeds: increment(1),
        completedTasks: increment(1)
      });
      
      // Call the callback
      onComplete();
      
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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !task.id) return;
    
    try {
      const file = e.target.files[0];
      
      // Create a storage reference
      const storageRef = ref(storage, `task-images/${task.id}/${Date.now()}-${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Add to uploaded images array
      setUploadedImages(prev => [...prev, downloadURL]);
      
      // Update the task in Firestore with the new image
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        images: arrayUnion(downloadURL)
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    // In a full implementation, you would also remove from storage
    // and update the Firestore document
  };
  
  // Handle calendar selection
  const handleCalendarExport = (type: string) => {
    setCalendarType(type);
    // In a real app, you would generate the appropriate calendar file
  };

  // Handle confirmation
  const handleConfirmation = async (addToCalendar: boolean) => {
    setShowConfirmationModal(false);
    
    if (!scheduledDateTime || !task.id) return;
    
    try {
      // Update task with scheduled time in Firestore
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        scheduledTime: scheduledDateTime,
        status: 'scheduled'
      });
      
      setTaskStatus('scheduled');
      
      // If scheduled time is now or in the past, start timer immediately
      const now = new Date();
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
      
      // If user wants to add to calendar, handle that
      if (addToCalendar && calendarType) {
        // In a real app, generate and download the calendar file
        alert(`Adding to ${calendarType} calendar would happen here.`);
      }
    } catch (error) {
      console.error('Error scheduling task:', error);
    }
    
    // Close the modal
    onClose();
  };
  
  // Handle pause reason submission
  const handlePauseReasonSubmit = async (reason: string, description: string) => {
    const pauseInfo = {
      pauseTime: new Date(),
      reason,
      description
    };
    
    const updatedPauseData = [...pauseData, pauseInfo];
    setPauseData(updatedPauseData);
    setShowPauseReasonModal(false);
    
    // Update task with pause information in Firestore
    try {
      if (!task.id) return;
      
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        pauseData: updatedPauseData,
        status: 'paused',
        timeSpent: timeSpent
      });
      
      setTaskStatus('paused');
    } catch (error) {
      console.error('Error updating task pause data:', error);
    }
  };
  
  // Resume timer
  const resumeTimer = async () => {
    // Update the last pause entry with resume time
    if (pauseData.length > 0) {
      const updatedPauseData = [...pauseData];
      const lastIndex = updatedPauseData.length - 1;
      updatedPauseData[lastIndex] = {
        ...updatedPauseData[lastIndex],
        resumeTime: new Date()
      };
      
      setPauseData(updatedPauseData);
      
      // Update in Firestore
      try {
        if (!task.id) return;
        
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, {
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
      if (windowTimerId) {
        clearTimeout(windowTimerId);
      }
    };
  }, [timerIntervalId, windowTimerId]);

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
                  
                  <button
                    onClick={handleScheduleTask}
                    className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                  >
                    Schedule Task
                  </button>
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
                    disabled={taskStatus === 'scheduled' && !isTimerEnabled()}
                    className={`mt-3 w-full py-2 ${
                      taskStatus === 'scheduled' && !isTimerEnabled() 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white rounded-md text-sm`}
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
                    className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
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
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
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
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!scheduledDate || !scheduledTime}
                className={`px-4 py-2 ${!scheduledDate || !scheduledTime ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-md`}
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
              Your task has been scheduled for {scheduledDateTime?.toLocaleDateString()} at {scheduledDateTime?.toLocaleTimeString()}. 
              Would you like to add it to your calendar?
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleCalendarExport('Google')}
                className="p-3 border rounded-md hover:bg-gray-50 text-center"
              >
                Google Calendar
              </button>
              <button
                onClick={() => handleCalendarExport('Outlook')}
                className="p-3 border rounded-md hover:bg-gray-50 text-center"
              >
                Outlook
              </button>
              <button
                onClick={() => handleCalendarExport('iCal')}
                className="p-3 border rounded-md hover:bg-gray-50 text-center"
              >
                Apple Calendar
              </button>
              <button
                onClick={() => handleCalendarExport('Other')}
                className="p-3 border rounded-md hover:bg-gray-50 text-center"
              >
                Other
              </button>
            </div>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Skip
              </button>
              
              <button
                onClick={() => handleConfirmation(true)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add to Calendar
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              You'll receive a notification when it's time to start your task. 
              You'll have 10 minutes to start the timer once the scheduled time arrives.
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
                className={`text-xs ${timerActive ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
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
          
          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="flex space-x-1 overflow-x-auto max-w-xs">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="h-10 w-10 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {timerActive ? (
            <button
              onClick={stopTimer}
              className="ml-2 p-2 bg-yellow-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-yellow-600"
              title="Pause Timer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              className="ml-2 p-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-600"
              title="Resume Timer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={completeTaskNow}
            className="ml-2 p-2 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-700"
            title="Complete Task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default EnhancedTaskCompletionModal;