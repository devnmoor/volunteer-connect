// app/components/profile/ShareProfile.tsx
'use client';

import { useState, useRef } from 'react';
import { UserProfile } from '@/app/lib/firebase/auth';
import QRCode from 'qrcode.react';

interface ShareProfileProps {
  profile: UserProfile;
  userId: string;
}

const ShareProfile: React.FC<ShareProfileProps> = ({ profile, userId }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const profileUrl = `${window.location.origin}/profile/${userId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const downloadProfileCard = () => {
    if (!profileCardRef.current) return;
    
    // In a real implementation, this would use html2canvas or a similar library 
    // to generate an image from the profile card
    alert('Profile card download feature would be implemented here');
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Profile
      </button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Share Your Profile</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-md"
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div ref={profileCardRef} className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                      profile.level === 'Sapling' ? 'bg-green-400' :
                      profile.level === 'Sprout' ? 'bg-green-600' : 'bg-green-800'
                    }`}>
                      {profile.displayName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold">{profile.displayName}</h3>
                      <p className="text-sm text-gray-600">{profile.level} Level</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-sm text-gray-500">Seeds</p>
                      <p className="font-bold">{profile.seeds}</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-sm text-gray-500">Completed Tasks</p>
                      <p className="font-bold">{profile.completedTasks}</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-sm text-gray-500">Interests</p>
                      <p className="font-bold truncate">{profile.interests.join(', ').length > 20 
                        ? profile.interests.join(', ').slice(0, 20) + '...' 
                        : profile.interests.join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-bold">{profile.country}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <QRCode 
                      value={profileUrl} 
                      size={100}
                      level="H"
                      includeMargin={true}
                      className="bg-white p-1 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={downloadProfileCard}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Profile Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareProfile;
