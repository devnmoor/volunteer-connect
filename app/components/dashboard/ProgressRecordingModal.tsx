// app/components/dashboard/ProgressRecordingModal.tsx
'use client';

import { useState, useRef } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase/config';

interface ProgressRecordingModalProps {
  task: VolunteerTask;
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
}

interface ProgressEntry {
  timestamp: Date;
  title: string;
  description: string;
  images: string[];
}

const ProgressRecordingModal: React.FC<ProgressRecordingModalProps> = ({
  task,
  userId,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Check if adding these would exceed the limit
    if (images.length + e.target.files.length > 5) {
      setError(`You can upload a maximum of 5 images. You currently have ${images.length}.`);
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const newImages: string[] = [];
      
      // Upload each image
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Create a reference to storage
        const storageRef = ref(storage, `task-progress/${task.id}/${userId}/${Date.now()}-${file.name}`);
        
        // Upload the file
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        newImages.push(downloadURL);
      }
      
      // Add new images to state
      setImages(prev => [...prev, ...newImages]);
      
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      setError('Please provide a title for this progress entry');
      return;
    }
    
    if (!description.trim()) {
      setError('Please provide a description of your progress');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create progress entry
      const progressEntry: ProgressEntry = {
        timestamp: new Date(),
        title: title.trim(),
        description: description.trim(),
        images
      };
      
      // Update task with progress entry and change status to paused
      const taskRef = doc(db, 'tasks', task.id!);
      await updateDoc(taskRef, {
        progressEntries: arrayUnion(progressEntry),
        status: 'paused',
        lastProgressUpdate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Call submit callback
      onSubmit();
      
      // Close modal
      onClose();
      
    } catch (err: any) {
      console.error('Error recording progress:', err);
      setError(err.message || 'Failed to record progress');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Record Your Progress</h2>
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
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Completed first phase of cleanup"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What did you accomplish?*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
                placeholder="Describe what you've done so far and any important details..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress Photos (Max 5)
              </label>
              
              {/* Image gallery */}
              {images.length > 0 && (
                <div className="mb-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Progress photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
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
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
                disabled={uploading || images.length >= 5}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-gray-600 rounded-full"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {images.length >= 5 ? 'Maximum images reached' : 'Add photos of your progress'}
                  </>
                )}
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading || images.length >= 5}
              />
              
              <p className="text-xs text-gray-500 mt-1">
                {images.length}/5 images uploaded. Supported formats: JPG, PNG
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !description.trim()}
            className={`px-6 py-2 ${
              loading || !title.trim() || !description.trim()
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white rounded-md flex items-center`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Recording...
              </>
            ) : (
              'Record Progress'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressRecordingModal;