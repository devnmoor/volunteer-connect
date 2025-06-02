// app/components/profile/ShareProfile.tsx
'use client';

import { useState, useRef } from 'react';
import { UserProfile } from '@/app/lib/firebase/auth';

interface ShareProfileProps {
  profile: UserProfile;
  userId: string;
}

const ShareProfile: React.FC<ShareProfileProps> = ({ profile, userId }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  // Generate profile URL
  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/profile/${userId}` 
    : `https://example.com/profile/${userId}`;

  // Copy profile link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Generate and download a profile card image
  const downloadProfileCard = () => {
    if (!profileCardRef.current) return;
    
    // In a real implementation, this would use html2canvas or a similar library 
    // to generate an image from the profile card
    alert('Profile card download feature would be implemented here');
  };

  // Generate QR code for the profile
  const generateQRCode = () => {
    // This would be the URL to the QR code for the profile
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
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
                    {profile.photoURL ? (
                      <img 
                        src={profile.photoURL} 
                        alt={profile.displayName} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                        profile.level === 'Sprout' ? 'bg-green-400' :
                        profile.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'
                      }`}>
                        {profile.displayName.charAt(0)}
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-bold">{profile.displayName}</h3>
                      <p className="text-sm text-gray-600">{profile.level} Level</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-gray-500">Seeds</p>
                      <p className="font-bold">{profile.seeds}</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-gray-500">Completed Tasks</p>
                      <p className="font-bold">{profile.completedTasks || 0}</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-gray-500">Interests</p>
                      <p className="text-sm font-medium truncate">{profile.interests?.join(', ').length > 20 
                        ? profile.interests.join(', ').slice(0, 20) + '...' 
                        : profile.interests?.join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div className="bg-white/80 p-2 rounded">
                      <p className="text-xs text-gray-500">Country</p>
                      <p className="font-bold">{profile.country}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <img 
                      src={generateQRCode()} 
                      alt="Profile QR Code"
                      className="w-24 h-24 bg-white p-1 rounded"
                    />
                  </div>
                  
                  <div className="text-center mt-2 text-xs text-gray-600">
                    <p>Scan to view profile</p>
                    <p>volunteerconnect.org</p>
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
              
              <div className="mt-4 border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Share via:</h4>
                <div className="flex justify-center space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </button>
                  <button className="bg-blue-400 hover:bg-blue-500 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </button>
                  <button className="bg-blue-800 hover:bg-blue-900 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </button>
                  <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fill-rule="evenodd" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareProfile;