// app/components/map/Greenhouse.tsx
'use client';

import { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { db } from '@/app/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '@/app/lib/firebase/auth';
import { useRouter } from 'next/navigation';

interface GreenhouseProps {
  position: [number, number]; // [latitude, longitude]
  userId: string;
}

const Greenhouse: React.FC<GreenhouseProps> = ({ position, userId }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // Create greenhouse icon
  const greenhouseIcon = new Icon({
    iconUrl: '/images/greenhouse.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
  
  // Calculate tree count based on seeds
  const getTreeCount = (seeds: number) => {
    // Every 10 seeds = 1 tree
    return Math.floor(seeds / 10);
  };
  
  // Handle button click to navigate to greenhouse page
  const handleViewGreenhouse = () => {
    router.push('/greenhouse');
  };
  
  if (loading) {
    return null;
  }
  
  return (
    <Marker 
      position={position} 
      icon={greenhouseIcon}
    >
      <Popup>
        <div className="max-w-sm">
          <h3 className="font-semibold text-md">{userData?.displayName}'s Greenhouse</h3>
          
          <div className="mt-2 bg-green-50 p-3 rounded-md border border-green-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-green-800">{userData?.seeds || 0}</span> seeds collected
                </p>
                {userData && userData.seeds >= 10 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-green-800">{getTreeCount(userData.seeds)}</span> trees planted
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <img 
                  src="/images/seed-icon.png" 
                  alt="Seeds" 
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>
          
          {userData && userData.seeds < 10 && (
            <p className="text-xs text-gray-500 mt-2">
              Collect 10 seeds to plant your first virtual tree!
            </p>
          )}
          
          <div className="mt-3">
            <button 
              onClick={handleViewGreenhouse}
              className="w-full text-sm py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              View Greenhouse
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default Greenhouse;