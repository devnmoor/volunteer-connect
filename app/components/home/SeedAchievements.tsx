// app/components/home/SeedAchievements.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';

interface SeedShoutout {
  id: string;
  userId: string;
  seedType: string;
  timestamp: any;
  userData?: {
    displayName: string;
    photoURL?: string;
    level: string;
  };
}

const SeedAchievements = () => {
  const [shoutouts, setShoutouts] = useState<SeedShoutout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShoutouts = async () => {
      try {
        // Get recent shoutouts
        const shoutoutsQuery = query(
          collection(db, 'shoutouts'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const shoutoutsSnapshot = await getDocs(shoutoutsQuery);
        const shoutoutsData: SeedShoutout[] = [];

        // Get user data for each shoutout
        for (const doc of shoutoutsSnapshot.docs) {
          const shoutout = { id: doc.id, ...doc.data() } as SeedShoutout;
          
          if (shoutout.userId) {
            // Fetch user data using a separate query
            const userQuery = query(
              collection(db, 'users'),
              where('uid', '==', shoutout.userId)
            );

            const userSnapshot = await getDocs(userQuery);
            
            if (!userSnapshot.empty) {
              shoutout.userData = userSnapshot.docs[0].data() as SeedShoutout['userData'];
            }
          }

          shoutoutsData.push(shoutout);
        }

        setShoutouts(shoutoutsData);
      } catch (error) {
        console.error('Error fetching shoutouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShoutouts();
  }, []);

  // Get seed badge color
  const getSeedBadgeColor = (seedType: string) => {
    switch (seedType) {
      case 'silver': return 'bg-gray-200 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'diamond': return 'bg-blue-100 text-blue-800';
      case 'eternity': return 'bg-purple-100 text-purple-800';
      case 'mystery': return 'bg-gradient-to-r from-green-500 to-blue-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Seed Achievements</h2>
      
      {shoutouts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No seed achievements yet. Complete tasks to earn mystery seeds!
        </p>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex items-center space-x-4 animate-scroll">
            {shoutouts.map((shoutout) => (
              <div key={shoutout.id} className="flex-shrink-0 flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {shoutout.userData?.photoURL ? (
                      <img 
                        src={shoutout.userData.photoURL} 
                        alt={shoutout.userData.displayName || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-green-600`}>
                        {(shoutout.userData?.displayName || 'U').charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 rounded-full px-2 py-1 text-xs font-medium ${getSeedBadgeColor(shoutout.seedType)}`}>
                    {shoutout.seedType.charAt(0).toUpperCase() + shoutout.seedType.slice(1)}
                  </div>
                </div>
                <p className="text-sm font-medium mt-2 text-center max-w-[100px] truncate">
                  {shoutout.userData?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500">{formatDate(shoutout.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <div className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
            Silver (10% chance)
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Gold (5% chance)
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Diamond (0.1% chance)
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            Eternity (0.01% chance)
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
            Mystery X (0.001% chance)
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedAchievements;