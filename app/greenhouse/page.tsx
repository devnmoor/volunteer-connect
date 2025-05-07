// app/greenhouse/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import { db } from '@/app/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface Plant {
  id: string;
  name: string;
  image: string;
  description: string;
  seedCost: number;
  owned: boolean;
}

const Greenhouse = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample plants data
  const samplePlants: Plant[] = [
    {
      id: 'plant1',
      name: 'Sunflower',
      image: '/images/plants/sunflower.png',
      description: 'A tall, cheerful flower that follows the sun. Sunflowers represent adoration, loyalty, and longevity.',
      seedCost: 10,
      owned: true
    },
    {
      id: 'plant2',
      name: 'Oak Tree',
      image: '/images/plants/oak.png',
      description: 'A strong, majestic tree that can live for hundreds of years. Oak trees symbolize strength, endurance, and wisdom.',
      seedCost: 50,
      owned: false
    },
    {
      id: 'plant3',
      name: 'Rose Bush',
      image: '/images/plants/rose.png',
      description: 'Beautiful flowers with thorny stems. Roses are traditional symbols of love and passion.',
      seedCost: 25,
      owned: true
    },
    {
      id: 'plant4',
      name: 'Cactus',
      image: '/images/plants/cactus.png',
      description: 'A hardy desert plant that requires little water. Cacti represent endurance and protection.',
      seedCost: 15,
      owned: false
    },
    {
      id: 'plant5',
      name: 'Bonsai Tree',
      image: '/images/plants/bonsai.png',
      description: 'A miniature tree grown in a small container. Bonsai trees symbolize harmony, balance, and patience.',
      seedCost: 100,
      owned: false
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            
            // In a real app, this would fetch the user's plants from Firestore
            // For now, we'll use the sample data
            setPlants(samplePlants);
          } else {
            router.push('/auth/onboarding');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/auth/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800">My Greenhouse</h2>
            <p className="text-gray-600">Grow your virtual garden by completing volunteering tasks</p>
          </div>
          <div className="flex items-center">
            <img 
              src="/images/seed-icon.png" 
              alt="Seeds" 
              className="w-6 h-6 mr-2"
            />
            <span className="font-bold text-green-800">{profile?.seeds || 0}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Virtual Garden View */}
          <div>
            <h3 className="text-lg font-semibold mb-4">My Garden</h3>
            <div className="bg-gray-100 rounded-lg h-64 p-4 flex items-center justify-center">
              {/* This would be an interactive garden view in a full implementation */}
              <p className="text-center text-gray-500">
                Your virtual garden will be displayed here. 
                <br />
                Complete tasks to earn seeds and add plants!
              </p>
            </div>
          </div>

          {/* Plant Details */}
          <div>
            {selectedPlant ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Plant Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                      <img 
                        src={selectedPlant.image} 
                        alt={selectedPlant.name}
                        className="w-24 h-24"
                      />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-center mb-2">{selectedPlant.name}</h4>
                  <p className="text-gray-700 mb-4">{selectedPlant.description}</p>
                  
                  {selectedPlant.owned ? (
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-green-800 font-medium text-center">
                        You own this plant!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-yellow-800">Cost:</span>
                        <div className="flex items-center">
                          <img 
                            src="/images/seed-icon.png" 
                            alt="Seeds" 
                            className="w-4 h-4 mr-1"
                          />
                          <span className="font-bold">{selectedPlant.seedCost}</span>
                        </div>
                      </div>
                      <button
                        className={`w-full mt-2 py-2 px-4 rounded-md ${
                          (profile?.seeds || 0) < selectedPlant.seedCost
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {(profile?.seeds || 0) < selectedPlant.seedCost
                          ? 'Not Enough Seeds'
                          : 'Purchase'
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Select a plant to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Plant Encyclopedia */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Plant Encyclopedia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map(plant => (
              <div 
                key={plant.id}
                className={`border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow ${
                  plant.owned ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlant(plant)}
              >
                <div className="p-4 flex items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <img 
                      src={plant.image} 
                      alt={plant.name}
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{plant.name}</h4>
                    <p className="text-sm text-gray-600">
                      {plant.owned ? 'Owned' : `${plant.seedCost} seeds`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greenhouse;