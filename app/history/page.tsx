// app/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import { db } from '@/app/lib/firebase/config';
import { collection, doc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp, arrayUnion, writeBatch, addDoc, limit } from 'firebase/firestore';
import { VolunteerTask } from '@/app/lib/firebase/firestore';


interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  completionDate: any;
  imageUrl: string;
  summary: string;
  contactInfo: string;
  rating: number;
  feedback?: string;
  timeSpent: number;
  task?: VolunteerTask;
}

const HistoryPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompletion, setSelectedCompletion] = useState<TaskCompletion | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);

            // Fetch completed tasks
            await fetchCompletedTasks(user.uid);
          } else {
            router.push('/auth/onboarding');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/auth/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchCompletedTasks = async (userId: string) => {
    try {
      // Get task completions
      const completionsQuery = query(
        collection(db, 'taskCompletions'),
        where('userId', '==', userId),
        orderBy('completionDate', 'desc')
      );

      const completionsSnapshot = await getDocs(completionsQuery);
      const completions: TaskCompletion[] = [];

      // Get associated tasks
      for (const docSnapshot of completionsSnapshot.docs) {
        const completion = docSnapshot.data() as TaskCompletion;
        completion.id = docSnapshot.id;

        // Get task details
        if (completion.taskId) {
          try {
            const taskDocRef = doc(db, 'tasks', completion.taskId);
            const taskDoc = await getDoc(taskDocRef);
            if (taskDoc.exists()) {
              completion.task = { id: taskDoc.id, ...taskDoc.data() } as VolunteerTask;
            }
          } catch (err) {
            console.error('Error fetching task:', err);
          }
        }

        completions.push(completion);
      }

      setCompletedTasks(completions);
    } catch (err: any) {
      setError('Error fetching task history: ' + err.message);
    }
  };

  // Format elapsed time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Your Volunteering History</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Task History List */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Completed Tasks</h3>

            {completedTasks.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">You haven't completed any tasks yet.</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Find Tasks to Complete
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.map((completion) => (
                  <div
                    key={completion.id}
                    className={`border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow ${selectedCompletion?.id === completion.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                      }`}
                    onClick={() => setSelectedCompletion(completion)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          {completion.task?.title || 'Untitled Task'}
                        </h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {formatDate(completion.completionDate)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {completion.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(completion.timeSpent)}
                        </div>

                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {completion.rating}/5
                        </div>

                        <div className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center">
                          {completion.task?.category === 'communityService' ? 'Community Service' :
                            completion.task?.category === 'environmentalAction' ? 'Environmental' :
                              completion.task?.category === 'educationYouthSupport' ? 'Education' :
                                completion.task?.category === 'healthWellness' ? 'Health' : 'Other'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            {selectedCompletion ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {selectedCompletion.task?.title || 'Untitled Task'}
                </h3>

                <p className="text-gray-500 text-sm mb-4">
                  Completed on {formatDate(selectedCompletion.completionDate)}
                </p>

                {/* Image gallery */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Photos:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCompletion.imageUrl.split(',').map((url, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={url}
                          alt={`Task completion ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Your Summary:</h4>
                  <p className="text-gray-600 text-sm">{selectedCompletion.summary}</p>
                </div>

                {/* Time spent */}
                <div className="mb-4 bg-green-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Time spent:</span>
                    <span className="font-bold text-green-800">{formatTime(selectedCompletion.timeSpent)}</span>
                  </div>
                </div>

                {/* Feedback */}
                {selectedCompletion.feedback && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Your Feedback:</h4>
                    <p className="text-gray-600 text-sm">{selectedCompletion.feedback}</p>
                  </div>
                )}

                {/* Rating */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Your Rating:</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${selectedCompletion.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a task to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Your Stats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Tasks Completed</p>
            <p className="text-2xl font-bold text-green-800">{completedTasks.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Seeds Earned</p>
            <p className="text-2xl font-bold text-green-800">{profile?.seeds || 0}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Time Spent</p>
            <p className="text-2xl font-bold text-green-800">
              {formatTime(completedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0))}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-green-800">
              {completedTasks.length > 0
                ? (completedTasks.reduce((total, task) => total + task.rating, 0) / completedTasks.length).toFixed(1)
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;