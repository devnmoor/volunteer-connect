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
  serverTimestamp
} from 'firebase/firestore';

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

interface PlacedItem {
  id: string;
  itemId: string;
  position: { x: number; y: number };
  type: 'plant' | 'accessory' | 'special';
}

const Greenhouse = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inventory, setInventory] = useState<PlantOrItem[]>([]);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<PlantOrItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<PlantOrItem | null>(null);
  const [activeTab, setActiveTab] = useState<'garden' | 'inventory'>('garden');

  // All available items from store
  const allStoreItems: PlantOrItem[] = [
    // Plants
    {
      id: 'plant1',
      name: 'Sunflower',
      image: '/images/plants/sunflower.png',
      description: 'A tall, cheerful flower that follows the sun. Sunflowers represent adoration, loyalty, and longevity.',
      seedCost: 5,
      type: 'plant'
    },
    {
      id: 'plant2',
      name: 'Oak Tree',
      image: '/images/plants/oak.png',
      description: 'A strong, majestic tree that can live for hundreds of years. Oak trees symbolize strength, endurance, and wisdom.',
      seedCost: 50,
      type: 'plant'
    },
    {
      id: 'plant3',
      name: 'Rose Bush',
      image: '/images/plants/rose.png',
      description: 'Beautiful flowers with thorny stems. Roses are traditional symbols of love and passion.',
      seedCost: 25,
      type: 'plant'
    },
    {
      id: 'plant4',
      name: 'Cactus',
      image: '/images/plants/cactus.png',
      description: 'A hardy desert plant that requires little water. Cacti represent endurance and protection.',
      seedCost: 15,
      type: 'plant'
    },
    {
      id: 'plant5',
      name: 'Bonsai Tree',
      image: '/images/plants/bonsai.png',
      description: 'A miniature tree grown in a small container. Bonsai trees symbolize harmony, balance, and patience.',
      seedCost: 100,
      type: 'plant'
    },
    {
      id: 'plant6',
      name: 'Lavender Bush',
      image: '/images/plants/lavender.png',
      description: 'A calming purple plant known for its soothing aroma and beautiful blooms.',
      seedCost: 20,
      type: 'plant'
    },
    {
      id: 'plant7',
      name: 'Apple Tree',
      image: '/images/plants/apple-tree.png',
      description: 'A fruit-bearing tree that produces delicious apples. A symbol of abundance and nourishment.',
      seedCost: 75,
      type: 'plant'
    },
    {
      id: 'plant8',
      name: 'Hanging Fern',
      image: '/images/plants/hanging-fern.png',
      description: 'A lush green fern perfect for adding vertical interest to your greenhouse.',
      seedCost: 15,
      type: 'plant'
    },
    // Accessories
    {
      id: 'accessory1',
      name: 'Watering Can',
      image: '/images/accessories/watering-can.png',
      description: 'A decorative watering can for your virtual greenhouse.',
      seedCost: 20,
      type: 'accessory'
    },
    {
      id: 'accessory2',
      name: 'Garden Bench',
      image: '/images/accessories/bench.png',
      description: 'A peaceful place to sit and admire your plants.',
      seedCost: 30,
      type: 'accessory'
    },
    {
      id: 'accessory3',
      name: 'Bird Bath',
      image: '/images/accessories/bird-bath.png',
      description: 'Attract virtual birds to your greenhouse.',
      seedCost: 35,
      type: 'accessory'
    },
    {
      id: 'accessory4',
      name: 'Compost Bin',
      image: '/images/accessories/compost.png',
      description: 'A natural way to recycle plant waste and boost your greenhouse\'s eco-friendly feel.',
      seedCost: 25,
      type: 'accessory'
    },
    {
      id: 'accessory5',
      name: 'Plant Shelf',
      image: '/images/accessories/plant-shelf.png',
      description: 'An attractive wooden shelf perfect for organizing and displaying your smaller plants.',
      seedCost: 35,
      type: 'accessory'
    },
    // Special Items
    {
      id: 'special1',
      name: 'Rare Orchid',
      image: '/images/plants/rare-orchid.png',
      description: 'An ultra-rare flower with stunning blooms. A true collector\'s item for your greenhouse.',
      seedCost: 150,
      type: 'special'
    },
    {
      id: 'special2',
      name: 'Bee Box',
      image: '/images/accessories/bee-box.png',
      description: 'Houses virtual bees that help pollinate nearby plants, enhancing their appearance.',
      seedCost: 40,
      type: 'special'
    },
    {
      id: 'special3',
      name: 'Holiday Lights',
      image: '/images/accessories/holiday-lights.png',
      description: 'Festive lights to brighten your greenhouse during special seasonal events.',
      seedCost: 20,
      type: 'special'
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
            await fetchUserItems(user.uid);
          } else {
            router.push('/auth/onboarding');
          }
        } catch (err: any) {
          console.error('Error loading greenhouse:', err);
          if (err.code === 'permission-denied') {
            setError('Permission denied. Please make sure you are signed in and try again.');
          } else {
            setError('Failed to load your greenhouse: ' + err.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/auth/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user's purchased items and their placements
  const fetchUserItems = async (userId: string) => {
    try {
      setError('');

      // Get user's document
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data() as UserProfile & {
        ownedItems?: {
          plants?: string[];
          accessories?: string[];
          specials?: string[];
        };
        greenhouseLayout?: PlacedItem[];
      };

      // Get owned items from user profile
      const ownedItems = userData.ownedItems || {
        plants: [],
        accessories: [],
        specials: []
      };

      // Create inventory from owned items
      const userInventory = allStoreItems.filter(item => {
        if (item.type === 'plant') return ownedItems.plants?.includes(item.id);
        if (item.type === 'accessory') return ownedItems.accessories?.includes(item.id);
        if (item.type === 'special') return ownedItems.specials?.includes(item.id);
        return false;
      });

      setInventory(userInventory);

      // Load placed items from user's greenhouse layout
      setPlacedItems(userData.greenhouseLayout || []);

    } catch (err: any) {
      console.error('Error fetching user items:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please make sure you are signed in.');
      } else {
        setError('Failed to load your greenhouse inventory: ' + err.message);
      }
    }
  };

  const handlePlaceItem = (inventoryItem: PlantOrItem) => {
    setSelectedInventoryItem(inventoryItem);
    setIsPlacingMode(true);
    setActiveTab('garden'); // Switch to garden view
  };

  const handleGridClick = async (x: number, y: number) => {
    if (!isPlacingMode || !selectedInventoryItem || !user) return;

    // Check if position is already occupied
    const isOccupied = placedItems.some(item => item.position.x === x && item.position.y === y);
    if (isOccupied) {
      setError('This position is already occupied');
      return;
    }

    try {
      setError('');

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
      await updateDoc(doc(db, 'users', user.uid), {
        greenhouseLayout: updatedPlacedItems,
        updatedAt: serverTimestamp()
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
    if (!user) return;

    try {
      setError('');

      const updatedPlacedItems = placedItems.filter(item => item.id !== placedItemId);

      // Update local state first for immediate feedback
      setPlacedItems(updatedPlacedItems);

      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        greenhouseLayout: updatedPlacedItems,
        updatedAt: serverTimestamp()
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
            transition-colors duration-200 relative group
            ${isPlacingMode && !placedItem ? 'hover:bg-green-100 border-green-300' : ''}
            ${placedItem ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'}
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
                {/* Remove/Unplace button - shows on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(placedItem.id);
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  title={`Unplace ${item.name}`}
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error loading your greenhouse. Please try again later.
        </div>
      </div>
    );
  }

  // Categorize inventory items
  const plants = inventory.filter(item => item.type === 'plant');
  const accessories = inventory.filter(item => item.type === 'accessory');
  const specialItems = inventory.filter(item => item.type === 'special');

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Your Greenhouse</h2>
            <p className="text-gray-600">Arrange your plants and accessories in your virtual greenhouse</p>
          </div>
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
              onClick={() => router.push('/store')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
            >
              Visit Store
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Inventory summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Plants</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-green-600 font-bold">🌱</span>
              </div>
              <span className="text-lg font-bold">{plants.length}</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Accessories</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600 font-bold">🛠️</span>
              </div>
              <span className="text-lg font-bold">{accessories.length}</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Special Items</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-purple-600 font-bold">✨</span>
              </div>
              <span className="text-lg font-bold">{specialItems.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('garden')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'garden'
              ? 'text-green-700 border-b-2 border-green-500'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            My Garden
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'inventory'
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
                  onClick={() => router.push('/store')}
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Visit Store to Buy Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plants */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <span className="w-5 h-5 bg-green-100 rounded-full mr-2"></span>
                    Plants ({plants.length})
                  </h4>

                  {plants.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                      No plants yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {plants.map((plant) => {
                        const isPlaced = placedItems.some(placed => placed.itemId === plant.id);

                        return (
                          <div
                            key={plant.id}
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                <img
                                  src={plant.image}
                                  alt={plant.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium">{plant.name}</h5>
                                <p className="text-xs text-gray-500">{plant.seedCost} seeds</p>
                              </div>
                              <div>
                                {isPlaced ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Placed
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handlePlaceItem(plant)}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                                  >
                                    Place
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Accessories */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <span className="w-5 h-5 bg-yellow-100 rounded-full mr-2"></span>
                    Accessories ({accessories.length})
                  </h4>

                  {accessories.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                      No accessories yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {accessories.map((accessory) => {
                        const isPlaced = placedItems.some(placed => placed.itemId === accessory.id);

                        return (
                          <div
                            key={accessory.id}
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                                <img
                                  src={accessory.image}
                                  alt={accessory.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium">{accessory.name}</h5>
                                <p className="text-xs text-gray-500">{accessory.seedCost} seeds</p>
                              </div>
                              <div>
                                {isPlaced ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Placed
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handlePlaceItem(accessory)}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                                  >
                                    Place
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Special Items */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <span className="w-5 h-5 bg-purple-100 rounded-full mr-2"></span>
                    Special Items ({specialItems.length})
                  </h4>

                  {specialItems.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
                      No special items yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {specialItems.map((item) => {
                        const isPlaced = placedItems.some(placed => placed.itemId === item.id);

                        return (
                          <div
                            key={item.id}
                            className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-medium">{item.name}</h5>
                                <p className="text-xs text-gray-500">{item.seedCost} seeds</p>
                              </div>
                              <div>
                                {isPlaced ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Placed
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handlePlaceItem(item)}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                                  >
                                    Place
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
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
            <p className="text-2xl font-bold text-green-800">{plants.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Accessories</p>
            <p className="text-2xl font-bold text-green-800">{accessories.length}</p>
          </div>
        </div>

        {/* Visit Store Banner */}
        <div className="mt-6 border-t pt-6">
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

              {!placedItems.some(placed => placed.itemId === selectedItem.id) && (
                <button
                  onClick={() => {
                    setShowItemDetails(false);
                    handlePlaceItem(selectedItem);
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