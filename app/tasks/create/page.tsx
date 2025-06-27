// app/tasks/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase/config';
import Link from 'next/link';

const CreateTaskPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('communityService');
  const [locationType, setLocationType] = useState('remote');
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to create a task');
      }
      
      // Create location object
      const location: any = {};
      if (locationType === 'inPerson' && address) {
        location.address = address;
        // In a real app, you'd geocode the address to get coordinates
        // For now, just add some placeholder coordinates
        location.coordinates = {
          latitude: 0,
          longitude: 0
        };
      }
      
      // Create the task
      const taskData = {
        title,
        description,
        category,
        locationType,
        estimatedTime: parseInt(estimatedTime.toString()),
        location: Object.keys(location).length > 0 ? location : null,
        createdBy: user.uid,
        assignedTo: user.uid, // Assign to the user who created it
        isAssigned: true,     // Mark as assigned
        isCustom: true,       // Mark as custom task
        status: 'open',       // Initial status is open
        completedBy: [],      // No one has completed it yet
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add to Firestore
      await addDoc(collection(db, 'tasks'), taskData);
      
      // Navigate back to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-2xl">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/dashboard" className="text-green-600 hover:text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Custom Volunteer Task</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Give your task a clear, descriptive title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
                placeholder="Describe what this volunteer task involves..."
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="communityService">Community Service</option>
                <option value="environmentalAction">Environmental Action</option>
                <option value="educationYouthSupport">Education & Youth Support</option>
                <option value="healthWellness">Health & Wellness</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Type
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="remote">Do from home</option>
                <option value="inPerson">In-person</option>
                <option value="virtual">Virtual meeting</option>
              </select>
            </div>
            
            {locationType === 'inPerson' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address / Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter the address or location"
                />
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                min={1}
                max={480}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md flex items-center`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;