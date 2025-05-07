// app/components/dashboard/CompletionModal.tsx
'use client';

import { useState } from 'react';
import { storage } from '@/app/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { completeTask, VolunteerTask } from '@/app/lib/firebase/firestore';

interface CompletionModalProps {
  task: VolunteerTask;
  userId: string;
  onClose: () => void;
  onSchedule?: (task: VolunteerTask, scheduledTime: Date) => void; // Add this prop
}

const CompletionModal: React.FC<CompletionModalProps> = ({ task, userId, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please upload a photo of your completed task');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `task-completions/${userId}/${task.id}_${Date.now()}`);
      await uploadBytes(storageRef, selectedFile);
      
      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);
      
      // Complete the task in Firestore
      await completeTask(task.id!, userId, {
        imageUrl,
        rating,
        feedback
      });
      
      setSuccess(true);
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Complete Task</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Task Completed!</h3>
              <p className="text-gray-600">Thank you for your contribution.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h3 className="font-medium mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload a photo of your completed task
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  {previewUrl ? (
                    <div>
                      <img 
                        src={previewUrl} 
                        alt="Task completion preview" 
                        className="mx-auto max-h-48 mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rate your experience (1-5 stars)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-8 w-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Share your thoughts about this volunteering experience..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedFile}
                  className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md ${
                    loading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
