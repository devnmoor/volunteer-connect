// app/greenhouse/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import GreenhouseVisualization from '@/app/components/greenhouse/GreenhouseVisualization';

interface PlantOrItem {
  id: string;
  name: string;
  image: string;
  description: string;
  seedCost: number;
  type: 'plant' | 'accessory' | 'special';
  placement?: {
    room: string;
    position: {
      x: number;
      y: number;
    };
  };
}

const Greenhouse = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plants, setPlants] = useState<PlantOrItem[]>([]);
  const [accessories, setAccessories] = useState<PlantOrItem[]>([]);
  const [specialItems, setSpecialItems] = useState<PlantOrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIdentityConfirmed, setIsIdentityConfirmed] = useState(true); // Changed to true for demo
  const [fullName, setFullName] = useState('');
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlantOrItem | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            
            // Fetch user's items from Firestore
            await fetchUserItems(user.uid);
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

  // Fetch user's purchased items
  const fetchUserItems = async (userId: string) => {
    try {
      // Get user's document
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      
      // Get owned items from user profile
      const ownedItems = userData.ownedItems || {
        plants: [],
        accessories: [],
        specials: []
      };
      
      // Fetch all store items
      const storeItemsRef = collection(db, 'storeItems');
      const storeItemsSnapshot = await getDocs(storeItemsRef);
      
      const allStoreItems: { [key: string]: PlantOrItem } = {};
      
      storeItemsSnapshot.forEach(doc => {
        allStoreItems[doc.id] = { 
          id: doc.id, 
          ...doc.data() 
        } as PlantOrItem;
      });
      
      // If there are no store items in the database yet, use demo data
      if (storeItemsSnapshot.empty) {
        // Fetch plants
        const userPlants = await fetchDemoPlants(ownedItems.plants || []);
        const userAccessories = await fetchDemoAccessories(ownedItems.accessories || []);
        const userSpecialItems = await fetchDemoSpecialItems(ownedItems.specials || []);
        
        setPlants(userPlants);
        setAccessories(userAccessories);
        setSpecialItems(userSpecialItems);
      } else {
        // Filter owned items
        const userPlants = ownedItems.plants
          .map(id => allStoreItems[id])
          .filter(item => item);
          
        const userAccessories = ownedItems.accessories
          .map(id => allStoreItems[id])
          .filter(item => item);
          
        const userSpecialItems = ownedItems.specials
          .map(id => allStoreItems[id])
          .filter(item => item);
          
        setPlants(userPlants);
        setAccessories(userAccessories);
        setSpecialItems(userSpecialItems);
      }
    } catch (err: any) {
      console.error('Error fetching user items:', err);
      setError('Failed to load your greenhouse inventory: ' + err.message);
    }
  };
  
  // If no store items exist yet, use demo data
  const fetchDemoPlants = async (ownedPlantIds: string[]) => {
    // This simulates fetching plants from a database
    const demoPlants = [
      {
        id: 'plant1',
        name: 'Sunflower',
        image: '/images/plants/sunflower.png',
        description: 'A tall, cheerful flower that follows the sun. Sunflowers represent adoration, loyalty, and longevity.',
        seedCost: 10,
        type: 'plant' as const
      },
      {
        id: 'plant2',
        name: 'Oak Tree',
        image: '/images/plants/oak.png',
        description: 'A strong, majestic tree that can live for hundreds of years. Oak trees symbolize strength, endurance, and wisdom.',
        seedCost: 50,
        type: 'plant' as const
      },
      {
        id: 'plant3',
        name: 'Rose Bush',
        image: '/images/plants/rose.png',
        description: 'Beautiful flowers with thorny stems. Roses are traditional symbols of love and passion.',
        seedCost: 25,
        type: 'plant' as const
      },
      {
        id: 'plant6',
        name: 'Lavender Bush',
        image: '/images/plants/lavender.png',
        description: 'A calming purple plant known for its soothing aroma and beautiful blooms.',
        seedCost: 20,
        type: 'plant' as const
      },
      {
        id: 'plant7',
        name: 'Apple Tree',
        image: '/images/plants/apple-tree.png',
        description: 'A fruit-bearing tree that produces delicious apples. A symbol of abundance and nourishment.',
        seedCost: 75,
        type: 'plant' as const
      }
    ];
    
    // Filter to return only owned plants
    return demoPlants.filter(plant => ownedPlantIds.includes(plant.id));
  };
  
  const fetchDemoAccessories = async (ownedAccessoryIds: string[]) => {
    const demoAccessories = [
      {
        id: 'accessory1',
        name: 'Watering Can',
        image: '/images/accessories/watering-can.png',
        description: 'A decorative watering can for your virtual greenhouse.',
        seedCost: 20,
        type: 'accessory' as const
      },
      {
        id: 'accessory2',
        name: 'Garden Bench',
        image: '/images/accessories/bench.png',
        description: 'A peaceful place to sit and admire your plants.',
        seedCost: 30,
        type: 'accessory' as const
      },
      {
        id: 'accessory3',
        name: 'Bird Bath',
        image: '/images/accessories/bird-bath.png',
        description: 'Attract virtual birds to your greenhouse.',
        seedCost: 35,
        type: 'accessory' as const
      },
      {
        id: 'accessory4',
        name: 'Compost Bin',
        image: '/images/accessories/compost.png',
        description: 'A natural way to recycle plant waste and boost your greenhouse\'s eco-friendly feel.',
        seedCost: 25,
        type: 'accessory' as const
      },
      {
        id: 'accessory5',
        name: 'Plant Shelf',
        image: '/images/accessories/plant-shelf.png',
        description: 'An attractive wooden shelf perfect for organizing and displaying your smaller plants.',
        seedCost: 35,
        type: 'accessory' as const
      }
    ];
    
    return demoAccessories.filter(acc => ownedAccessoryIds.includes(acc.id));
  };
  
  const fetchDemoSpecialItems = async (ownedSpecialIds: string[]) => {
    const demoSpecialItems = [
      {
        id: 'special1',
        name: 'Rare Orchid',
        image: '/images/plants/rare-orchid.png',
        description: 'An ultra-rare flower with stunning blooms. A true collector\'s item for your greenhouse.',
        seedCost: 150,
        type: 'special' as const
      },
      {
        id: 'special2',
        name: 'Bee Box',
        image: '/images/accessories/bee-box.png',
        description: 'Houses virtual bees that help pollinate nearby plants, enhancing their appearance.',
        seedCost: 40,
        type: 'special' as const
      },
      {
        id: 'special3',
        name: 'Holiday Lights',
        image: '/images/accessories/holiday-lights.png',
        description: 'Festive lights to brighten your greenhouse during special seasonal events.',
        seedCost: 20,
        type: 'special' as const
      }
    ];
    
    return demoSpecialItems.filter(item => ownedSpecialIds.includes(item.id));
  };

  // Handle item placement in the greenhouse
  const handleItemPlace = async (item, room, position) => {
    if (!user) return;
    
    try {
      // Update the item placement in the database
      const userRef = doc(db, 'users', user.uid);
      
      // Create placement data
      const placementData = {
        room,
        position
      };
      
      // Create the update object using the correct path for the specific item
      const updateData = {
        [`itemPlacements.${item.id}`]: placementData,
        updatedAt: serverTimestamp()
      };
      
      // Update Firestore
      await updateDoc(userRef, updateData);
      
      // Update local state
      if (item.type === 'plant') {
        setPlants(prev => prev.map(p => 
          p.id === item.id ? { ...p, placement: placementData } : p
        ));
      } else if (item.type === 'accessory') {
        setAccessories(prev => prev.map(a => 
          a.id === item.id ? { ...a, placement: placementData } : a
        ));
      } else if (item.type === 'special') {
        setSpecialItems(prev => prev.map(s => 
          s.id === item.id ? { ...s, placement: placementData } : s
        ));
      }
    } catch (err) {
      console.error('Error updating item placement:', err);
    }
  };

  // Handle item movement within the greenhouse
  const handleItemMove = async (item, room, position) => {
    if (!user) return;
    
    try {
      // Update the item placement in the database
      const userRef = doc(db, 'users', user.uid);
      
      // Create placement data
      const placementData = {
        room,
        position
      };
      
      // Create the update object
      const updateData = {
        [`itemPlacements.${item.id}`]: placementData,
        updatedAt: serverTimestamp()
      };
      
      // Update Firestore
      await updateDoc(userRef, updateData);
      
      // Update local state
      if (item.type === 'plant') {
        setPlants(prev => prev.map(p => 
          p.id === item.id ? { ...p, placement: placementData } : p
        ));
      } else if (item.type === 'accessory') {
        setAccessories(prev => prev.map(a => 
          a.id === item.id ? { ...a, placement: placementData } : a
        ));
      } else if (item.type === 'special') {
        setSpecialItems(prev => prev.map(s => 
          s.id === item.id ? { ...s, placement: placementData } : s
        ));
      }
    } catch (err) {
      console.error('Error updating item placement:', err);
    }
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Your Greenhouse</h2>
            <p className="text-gray-600">Arrange your plants and accessories in your virtual greenhouse</p>
          </div>
          <div className="flex items-center">
            <img 
              src="/images/seed-icon.png" 
              alt="Seeds" 
              className="w-6 h-6 mr-2"
            />
            <span className="font-bold text-green-800">{profile.seeds}</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Inventory summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Plants</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <img src="/images/plants/sunflower.png" alt="Plants" className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold">{plants.length}</span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Accessories</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <img src="/images/accessories/watering-can.png" alt="Accessories" className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold">{accessories.length}</span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Special Items</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <img src="/images/accessories/bee-box.png" alt="Special Items" className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold">{specialItems.length}</span>
            </div>
          </div>
        </div>
        
        {/* 3D Greenhouse Visualization */}
        <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden">
          <GreenhouseVisualization 
            plants={plants}
            accessories={accessories}
            specialItems={specialItems}
            onItemPlace={handleItemPlace}
            onItemMove={handleItemMove}
          />
        </div>
        
        {/* Store link banner */}
        {plants.length === 0 && accessories.length === 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Your greenhouse is empty!</h3>
            <p className="text-gray-600 mb-4">
              Visit the store to purchase plants and accessories for your greenhouse.
            </p>
            <button
              onClick={() => router.push('/store')}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Visit Store
            </button>
          </div>
        )}
      </div>
      
      {/* Inventory Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Your Greenhouse Inventory</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plants */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-5 h-5 bg-green-100 rounded-full mr-2"></span>
              Plants
            </h3>
            
            {plants.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                No plants yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {plants.map((plant) => (
                  <div 
                    key={plant.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedItem(plant);
                      setShowItemDetails(true);
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                        <img 
                          src={plant.image} 
                          alt={plant.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-center">{plant.name}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Accessories */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-5 h-5 bg-yellow-100 rounded-full mr-2"></span>
              Accessories
            </h3>
            
            {accessories.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                No accessories yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {accessories.map((accessory) => (
                  <div 
                    key={accessory.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedItem(accessory);
                      setShowItemDetails(true);
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
                        <img 
                          src={accessory.image} 
                          alt={accessory.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-center">{accessory.name}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Special Items */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <span className="w-5 h-5 bg-purple-100 rounded-full mr-2"></span>
              Special Items
            </h3>
            
            {specialItems.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                No special items yet
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {specialItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowItemDetails(true);
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-center">{item.name}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Visit Store Banner */}
        <div className="mt-8 border-t pt-6">
          <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-green-800">Need more plants or accessories?</h3>
              <p className="text-sm text-gray-600">Visit the store to expand your collection.</p>
            </div>
            <button
              onClick={() => router.push('/store')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Visit Store
            </button>
          </div>
        </div>
      </div>
      
      {/* Item Details Modal */}
      {showItemDetails && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
              <button
                onClick={() => setShowItemDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-green-50">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name}
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedItem.description}</p>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Seed Cost:</span>
                <div className="flex items-center">
                  <img 
                    src="/images/seed-icon.png" 
                    alt="Seeds" 
                    className="w-4 h-4 mr-1"
                  />
                  <span className="font-bold">{selectedItem.seedCost}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowItemDetails(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              
              {!selectedItem.placement && (
                <button
                  onClick={() => {
                    setShowItemDetails(false);
                    // Code to place item in greenhouse visualization
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Place in Greenhouse
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Greenhouse;