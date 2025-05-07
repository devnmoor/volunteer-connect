// app/components/dashboard/TaskFinalCompletionModal.tsx
'use client';

import { useState, useRef } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase/config';

interface TaskFinalCompletionModalProps {
  task: VolunteerTask;
  userId: string;
  onClose: () => void;
  onComplete: () => void;
  existingImages?: string[];
}

const TaskFinalCompletionModal: React.FC<TaskFinalCompletionModalProps> = ({
  task,
  userId,
  onClose,
  onComplete,
  existingImages = []
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [achievements, setAchievements] = useState('');
  const [feedback, setFeedback] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [contactType, setContactType] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Check if adding these would exceed the limit
    if (images.length + e.target.files.length > 15) {
      setError(`You can upload a maximum of 15 images. You currently have ${images.length}.`);
      return;
    }
    
    setLoading(true);
    
    try {
      const newImages: string[] = [];
      
      // Upload each image
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Create a reference to storage
        const storageRef = ref(storage, `task-images/${task.id}/${userId}/${Date.now()}-${file.name}`);
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        newImages.push(downloadURL);
      }
      
      // Add new images to state
      setImages(prev => [...prev, ...newImages]);
      setError('');
      
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!achievements.trim() || !feedback.trim() || !contactName.trim() || !contactInfo.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    // For email, validate format
    if (contactType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // For phone, simple validation
    if (contactType === 'phone' && !/^\d{10,}$/.test(contactInfo.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create completion data
      const completionData = {
        achievements,
        feedback,
        contact: {
          name: contactName,
          type: contactType,
          value: contactInfo
        },
        images,
        completedBy: arrayUnion(userId),
        completionDate: serverTimestamp(),
        status: 'completed'
      };
      
      // Update the task in Firestore
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, completionData);
      
      // Add a seed to the user's account
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        seeds: increment(1)
      });
      
      // Call the completion callback to show animation, etc.
      onComplete();
      
      // Close this modal
      onClose();
      
    } catch (err: any) {
      console.error('Error completing task:', err);
      setError(err.message || 'Failed to complete task');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 pr-8">Complete Task: {task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What did you achieve with this task?*
              </label>
              <textarea
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
                placeholder="Describe what you accomplished..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share your experience / feedback*
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
                placeholder="How was the experience? What went well or could be improved?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images (Max 15)
              </label>
              
              {/* Image gallery */}
              {images.length > 0 && (
                <div className="mb-3">
                  <div className="flex overflow-x-auto pb-2 space-x-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={img}
                          alt={`Task image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 hover:cursor-pointer"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:cursor-pointer"
                disabled={loading || images.length >= 15}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-gray-600 rounded-full"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {images.length >= 15 ? 'Maximum images reached' : 'Upload images'}
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={loading || images.length >= 15}
              />
              
              <p className="text-xs text-gray-500 mt-1">
                {images.length}/15 images uploaded. Supported formats: JPG, PNG
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name*
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Name of person who can verify your work"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Method
                </label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="website">Website</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information*
              </label>
              <input
                type={contactType === 'email' ? 'email' : 'text'}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={
                  contactType === 'email' ? 'Email address' : 
                  contactType === 'phone' ? 'Phone number' : 'Website URL'
                }
                required
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 hover:cursor-pointer'} text-white rounded-md flex items-center`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Submitting...
              </>
            ) : (
              'Complete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFinalCompletionModal;
