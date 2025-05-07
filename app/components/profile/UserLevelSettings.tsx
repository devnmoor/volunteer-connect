// app/components/profile/UserLevelSettings.tsx
'use client';

import { useState } from 'react';
import { UserProfile, UserLevel } from '@/app/lib/firebase/auth';
import { db } from '@/app/lib/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface UserLevelSettingsProps {
  profile: UserProfile;
  userId: string;
  onLevelChanged: (newLevel: UserLevel) => void;
}

const UserLevelSettings: React.FC<UserLevelSettingsProps> = ({ profile, userId, onLevelChanged }) => {
  const [selectedLevel, setSelectedLevel] = useState<UserLevel>(profile.level);
  const [showGuardianForm, setShowGuardianForm] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Determine which levels the user is eligible for based on age
  const getEligibleLevels = (): UserLevel[] => {
    const age = profile.age;
    
    if (age < 16) {
      return ['Sapling'];
    } else if (age >= 16 && age < 21) {
      return ['Sapling', 'Sprout', 'Bloom']; // Bloom requires guardian for users under 21
    } else {
      return ['Sapling', 'Sprout', 'Bloom'];
    }
  };

  // Check if the user needs a guardian for the selected level
  const needsGuardian = () => {
    return selectedLevel === 'Bloom' && profile.age >= 16 && profile.age < 21;
  };

  // Handle level change
  const handleLevelChange = async () => {
    if (selectedLevel === profile.level) return;
    
    // Check if guardian is needed but not provided
    if (needsGuardian() && !guardianEmail) {
      setShowGuardianForm(true);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Update user level in Firestore
      await updateDoc(doc(db, 'users', userId), {
        level: selectedLevel,
        guardianEmail: needsGuardian() ? guardianEmail : null,
        updatedAt: serverTimestamp()
      });
      
      // Notify parent component
      onLevelChanged(selectedLevel);
      
      setSuccess(`Your level has been updated to ${selectedLevel}!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowGuardianForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-green-800 mb-4">Change Your Level</h2>
      
      <p className="text-gray-600 mb-4">
        You can change your volunteering level based on your preferences and eligibility.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Current Level: {profile.level}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getEligibleLevels().map((level) => (
            <div 
              key={level}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedLevel === level 
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => {
                setSelectedLevel(level);
                if (level !== 'Bloom' || profile.age >= 21) {
                  setShowGuardianForm(false);
                }
              }}
            >
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  level === 'Sapling' ? 'bg-green-400' :
                  level === 'Sprout' ? 'bg-green-600' : 'bg-green-800'
                } text-white font-bold`}>
                  {level.charAt(0)}
                </div>
                <h4 className="font-medium">{level}</h4>
              </div>
              
              <p className="text-sm text-gray-600">
                {level === 'Sapling' 
                  ? 'Beginner level: Participate in assigned tasks.' 
                  : level === 'Sprout' 
                    ? 'Intermediate level: Choose tasks and connect locally.' 
                    : 'Advanced level: Host, create, mentor, and lead opportunities.'}
              </p>
              
              {level === 'Bloom' && profile.age < 21 && (
                <div className="mt-2 text-xs text-amber-600">
                  Requires guardian approval for users under 21
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {showGuardianForm && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">Guardian Approval Required</h3>
          <p className="text-sm text-amber-700 mb-4">
            Since you are under 21, you need a guardian's approval to use the Bloom level.
            Please enter your guardian's email address below:
          </p>
          
          <div className="mb-4">
            <label htmlFor="guardianEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Email
            </label>
            <input
              type="email"
              id="guardianEmail"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter guardian's email address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send an email to verify their permission.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleLevelChange}
          disabled={loading || selectedLevel === profile.level}
          className={`px-4 py-2 rounded-md ${
            loading || selectedLevel === profile.level
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Updating...' : 'Update Level'}
        </button>
      </div>
    </div>
  );
};

export default UserLevelSettings;
