// app/store/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import { db } from '@/app/lib/firebase/config';
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';

// Updated StoreItem interface to include special type
interface StoreItem {
  id: string;
  name: string;
  image: string;
  description: string;
  seedCost: number;
  type: 'plant' | 'accessory' | 'special';
}

interface SeedPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  image: string;
}

const StorePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSeedPackage, setSelectedSeedPackage] = useState<SeedPackage | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [ownedItems, setOwnedItems] = useState<{plants: string[], accessories: string[], specials: string[]}>({
    plants: [],
    accessories: [],
    specials: []
  });

  // Sample store data - comprehensive list
  const sampleStoreItems: StoreItem[] = [
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
    {
      id: 'plant9',
      name: 'Succulent Tray',
      image: '/images/plants/succulent.png',
      description: 'A collection of small, low-maintenance succulents arranged in a decorative tray.',
      seedCost: 18,
      type: 'plant'
    },
    {
      id: 'plant10',
      name: 'Vegetable Patch',
      image: '/images/plants/vegetable-patch.png',
      description: 'Grow your own virtual vegetables including tomatoes, carrots, and more!',
      seedCost: 40,
      type: 'plant'
    },
    {
      id: 'plant11',
      name: 'Cherry Blossom Tree',
      image: '/images/plants/cherry-blossom.png',
      description: 'A beautiful tree with delicate pink blossoms. Features a special seasonal bloom animation.',
      seedCost: 120,
      type: 'plant'
    },
    {
      id: 'plant12',
      name: 'Vine Archway',
      image: '/images/plants/vine-archway.png',
      description: 'A decorative entrance for your greenhouse covered in beautiful climbing vines.',
      seedCost: 60,
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
    {
      id: 'accessory6',
      name: 'Wind Chime',
      image: '/images/accessories/wind-chime.png',
      description: 'Adds gentle visual and auditory ambiance to your greenhouse space.',
      seedCost: 15,
      type: 'accessory'
    },
    {
      id: 'accessory7',
      name: 'Hummingbird Feeder',
      image: '/images/accessories/hummingbird-feeder.png',
      description: 'Attracts colorful hummingbirds to your greenhouse with special animations.',
      seedCost: 30,
      type: 'accessory'
    },
    {
      id: 'accessory8',
      name: 'Solar Lamp',
      image: '/images/accessories/solar-lamp.png',
      description: 'Environmentally friendly lighting that glows softly at night.',
      seedCost: 22,
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
    },
    {
      id: 'special4',
      name: 'Volunteer Plaque',
      image: '/images/accessories/volunteer-plaque.png',
      description: 'A customizable plaque to show off your volunteering achievements, personalized with your name.',
      seedCost: 10,
      type: 'special'
    },
    {
      id: 'special5',
      name: 'Community Tree',
      image: '/images/plants/community-tree.png',
      description: 'A special tree that unlocks collaborative watering animations with other volunteers.',
      seedCost: 200,
      type: 'special'
    },
    {
      id: 'magic-flower',
      name: 'Magic Flower',
      seedCost: 500,
      type: 'special',
      image: '/images/plants/magic-flower.png',
      description: 'A legendary bloom with glowing petals and mystical energy. Said to grant luck and beauty to any greenhouse it touches.'
    },
    {
      id: 'special-magic-pollinator',
      name: 'Magic Pollinator',
      image: '/images/accessories/magic-pollinator.png',
      description: 'A rare and mystical garden enhancement that creates a shimmering cloud of magical pollen.',
      seedCost: 1000,
      type: 'special'
    }
  ];

  // Seed packages data
  const seedPackages: SeedPackage[] = [
    {
      id: 'seed-pack-1',
      name: 'Greenie Pack',
      amount: 50,
      price: 1.99,
      image: '/images/seed-pack-small.png'
    },
    {
      id: 'seed-pack-2',
      name: 'Garden Pack',
      amount: 150,
      price: 4.99,
      image: '/images/seed-pack-medium.png'
    },
    {
      id: 'seed-pack-3',
      name: 'Forest Pack',
      amount: 500,
      price: 9.99,
      image: '/images/seed-pack-large.png'
    },
    {
      id: 'seed-pack-4',
      name: 'Conservation Pack',
      amount: 1200,
      price: 19.99,
      image: '/images/seed-pack-xl.png'
    }
  ];

  // Get sorted and filtered items
  const getSortedAndFilteredItems = () => {
    // First, filter items
    let filteredItems = sampleStoreItems;
    if (activeFilter !== 'all') {
      filteredItems = sampleStoreItems.filter(item => item.type === activeFilter);
    }

    // Then, sort items by price
    let sortedItems = [...filteredItems];
    if (sortDirection === 'asc') {
      sortedItems.sort((a, b) => a.seedCost - b.seedCost);
    } else {
      sortedItems.sort((a, b) => b.seedCost - a.seedCost);
    }

    return sortedItems;
  };

  // Check if item is owned
  const isItemOwned = (item: StoreItem) => {
    if (item.type === 'plant') return ownedItems.plants.includes(item.id);
    if (item.type === 'accessory') return ownedItems.accessories.includes(item.id);
    if (item.type === 'special') return ownedItems.specials.includes(item.id);
    return false;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
            
            // Extract owned items from profile
            const profileWithItems = userProfile as UserProfile & {
              ownedItems?: {
                plants?: string[];
                accessories?: string[];
                specials?: string[];
              };
            };
            
            setOwnedItems({
              plants: profileWithItems.ownedItems?.plants || [],
              accessories: profileWithItems.ownedItems?.accessories || [],
              specials: profileWithItems.ownedItems?.specials || []
            });
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

  useEffect(() => {
    setStoreItems(getSortedAndFilteredItems());
  }, [activeFilter, sortDirection, ownedItems]);

  const handlePurchase = async () => {
    if (!user || !profile || !selectedItem) return;

    // Check if item is already owned
    if (isItemOwned(selectedItem)) {
      setError('You already own this item');
      return;
    }

    try {
      setLoading(true);

      // Check if user has enough seeds
      if (profile.seeds < selectedItem.seedCost) {
        setError('Not enough seeds to purchase this item');
        return;
      }

      // Determine which array to update based on item type
      let updateField = '';
      let newOwnedItems = { ...ownedItems };
      
      if (selectedItem.type === 'plant') {
        updateField = 'ownedItems.plants';
        newOwnedItems.plants = [...ownedItems.plants, selectedItem.id];
      } else if (selectedItem.type === 'accessory') {
        updateField = 'ownedItems.accessories';
        newOwnedItems.accessories = [...ownedItems.accessories, selectedItem.id];
      } else if (selectedItem.type === 'special') {
        updateField = 'ownedItems.specials';
        newOwnedItems.specials = [...ownedItems.specials, selectedItem.id];
      }

      // Update user's profile in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        seeds: increment(-selectedItem.seedCost),
        [updateField]: arrayUnion(selectedItem.id),
        updatedAt: serverTimestamp()
      });

      // Update local state
      setProfile({
        ...profile,
        seeds: profile.seeds - selectedItem.seedCost
      });
      
      setOwnedItems(newOwnedItems);

      setPurchaseSuccess(true);
      setSelectedItem(null); // Clear selection

      // Reset purchase success message after 3 seconds
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter selection
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Open payment modal
  const handleBuySeeds = (seedPackage: SeedPackage) => {
    setSelectedSeedPackage(seedPackage);
    setShowPaymentModal(true);
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Process payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedSeedPackage) return;

    try {
      setPaymentProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user's seed balance in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        seeds: increment(selectedSeedPackage.amount),
        updatedAt: serverTimestamp()
      });

      // Update local profile
      setProfile(prev => prev ? {
        ...prev,
        seeds: (prev.seeds || 0) + selectedSeedPackage.amount
      } : null);

      // Reset form and close modal
      setPaymentDetails({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      });
      setShowPaymentModal(false);

      // Show success message
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Buy Seeds Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Buy Seeds</h2>
            <p className="text-gray-600">Get more seeds to expand your virtual greenhouse</p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-auto max-h-[400px] pb-2">
          {seedPackages.map(pack => (
            <div key={pack.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-3">
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-lg font-semibold text-center mb-1">{pack.name}</h3>
              <div className="flex justify-center mb-2">
                <div className="flex items-center text-sm font-medium text-green-800 bg-green-50 px-3 py-1 rounded-full">
                  <img
                    src="/images/seed-icon.png"
                    alt="Seeds"
                    className="w-4 h-4 mr-1"
                  />
                  {pack.amount} seeds
                </div>
              </div>
              <p className="text-center text-gray-700 font-medium mb-3">${pack.price}</p>
              <button
                onClick={() => handleBuySeeds(pack)}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md hover:cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Store Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Volunteer Connect Store</h2>
            <p className="text-gray-600">Use your seeds to purchase plants and accessories for your greenhouse</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src="/images/seed-icon.png"
                alt="Seeds"
                className="w-6 h-6 mr-2"
              />
              <span className="font-bold text-green-800">{profile?.seeds || 0}</span>
            </div>
            <button
              onClick={() => router.push('/greenhouse')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Visit Greenhouse
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {purchaseSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {selectedItem ?
              `Successfully purchased ${selectedItem.name}! Check your greenhouse inventory.` :
              selectedSeedPackage ?
                `Successfully purchased ${selectedSeedPackage.amount} seeds!` :
                'Purchase successful!'}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Store Items */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Items</h3>
              <div className="text-sm text-gray-600">
                Owned: {ownedItems.plants.length + ownedItems.accessories.length + ownedItems.specials.length} items
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex flex-wrap space-x-2 mb-2 sm:mb-0">
                <button
                  className={`px-4 py-2 rounded-md ${activeFilter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'
                    }`}
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeFilter === 'plant'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'
                    }`}
                  onClick={() => handleFilterChange('plant')}
                >
                  Plants ({ownedItems.plants.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeFilter === 'accessory'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'
                    }`}
                  onClick={() => handleFilterChange('accessory')}
                >
                  Accessories ({ownedItems.accessories.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${activeFilter === 'special'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'
                    }`}
                  onClick={() => handleFilterChange('special')}
                >
                  Special Items ({ownedItems.specials.length})
                </button>
              </div>

              {/* Sort button */}
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                aria-label={`Sort by price: ${sortDirection === 'asc' ? 'Low to High' : 'High to Low'}`}
              >
                <span className="text-green-800 text-sm font-medium mr-2">Price</span>
                <div className="relative w-4 h-5">
                  {/* Up arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`absolute top-0 w-4 h-4 transition-opacity duration-200 ${sortDirection === 'asc' ? 'text-green-800 opacity-100' : 'text-gray-400 opacity-50'
                      }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>

                  {/* Down arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`absolute bottom-0 w-4 h-4 transition-opacity duration-200 ${sortDirection === 'desc' ? 'text-green-800 opacity-100' : 'text-gray-400 opacity-50'
                      }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto max-h-[600px] pb-2">
              {storeItems.map(item => {
                const itemOwned = isItemOwned(item);
                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow relative ${
                      selectedItem?.id === item.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                    } ${itemOwned ? 'bg-green-50 border-green-300' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Owned indicator */}
                    {itemOwned && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Owned
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex justify-center mb-3">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                          itemOwned ? 'bg-green-200' : 'bg-green-100'
                        }`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16"
                          />
                        </div>
                      </div>
                      <h4 className="font-medium text-center">{item.name}</h4>
                      <div className="flex justify-center mt-2">
                        <div className={`flex items-center text-sm font-medium rounded-full px-2 py-1 ${
                          itemOwned 
                            ? 'text-green-800 bg-green-100' 
                            : 'text-green-800 bg-green-50'
                        }`}>
                          <img
                            src="/images/seed-icon.png"
                            alt="Seeds"
                            className="w-4 h-4 mr-1"
                          />
                          {item.seedCost}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            {selectedItem ? (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                  {isItemOwned(selectedItem) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Owned
                    </span>
                  )}
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-24 h-24"
                    />
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                
                <div className="bg-green-50 p-3 rounded-md mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Cost:</span>
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
                
                {isItemOwned(selectedItem) ? (
                  <div className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-md text-center font-medium">
                    Already Owned
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={loading || (profile?.seeds || 0) < selectedItem.seedCost}
                    className={`w-full py-2 px-4 rounded-md ${
                      (profile?.seeds || 0) < selectedItem.seedCost
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {loading ? 'Processing...' : (
                      (profile?.seeds || 0) < selectedItem.seedCost
                        ? 'Not Enough Seeds'
                        : 'Purchase'
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to Earn Seeds Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">How to Earn Seeds</h2>
        <p className="text-gray-600 mb-4">
          Complete volunteering tasks to earn seeds that you can use to purchase plants and accessories for your greenhouse.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Complete Weekly Tasks</h3>
            <p className="text-sm text-gray-600">
              Earn 5 seeds for completing all your weekly volunteering tasks.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Group Volunteering</h3>
            <p className="text-sm text-gray-600">
              Earn bonus seeds when you volunteer with other Volunteer Connect users.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Special Events</h3>
            <p className="text-sm text-gray-600">
              Participate in special volunteering events to earn extra seeds.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Purchase Seeds</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedSeedPackage && (
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={selectedSeedPackage.image}
                    alt={selectedSeedPackage.name}
                    className="w-20 h-20"
                  />
                </div>
                <div className="text-center mb-4">
                  <h4 className="font-medium">{selectedSeedPackage.name}</h4>
                  <div className="flex items-center justify-center mt-1">
                    <img
                      src="/images/seed-icon.png"
                      alt="Seeds"
                      className="w-4 h-4 mr-1"
                    />
                    <span>{selectedSeedPackage.amount} seeds</span>
                  </div>
                  <p className="font-medium text-lg mt-2">${selectedSeedPackage.price}</p>
                </div>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentDetails.cardName}
                    onChange={handlePaymentInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  {paymentProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-0 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ${selectedSeedPackage?.price.toFixed(2)}`
                  )}
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Your payment information is secure and encrypted.</p>
                <p className="mt-1">You will be charged ${selectedSeedPackage?.price.toFixed(2)} for {selectedSeedPackage?.amount} seeds.</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;