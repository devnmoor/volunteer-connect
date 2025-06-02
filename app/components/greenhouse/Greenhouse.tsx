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
  type: 'plant' | 'accessory' | 'special';
  placed?: boolean;
  position?: { x: number; y: number };
}

interface PlacedItem {
  id: string;
  itemId: string;
  position: { x: number; y: number };
  type: 'plant' | 'accessory' | 'special';
}

const Greenhouse: React.FC<GreenhouseProps> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inventory, setInventory] = useState<Plant[]>([]);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIdentityConfirmed, setIsIdentityConfirmed] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<'garden' | 'inventory'>('garden');

  // All available items (from store)
  const allStoreItems: Plant[] = [
    // Plants
    {
      id: 'plant1',
      name: 'Sunflower',
      image: '/images/plants/sunflower.png',
      description: 'A tall, cheerful flower that follows the sun.',
      seedCost: 5,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant2',
      name: 'Oak Tree',
      image: '/images/plants/oak.png',
      description: 'A strong, majestic tree that can live for hundreds of years.',
      seedCost: 50,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant3',
      name: 'Rose Bush',
      image: '/images/plants/rose.png',
      description: 'Beautiful flowers with thorny stems.',
      seedCost: 25,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant4',
      name: 'Cactus',
      image: '/images/plants/cactus.png',
      description: 'A hardy desert plant that requires little water.',
      seedCost: 15,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant5',
      name: 'Bonsai Tree',
      image: '/images/plants/bonsai.png',
      description: 'A miniature tree grown in a small container.',
      seedCost: 100,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant6',
      name: 'Lavender Bush',
      image: '/images/plants/lavender.png',
      description: 'A calming purple plant known for its soothing aroma.',
      seedCost: 20,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant7',
      name: 'Apple Tree',
      image: '/images/plants/apple-tree.png',
      description: 'A fruit-bearing tree that produces delicious apples.',
      seedCost: 75,
      owned: false,
      type: 'plant'
    },
    {
      id: 'plant8',
      name: 'Hanging Fern',
      image: '/images/plants/hanging-fern.png',
      description: 'A lush green fern perfect for adding vertical interest.',
      seedCost: 15,
      owned: false,
      type: 'plant'
    },
    // Accessories
    {
      id: 'accessory1',
      name: 'Watering Can',
      image: '/images/accessories/watering-can.png',
      description: 'A decorative watering can for your virtual greenhouse.',
      seedCost: 20,
      owned: false,
      type: 'accessory'
    },
    {
      id: 'accessory2',
      name: 'Garden Bench',
      image: '/images/accessories/bench.png',
      description: 'A peaceful place to sit and admire your plants.',
      seedCost: 30,
      owned: false,
      type: 'accessory'
    },
    {
      id: 'accessory3',
      name: 'Bird Bath',
      image: '/images/accessories/bird-bath.png',
      description: 'Attract virtual birds to your greenhouse.',
      seedCost: 35,
      owned: false,
      type: 'accessory'
    },
    // Special Items
    {
      id: 'special1',
      name: 'Rare Orchid',
      image: '/images/plants/rare-orchid.png',
      description: 'An ultra-rare flower with stunning blooms.',
      seedCost: 150,
      owned: false,
      type: 'special'
    },
    {
      id: 'special2',
      name: 'Bee Box',
      image: '/images/accessories/bee-box.png',
      description: 'Houses virtual bees that help pollinate nearby plants.',
      seedCost: 40,
      owned: false,
      type: 'special'
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError('You must be signed in to access your greenhouse');
          return;
        }

        // Verify the userId matches the authenticated user
        if (currentUser.uid !== userId) {
          setError('You can only access your own greenhouse');
          return;
        }
        
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile & {
            ownedItems?: {
              plants?: string[];
              accessories?: string[];
              specials?: string[];
            };
            greenhouseLayout?: PlacedItem[];
          };
          
          setProfile(userData);
          
          // Process owned items
          const ownedPlants = userData.ownedItems?.plants || [];
          const ownedAccessories = userData.ownedItems?.accessories || [];
          const ownedSpecials = userData.ownedItems?.specials || [];
          
          // Create inventory from owned items
          const userInventory = allStoreItems
            .filter(item => {
              if (item.type === 'plant') return ownedPlants.includes(item.id);
              if (item.type === 'accessory') return ownedAccessories.includes(item.id);
              if (item.type === 'special') return ownedSpecials.includes(item.id);
              return false;
            })
            .map(item => ({ ...item, owned: true }));
          
          setInventory(userInventory);
          
          // Load placed items from user's greenhouse layout
          setPlacedItems(userData.greenhouseLayout || []);
        } else {
          setError('User profile not found. Please complete your onboarding process.');
        }
        
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        if (err.code === 'permission-denied') {
          setError('Failed to load your greenhouse inventory: Missing or insufficient permissions. Please make sure you are signed in.');
        } else if (err.code === 'not-found') {
          setError('Your profile was not found. Please complete the onboarding process.');
        } else {
          setError(`Failed to load your greenhouse: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch data if we have a userId
    if (userId) {
      fetchUserData();
    } else {
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  const handleIdentityConfirmation = () => {
    if (!profile) return;
    
    if (fullName.trim() === '') {
      setError('Please enter your full name');
      return;
    }
    
    setIsIdentityConfirmed(true);
    setError('');
  };

  const handlePlaceItem = (inventoryItem: Plant) => {
    setSelectedInventoryItem(inventoryItem);
    setIsPlacingMode(true);
  };

  const handleGridClick = async (x: number, y: number) => {
    if (!isPlacingMode || !selectedInventoryItem) return;
    
    // Check if position is already occupied
    const isOccupied = placedItems.some(item => item.position.x === x && item.position.y === y);
    if (isOccupied) {
      setError('This position is already occupied');
      return;
    }

    try {
      setError(''); // Clear any previous errors
      
      const newPlacedItem: PlacedItem = {
        id: `placed_${Date.now()}`,
        itemId: selectedInventoryItem.id,
        position: { x, y },
        type: selectedInventoryItem.type
      };

      const updatedPlacedItems = [...placedItems, newPlacedItem];

      // Update local state first for immediate feedback
      setPlacedItems(updatedPlacedItems);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', userId), {
        greenhouseLayout: updatedPlacedItems
      });

      // Reset placing mode
      setIsPlacingMode(false);
      setSelectedInventoryItem(null);
    } catch (err: any) {
      console.error('Error placing item:', err);
      // Revert local state on error
      setPlacedItems(placedItems);
      
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please make sure you are signed in and try again.');
      } else {
        setError('Failed to place item: ' + err.message);
      }
    }
  };

  const handleRemoveItem = async (placedItemId: string) => {
    try {
      setError(''); // Clear any previous errors
      
      const updatedPlacedItems = placedItems.filter(item => item.id !== placedItemId);
      
      // Update local state first for immediate feedback
      setPlacedItems(updatedPlacedItems);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', userId), {
        greenhouseLayout: updatedPlacedItems
      });
    } catch (err: any) {
      console.error('Error removing item:', err);
      // Revert local state on error
      setPlacedItems(placedItems);
      
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please make sure you are signed in and try again.');
      } else {
        setError('Failed to remove item: ' + err.message);
      }
    }
  };

  const getItemById = (itemId: string) => {
    return allStoreItems.find(item => item.id === itemId);
  };

  const getPlacedItemAtPosition = (x: number, y: number) => {
    return placedItems.find(item => item.position.x === x && item.position.y === y);
  };

  const renderGreenhouseGrid = () => {
    const gridSize = 8; // 8x8 grid
    const grid = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const placedItem = getPlacedItemAtPosition(x, y);
        const item = placedItem ? getItemById(placedItem.itemId) : null;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`
              w-16 h-16 border border-gray-200 flex items-center justify-center cursor-pointer
              transition-colors duration-200 relative
              ${isPlacingMode && !placedItem ? 'hover:bg-green-100 border-green-300' : ''}
              ${placedItem ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}
            `}
            onClick={() => {
              if (isPlacingMode && !placedItem) {
                handleGridClick(x, y);
              }
            }}
          >
            {item && (
              <>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-contain"
                />
                {/* Remove button on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(placedItem.id);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 hover:opacity-100 transition-opacity"
                  title="Remove item"
                >
                  ×
                </button>
              </>
            )}
            {isPlacingMode && !placedItem && (
              <div className="text-gray-400 text-xs">+</div>
            )}
          </div>
        );
      }
    }
    
    return (
      <div className="grid grid-cols-8 gap-1 bg-green-100 p-4 rounded-lg border-2 border-green-200">
        {grid}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Greenhouse</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Try Again
            </button>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md"
            >
              Sign Out & Sign In Again
            </button>
          </div>
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img 
                src="/images/seed-icon.png" 
                alt="Seeds" 
                className="w-6 h-6 mr-2"
              />
              <span className="font-bold text-green-800">{profile.seeds}</span>
            </div>
            <button
              onClick={() => window.location.href = '/store'}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
            >
              Visit Store
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('garden')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'garden'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Garden
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'inventory'
                ? 'text-green-700 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inventory ({inventory.length})
          </button>
        </div>

        {activeTab === 'garden' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Virtual Garden</h3>
              {isPlacingMode ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600">
                    Click on an empty spot to place {selectedInventoryItem?.name}
                  </span>
                  <button
                    onClick={() => {
                      setIsPlacingMode(false);
                      setSelectedInventoryItem(null);
                    }}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-600">
                  {placedItems.length} items placed
                </span>
              )}
            </div>
            
            <div className="flex justify-center mb-6">
              {renderGreenhouseGrid()}
            </div>
            
            {placedItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Your greenhouse is empty. Visit the inventory tab to place items!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Inventory</h3>
            
            {inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Your inventory is empty.</p>
                <button
                  onClick={() => window.location.href = '/store'}
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Visit Store to Buy Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map(item => {
                  const isPlaced = placedItems.some(placed => placed.itemId === item.id);
                  
                  return (
                    <div 
                      key={item.id}
                      className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow ${
                        selectedItem?.id === item.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-center mb-3">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16"
                          />
                        </div>
                      </div>
                      <h4 className="text-center font-medium mb-2">{item.name}</h4>
                      <div className="flex justify-center">
                        {isPlaced ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Placed in Garden
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceItem(item);
                            }}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                          >
                            Place in Garden
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Item Details Panel */}
        {selectedItem && activeTab === 'inventory' && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name}
                  className="w-12 h-12"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-lg">{selectedItem.name}</h4>
                <p className="text-gray-600 text-sm">{selectedItem.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mr-2">
                    {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Cost: {selectedItem.seedCost} seeds
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Greenhouse Statistics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Items in Inventory</p>
            <p className="text-2xl font-bold text-green-800">{inventory.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Items Placed</p>
            <p className="text-2xl font-bold text-green-800">{placedItems.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Plants</p>
            <p className="text-2xl font-bold text-green-800">
              {inventory.filter(item => item.type === 'plant').length}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Accessories</p>
            <p className="text-2xl font-bold text-green-800">
              {inventory.filter(item => item.type === 'accessory').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greenhouse;