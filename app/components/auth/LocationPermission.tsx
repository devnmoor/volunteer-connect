// app/components/auth/LocationPermission.tsx
'use client';

import { useState } from 'react';
import { UserLevel } from '@/app/lib/firebase/auth';
import { requestLocationPermission } from '@/app/lib/location/locationService';
import { collection, doc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp, arrayUnion, writeBatch, addDoc, limit } from 'firebase/firestore';

interface LocationPermissionProps {
  userLevel: UserLevel;
  userId: string;
  onLocationUpdated: (location?: { latitude: number; longitude: number }) => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
  userLevel,
  userId,
  onLocationUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Only ask for location if user is Bud or Bloom level
  const shouldRequestLocation = userLevel === 'Bud' || userLevel === 'Bloom';
  
  const handleRequestLocation = async () => {
    if (!shouldRequestLocation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestLocationPermission(userId);
      
      if (result.success) {
        setPermissionGranted(true);
        onLocationUpdated(result.location);
      } else {
        setError(result.error || 'Failed to get location');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    // Skip location permission, but still inform parent component
    onLocationUpdated();
  };
  
  if (!shouldRequestLocation) {
    return null;
  }
  
  if (permissionGranted) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Location permission granted! We'll use this to find volunteer opportunities near you.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Enable Location Services</h3>
      
      <p className="text-gray-600 mb-4">
        {userLevel === 'Bud'
          ? 'As a Bud level volunteer, enabling location allows you to see volunteering opportunities near you and connect with local volunteers.'
          : 'As a Bloom level volunteer, enabling location allows you to create and find local opportunities and mentor others in your area.'}
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={handleRequestLocation}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Getting Location...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Enable Location
            </>
          )}
        </button>
        
        <button
          onClick={handleSkip}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
        >
          Skip for Now
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        Your location will only be used to find volunteer opportunities near you. You can update your location permissions at any time in your profile settings.
      </p>
    </div>
  );
};

export default LocationPermission;