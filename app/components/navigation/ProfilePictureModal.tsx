// app/components/navigation/ProfilePictureModal.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '@/app/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';

interface ProfilePictureModalProps {
  onClose: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = auth.currentUser;
  const isDefaultImage = !user?.photoURL || user.photoURL.includes('default-profile');
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    
    try {
      setLoading(true);
      setError('');
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user?.uid}`);
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the user's profile
      if (user) {
        await updateProfile(user, {
          photoURL: downloadURL
        });
      }
      
      onClose();
      // Force refresh to update UI
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = async () => {
    if (isDefaultImage) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Update the user's profile to the default image
      if (user) {
        await updateProfile(user, {
          photoURL: '/images/default-profile.png'
        });
      }
      
      onClose();
      // Force refresh to update UI
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error removing image:', err);
      setError(err.message || 'Failed to remove image');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-80" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="rounded-full w-24 h-24 bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
              <img 
                src={user?.photoURL || '/images/default-profile.png'} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 text-white rounded-full p-2 shadow-md hover:bg-green-700 hover:cursor-pointer"
                title="Change profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <h4 className="text-lg font-medium">{user?.displayName || 'Volunteer'}</h4>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700 hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            Upload New Image
          </button>
          
          <button
            onClick={handleRemoveImage}
            className={`w-full py-2 px-3 border rounded-md flex items-center justify-center ${
              isDefaultImage 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50 hover:cursor-pointer'
            }`}
            disabled={isDefaultImage || loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Profile Image
          </button>
          
          <div className="border-t border-gray-200 my-3"></div>
          
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 text-red-600 border border-red-200 rounded-md flex items-center justify-center hover:bg-red-50 hover:cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;