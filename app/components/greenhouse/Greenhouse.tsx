// app/components/greenhouse/Greenhouse.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/app/lib/firebase/auth';
import { db } from '@/app/lib/firebase/config';
import { collection, doc, getDoc, updateDoc, getDocs, query, where, orderBy, serverTimestamp, arrayUnion, writeBatch, addDoc, limit } from 'firebase/firestore';

interface GreenhouseProps {
  userId: string;
}

interface Plant {
  id: string;
  name: string;
  image: string;
  description: string;
  seedCost: number;
  owned: boolean;
}

const Greenhouse: React.FC<GreenhouseProps> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIdentityConfirmed, setIsIdentityConfirmed] = useState(false);
  const [fullName, setFullName] = useState('');

  // Sample plant data
  const samplePlants: Plant[] = [
    {
      id: 'plant1',
      name: 'Sunflower',
      image: '/images/plants/sunflower.png',
      description: 'A tall, cheerful flower that follows the sun. Sunflowers represent adoration, loyalty, and longevity.',
      seedCost: 10,
      owned: false
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
      owned: false
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
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
          
          // Get user's plants
          // In a real implementation, this would fetch from Firestore
          // For now, we'll use sample data
          const ownedPlantIds = ['plant1']; // Example: user owns plant1
          
          // Mark plants as owned
          const userPlants = samplePlants.map(plant => ({
            ...plant,
            owned: ownedPlantIds.includes(plant.id)
          }));
          
          setPlants(userPlants);
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleIdentityConfirmation = () => {
    if (!profile) return;
    
    // In a real implementation, this would verify against the profile name
    // For demo purposes, just check if any name is entered
    if (fullName.trim() === '') {
      setError('Please enter your full name');
      return;
    }
    
    setIsIdentityConfirmed(true);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error loading your greenhouse. Please try again later.
        </div>
      </div>
    );
  }

  if (!isIdentityConfirmed) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Welcome to Your Greenhouse</h2>
        <p className="text-gray-600 mb-4">
          Please confirm your identity to access your greenhouse.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your full name"
          />
        </div>
        
        <button
          onClick={handleIdentityConfirmation}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Enter Greenhouse
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Your Greenhouse</h2>
          <div className="flex items-center">
            <img 
              src="/images/seed-icon.png" 
              alt="Seeds" 
              className="w-6 h-6 mr-2"
            />
            <span className="font-bold text-green-800">{profile.seeds}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plant display area */}
          <div className="md:col-span-2 bg-green-50 rounded-lg p-4 min-h-96 relative">
            {/* Your virtual garden visualization would go here */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => window.location.href = '/store'}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
              >
                Visit Store
              </button>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Your Plants</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {plants.filter(plant => plant.owned).map(plant => (
                <div 
                  key={plant.id}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <img 
                        src={plant.image} 
                        alt={plant.name}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                  <h4 className="text-center font-medium">{plant.name}</h4>
                </div>
              ))}
              
              {plants.filter(plant => plant.owned).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>You don't have any plants yet. Visit the store to get some!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Plant info panel */}
          <div className="bg-gray-50 rounded-lg p-4">
            {selectedPlant ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedPlant.name}</h3>
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <img 
                      src={selectedPlant.image} 
                      alt={selectedPlant.name}
                      className="w-24 h-24"
                    />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{selectedPlant.description}</p>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800">
                    This plant cost you <span className="font-medium">{selectedPlant.seedCost} seeds</span> to plant.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a plant to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Learning Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Plant Encyclopedia</h2>
        <p className="text-gray-600 mb-4">
          Explore and learn about different plants. Collect seeds by volunteering to grow more plants!
        </p>
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
  );
};

export default Greenhouse;