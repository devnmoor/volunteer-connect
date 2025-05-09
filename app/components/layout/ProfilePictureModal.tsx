// app/components/layout/ProfilePictureModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '@/app/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import Link from 'next/link';

interface ProfilePictureModalProps {
  onClose: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const user = auth.currentUser;
  const isDefaultImage = !user?.photoURL || user.photoURL.includes('default-profile');
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
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
        
        // Also update the user document in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          photoURL: downloadURL
        });
      }
      
      setSuccessMessage('Profile picture updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        // Force refresh to update UI
        window.location.reload();
      }, 3000);
      
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
      
      // Delete the image from Storage
      const storageRef = ref(storage, `profile-pictures/${user?.uid}`);
      try {
        await deleteObject(storageRef);
      } catch (storageError) {
        console.log('Storage object may not exist:', storageError);
        // Continue anyway, as we still want to update the profile
      }
      
      // Update the user's profile to the default image
      if (user) {
        await updateProfile(user, {
          photoURL: null
        });
        
        // Also update the user document in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          photoURL: null
        });
      }
      
      setSuccessMessage('Profile picture removed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
        // Force refresh to update UI
        window.location.reload();
      }, 3000);
      
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
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === 'profile' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === 'settings' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </div>
        
        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                  <img 
                    src={user?.photoURL || '/images/default-profile.png'} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-0 bg-green-600 text-white rounded-full p-2 shadow-md hover:bg-green-700"
                  title="Change profile picture"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />
              
              <h3 className="text-lg font-semibold">{user?.displayName || 'User'}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            
            {/* Feedback messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {successMessage}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                Change Profile Picture
              </button>
              
              <button
                onClick={handleRemoveImage}
                className={`w-full py-2 px-3 border rounded-md flex items-center justify-center ${
                  isDefaultImage ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
                disabled={isDefaultImage || loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Profile Picture
              </button>
              
              <button
                onClick={onClose}
                className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <Link href="/profile">
                <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Edit Profile</span>
                </div>
              </Link>
              
              <Link href="/notifications">
                <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Notifications</span>
                </div>
              </Link>
              
              <Link href="/privacy">
                <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Privacy & Security</span>
                </div>
              </Link>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureModal;