// app/components/dashboard/EnhancedDashboard.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import { getUserTasks, VolunteerTask } from '@/app/lib/firebase/firestore';
import { assignWeeklyTasks } from '@/app/lib/firebase/tasksService';
import { requestLocationPermission } from '@/app/lib/location/locationService';
import TasksList from './TasksList';
import ProgressStats from './ProgressStats';
import SeedCounter from './SeedCounter';
import VolunteerMap from '../map/VolunteerMap';
import LocationPermission from '../auth/LocationPermission';
import EnhancedTaskCompletionModal from './EnhancedTaskCompletionModal';
import CompletionAnimation from './CompletionAnimation';

const EnhancedDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationPromptShown, setLocationPromptShown] = useState(false);
  const [assigningTasks, setAssigningTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [mysteryRewardReceived, setMysteryRewardReceived] = useState<string | null>(null);
  
  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            setProfileImage(userProfile.photoURL || null);
            
            // Get user's tasks
            const userTasks = await getUserTasks(user.uid);
            setTasks(userTasks);
            
            // Check if we need to request location
            if (
              !locationPromptShown && 
              (userProfile.level === 'Bud' || userProfile.level === 'Bloom') &&
              (!userProfile.location || userProfile.location.latitude === 0)
            ) {
              setLocationPromptShown(true);
            }
          } else {
            // Profile not found, redirect to onboarding
            router.push('/auth/onboarding');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated, redirect to login
        router.push('/auth/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle location update
  const handleLocationUpdated = (location?: { latitude: number; longitude: number }) => {
    if (profile && location) {
      setProfile({
        ...profile,
        location
      });
    }
  };

  // Assign weekly tasks if user doesn't have any
  const handleAssignTasks = async () => {
    if (!user || !profile) return;
    
    try {
      setAssigningTasks(true);
      const assignedTasks = await assignWeeklyTasks(user.uid);
      setTasks(assignedTasks);
    } catch (err: any) {
      setError(`Failed to assign tasks: ${err.message}`);
    } finally {
      setAssigningTasks(false);
    }
  };

  useEffect(() => {
    // Auto-assign tasks if user has none
    if (user && profile && tasks.length === 0 && !loading && !assigningTasks) {
      handleAssignTasks();
    }
  }, [user, profile, tasks, loading]);

  // Handle complete task action
  const handleCompleteTask = (task: VolunteerTask) => {
    setSelectedTask(task);
    setShowCompletionModal(true);
  };

  // Handle task start
  const handleTaskStart = (taskId: string) => {
    setActiveTaskId(taskId);
  };
  
  // Handle task pause
  const handleTaskPause = () => {
    setActiveTaskId(null);
  };

  // Handle task completion
  const handleTaskCompleted = () => {
    // Show completion animation
    setShowCompletionAnimation(true);
    
    // After animation finishes, close it
    setTimeout(() => {
      setShowCompletionAnimation(false);
      setMysteryRewardReceived(null);
      
      // Refresh tasks
      if (user) {
        getUserTasks(user.uid).then(updatedTasks => {
          setTasks(updatedTasks);
        });
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <p>Error: {error}</p>
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Location Permission Prompt */}
      {locationPromptShown && (
        <div className="mb-8">
          <LocationPermission 
            userLevel={profile.level} 
            userId={user.uid}
            onLocationUpdated={handleLocationUpdated}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center md:col-span-1">
          <div className="mb-4 relative">
            <div 
              className="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={profile.displayName} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                  profile.level === 'Sprout' ? 'bg-green-400' :
                  profile.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'
                }`}>
                  {profile.displayName.charAt(0)}
                </div>
              )}
              
              {/* Hover overlay */}
              {isHovering && !isUploading && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Level badge */}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
              <img 
                src={`/images/${profile.level.toLowerCase()}-badge.png`} 
                alt={`${profile.level} Badge`} 
                className="w-8 h-8"
              />
            </div>
          </div>
          
          {/* Error message */}
          {uploadError && (
            <div className="text-red-500 text-xs mt-1 mb-2 text-center">
              {uploadError}
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-1">{profile.displayName}</h2>
          <p className="text-gray-600 mb-4">{profile.level} Level</p>
          <SeedCounter seeds={profile.seeds} />
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Progress</h2>
          <ProgressStats 
            total={tasks.length} 
            completed={tasks.filter(task => task.completedBy?.includes(user.uid)).length} 
            level={profile.level}
          />
        </div>
      </div>

      {/* Weekly Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Weekly Volunteering Tasks</h2>
          
          {tasks.length === 0 && !assigningTasks && (
            <button
              onClick={handleAssignTasks}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white text-sm font-medium rounded-md"
            >
              Get New Tasks
            </button>
          )}
        </div>
        
        {assigningTasks ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">Finding the perfect volunteering opportunities for you...</p>
          </div>
        ) : (
          <TasksList
            tasks={tasks}
            userId={user.uid}
            onTaskClick={handleCompleteTask}
            activeTaskId={activeTaskId}
            onTaskStart={handleTaskStart}
            onTaskPause={handleTaskPause}
          />
        )}
      </div>

      {/* Map Section (only for Bud and Bloom levels) */}
      {profile.level !== 'Sprout' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Volunteering Opportunities Near You</h2>
          {profile.location && profile.location.latitude !== 0 ? (
            <div className="h-96">
              <VolunteerMap 
                userLocation={profile.location} 
                userLevel={profile.level}
                userId={user.uid}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">Enable location services to see volunteering opportunities near you.</p>
              <button
                onClick={() => setLocationPromptShown(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white text-sm font-medium rounded-md"
              >
                Enable Location
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Task Completion Modal */}
      {showCompletionModal && selectedTask && (
        <EnhancedTaskCompletionModal
          task={selectedTask}
          userId={user.uid}
          onClose={() => setShowCompletionModal(false)}
          onComplete={handleTaskCompleted}
          onTaskStart={handleTaskStart}
          onTaskPause={handleTaskPause}
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

export default EnhancedDashboard;