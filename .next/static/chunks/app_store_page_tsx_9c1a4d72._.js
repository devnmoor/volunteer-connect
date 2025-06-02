(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/store/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/store/page.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const StorePage = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [storeItems, setStoreItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc');
    const [purchaseSuccess, setPurchaseSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('price-asc');
    const [activeFilter, setActiveFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showPaymentModal, setShowPaymentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSeedPackage, setSelectedSeedPackage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [paymentDetails, setPaymentDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });
    const [paymentProcessing, setPaymentProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Get sorted and filtered items
    const getSortedAndFilteredItems = ()=>{
        // First, filter items
        let filteredItems = sampleStoreItems;
        if (activeFilter !== 'all') {
            filteredItems = sampleStoreItems.filter((item)=>item.type === activeFilter);
        }
        // Then, sort items by price
        let sortedItems = [
            ...filteredItems
        ];
        if (sortDirection === 'asc') {
            sortedItems.sort((a, b)=>a.seedCost - b.seedCost);
        } else {
            sortedItems.sort((a, b)=>b.seedCost - a.seedCost);
        }
        return sortedItems;
    };
    const handleSort = (direction)=>{
        setSortDirection(direction);
    };
    // Sample store data
    const sampleStoreItems = [
        // Original Plants
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
        // New Plants (with image assignments based on the provided images)
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
        {
            id: 'plant13',
            name: 'Tomato Plant',
            image: '/images/plants/tomato.png',
            description: 'A vibrant tomato plant with bright red fruits. Adds a splash of color to your greenhouse and symbolizes abundance and harvest.',
            seedCost: 60,
            type: 'plant'
        },
        {
            id: 'plant14',
            name: 'Cucumber Plant',
            image: '/images/plants/cucumber.png',
            description: 'A climbing vine with delicate tendrils and bright green cucumbers. Represents refreshment and cool summer gardens.',
            seedCost: 60,
            type: 'plant'
        },
        {
            id: 'plant15',
            name: 'Cabbage Plant',
            image: '/images/plants/cabbage.png',
            description: 'A hardy cabbage with a tight round head of crisp leaves. Symbolizes prosperity and health in many cultures.',
            seedCost: 60,
            type: 'plant'
        },
        {
            id: 'magic-flower',
            name: 'Magic Flower',
            seedCost: 500,
            type: 'plant',
            image: '/images/plants/magic-flower.png',
            description: 'A legendary bloom with glowing petals and mystical energy. Said to grant luck and beauty to any greenhouse it touches.'
        },
        // Original Accessories
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
        // New Accessories (with image assignments)
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
        {
            id: 'accessory9',
            name: 'Greenhouse Upgrade Kit',
            image: '/images/accessories/greenhouse-kit.png',
            description: 'Expands your greenhouse floor space, allowing you to add more plants and accessories.',
            seedCost: 100,
            type: 'accessory'
        },
        {
            id: 'accessory10',
            name: 'Misting System',
            image: '/images/accessories/misting-system.png',
            description: 'Adds a visual mist effect and provides a growth bonus to nearby plants.',
            seedCost: 50,
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
            id: 'special-magic-pollinator',
            name: 'Magic Pollinator',
            image: '/images/accessories/magic-pollinator.png',
            description: 'A rare and mystical garden enhancement that creates a shimmering cloud of magical pollen. When activated, it instantly advances all plants in your greenhouse to their next growth stage and enhances their visual appearance with a subtle, magical glow. The pollen cloud attracts ethereal butterflies and hummingbirds that will visit your greenhouse periodically. This legendary item is the pinnacle of greenhouse mastery, representing your dedication to volunteering and community service.',
            seedCost: 1000,
            type: 'special'
        }
    ];
    // Seed packages data
    const seedPackages = [
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StorePage.useEffect": ()=>{
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].onAuthStateChanged({
                "StorePage.useEffect.unsubscribe": async (user)=>{
                    if (user) {
                        setUser(user);
                        try {
                            // Get user profile
                            const userProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserProfile"])(user.uid);
                            if (userProfile) {
                                setProfile(userProfile);
                            } else {
                                router.push('/auth/onboarding');
                            }
                        } catch (err) {
                            setError(err.message);
                        } finally{
                            setLoading(false);
                        }
                    } else {
                        router.push('/auth/sign-in');
                    }
                }
            }["StorePage.useEffect.unsubscribe"]);
            // Set store items
            setStoreItems(sampleStoreItems);
            return ({
                "StorePage.useEffect": ()=>unsubscribe()
            })["StorePage.useEffect"];
        }
    }["StorePage.useEffect"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StorePage.useEffect": ()=>{
            setStoreItems(getSortedAndFilteredItems());
        }
    }["StorePage.useEffect"], [
        activeFilter,
        sortDirection
    ]);
    // Updated handlePurchase function for app/store/page.tsx
    // Updated handlePurchase function for the app/store/page.tsx file
    // Import necessary functions
    // Add this function to the store page component
    const handlePurchase = async ()=>{
        if (!user || !profile || !selectedItem) return;
        try {
            setLoading(true);
            // Check if user has enough seeds
            if (profile.seeds < selectedItem.seedCost) {
                setError('Not enough seeds to purchase this item');
                return;
            }
            // Determine which array to update based on the item type
            const itemTypeField = `${selectedItem.type}s`; // converts 'plant' to 'plants', etc.
            // Create a structure for the owned items if it doesn't exist yet
            const ownedItems = profile.ownedItems || {
                plants: [],
                accessories: [],
                specials: []
            };
            // Check if user already owns this item
            if (ownedItems[itemTypeField]?.includes(selectedItem.id)) {
                setError('You already own this item');
                setLoading(false);
                return;
            }
            // Prepare update data for Firestore
            const updateData = {
                // Decrement seeds by the item cost
                seeds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(-selectedItem.seedCost),
                // Add the item to the appropriate array using arrayUnion
                [`ownedItems.${itemTypeField}`]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(selectedItem.id),
                // Update the timestamp
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            };
            // Update Firestore
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid), updateData);
            // Update the local profile state
            const updatedOwnedItems = {
                ...ownedItems,
                [itemTypeField]: [
                    ...ownedItems[itemTypeField] || [],
                    selectedItem.id
                ]
            };
            setProfile({
                ...profile,
                seeds: profile.seeds - selectedItem.seedCost,
                ownedItems: updatedOwnedItems
            });
            setPurchaseSuccess(true);
            // Reset purchase success message after 3 seconds
            setTimeout(()=>{
                setPurchaseSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error purchasing item:', err);
            setError(err.message || 'Failed to purchase item');
        } finally{
            setLoading(false);
        }
    };
    // Replace the old handlePurchase function with this new one
    // Handle filter selection
    const handleFilterChange = (filter)=>{
        setActiveFilter(filter);
        if (filter === 'all') {
            setStoreItems(sampleStoreItems);
        } else {
            setStoreItems(sampleStoreItems.filter((item)=>item.type === filter));
        }
    };
    // Open payment modal
    const handleBuySeeds = (seedPackage)=>{
        setSelectedSeedPackage(seedPackage);
        setShowPaymentModal(true);
    };
    // Handle payment form input changes
    const handlePaymentInputChange = (e)=>{
        const { name, value } = e.target;
        setPaymentDetails((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // Process payment
    const handlePaymentSubmit = async (e)=>{
        e.preventDefault();
        if (!user || !selectedSeedPackage) return;
        try {
            setPaymentProcessing(true);
            // Simulate payment processing
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            // Update user's seed balance in Firestore
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid), {
                seeds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(selectedSeedPackage.amount),
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            // Update local profile
            setProfile((prev)=>prev ? {
                    ...prev,
                    seeds: (prev.seeds || 0) + selectedSeedPackage.amount
                } : null);
            // Reset form and close modal
            setPaymentDetails({
                cardNumber: '',
                cardName: '',
                expiryDate: '',
                cvv: ''
            });
            setShowPaymentModal(false);
            // Show success message
            setPurchaseSuccess(true);
            setTimeout(()=>{
                setPurchaseSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally{
            setPaymentProcessing(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
            }, void 0, false, {
                fileName: "[project]/app/store/page.tsx",
                lineNumber: 554,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/store/page.tsx",
            lineNumber: 553,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4 max-w-6xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-green-800",
                                        children: "Buy Seeds"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600",
                                        children: "Get more seeds to expand your virtual greenhouse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 566,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 564,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/images/seed-icon.png",
                                        alt: "Seeds",
                                        className: "w-6 h-6 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 569,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-green-800",
                                        children: profile?.seeds || 0
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 568,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 563,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-4 gap-4 overflow-auto max-h-[400px] pb-2",
                        children: seedPackages.map((pack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-lg p-4 hover:shadow-md transition-shadow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center mb-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: pack.image,
                                            alt: pack.name,
                                            className: "w-16 h-16"
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 582,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-center mb-1",
                                        children: pack.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-sm font-medium text-green-800 bg-green-50 px-3 py-1 rounded-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/images/seed-icon.png",
                                                    alt: "Seeds",
                                                    className: "w-4 h-4 mr-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 19
                                                }, this),
                                                pack.amount,
                                                " seeds"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 590,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-center text-gray-700 font-medium mb-3",
                                        children: [
                                            "$",
                                            pack.price
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 599,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleBuySeeds(pack),
                                        className: "w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md hover:cursor-pointer",
                                        children: "Buy Now"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 600,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, pack.id, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 580,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/store/page.tsx",
                lineNumber: 562,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl font-bold text-green-800",
                                        children: "Volunteer Connect Store"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 615,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600",
                                        children: "Use your seeds to purchase plants and accessories for your greenhouse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 614,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/images/seed-icon.png",
                                        alt: "Seeds",
                                        className: "w-6 h-6 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 619,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-green-800",
                                        children: profile?.seeds || 0
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 624,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 618,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-3 bg-red-100 text-red-700 rounded",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 629,
                        columnNumber: 11
                    }, this),
                    purchaseSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-3 bg-green-100 text-green-700 rounded",
                        children: selectedItem ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                "Successfully purchased ",
                                selectedItem.name,
                                "!"
                            ]
                        }, void 0, true) : selectedSeedPackage ? `Successfully purchased ${selectedSeedPackage.amount} seeds!` : 'Purchase successful!'
                    }, void 0, false, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 635,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold mb-4",
                                        children: "Available Items"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 651,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap justify-between items-center mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap space-x-2 mb-2 sm:mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `px-4 py-2 rounded-md ${activeFilter === 'all' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'}`,
                                                        onClick: ()=>handleFilterChange('all'),
                                                        children: "All"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 655,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `px-4 py-2 rounded-md ${activeFilter === 'plant' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'}`,
                                                        onClick: ()=>handleFilterChange('plant'),
                                                        children: "Plants"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 664,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `px-4 py-2 rounded-md ${activeFilter === 'accessory' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'}`,
                                                        onClick: ()=>handleFilterChange('accessory'),
                                                        children: "Accessories"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 673,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: `px-4 py-2 rounded-md ${activeFilter === 'special' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-600 hover:text-white hover:cursor-pointer'}`,
                                                        onClick: ()=>handleFilterChange('special'),
                                                        children: "Special Items"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 682,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'),
                                                className: "flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 rounded-md transition-colors",
                                                "aria-label": `Sort by price: ${sortDirection === 'asc' ? 'Low to High' : 'High to Low'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-green-800 text-sm font-medium mr-2",
                                                        children: "Price"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 699,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative w-4 h-5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 20 20",
                                                                fill: "currentColor",
                                                                className: `absolute top-0 w-4 h-4 transition-opacity duration-200 ${sortDirection === 'asc' ? 'text-green-800 opacity-100' : 'text-gray-400 opacity-50'}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/store/page.tsx",
                                                                    lineNumber: 709,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 702,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                viewBox: "0 0 20 20",
                                                                fill: "currentColor",
                                                                className: `absolute bottom-0 w-4 h-4 transition-opacity duration-200 ${sortDirection === 'desc' ? 'text-green-800 opacity-100' : 'text-gray-400 opacity-50'}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fillRule: "evenodd",
                                                                    d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                                                                    clipRule: "evenodd"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/store/page.tsx",
                                                                    lineNumber: 724,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 717,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/page.tsx",
                                                lineNumber: 694,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 653,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto max-h-[600px] pb-2",
                                        children: storeItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow ${selectedItem?.id === item.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`,
                                                onClick: ()=>setSelectedItem(item),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: item.image,
                                                                    alt: item.name,
                                                                    className: "w-16 h-16"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/store/page.tsx",
                                                                    lineNumber: 745,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 744,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 743,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-medium text-center",
                                                            children: item.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 752,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center mt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center text-sm font-medium text-green-800 bg-green-50 px-2 py-1 rounded-full",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: "/images/seed-icon.png",
                                                                        alt: "Seeds",
                                                                        className: "w-4 h-4 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/store/page.tsx",
                                                                        lineNumber: 755,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    item.seedCost
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 754,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 753,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 19
                                                }, this)
                                            }, item.id, false, {
                                                fileName: "[project]/app/store/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 734,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 650,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 rounded-lg p-4",
                                children: selectedItem ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-semibold mb-2",
                                            children: selectedItem.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 773,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-center mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-32 h-32 bg-green-100 rounded-full flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: selectedItem.image,
                                                    alt: selectedItem.name,
                                                    className: "w-24 h-24"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/store/page.tsx",
                                                lineNumber: 775,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 774,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700 mb-4",
                                            children: selectedItem.description
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 783,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-50 p-3 rounded-md mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium text-green-800",
                                                        children: "Cost:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 786,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: "/images/seed-icon.png",
                                                                alt: "Seeds",
                                                                className: "w-4 h-4 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold",
                                                                children: selectedItem.seedCost
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/store/page.tsx",
                                                                lineNumber: 793,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/store/page.tsx",
                                                        lineNumber: 787,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/store/page.tsx",
                                                lineNumber: 785,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 784,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handlePurchase,
                                            disabled: loading || (profile?.seeds || 0) < selectedItem.seedCost,
                                            className: `w-full py-2 px-4 rounded-md hover:cursor-pointer ${(profile?.seeds || 0) < selectedItem.seedCost ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`,
                                            children: loading ? 'Processing...' : (profile?.seeds || 0) < selectedItem.seedCost ? 'Not Enough Seeds' : 'Purchase'
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 797,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 772,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8 text-gray-500",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Select an item to view details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 814,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 813,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 770,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 648,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/store/page.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-green-800 mb-4",
                        children: "How to Earn Seeds"
                    }, void 0, false, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 822,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-4",
                        children: "Complete volunteering tasks to earn seeds that you can use to purchase plants and accessories for your greenhouse."
                    }, void 0, false, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 823,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-green-800 mb-2",
                                        children: "Complete Weekly Tasks"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 829,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Earn 5 seeds for completing all your weekly volunteering tasks."
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 830,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 828,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-green-800 mb-2",
                                        children: "Group Volunteering"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 836,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Earn bonus seeds when you volunteer with other Volunteer Connect users."
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 837,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 835,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-green-800 mb-2",
                                        children: "Special Events"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 843,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600",
                                        children: "Participate in special volunteering events to earn extra seeds."
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 844,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/store/page.tsx",
                                lineNumber: 842,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/store/page.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/store/page.tsx",
                lineNumber: 821,
                columnNumber: 7
            }, this),
            showPaymentModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold",
                                    children: "Purchase Seeds"
                                }, void 0, false, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 856,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowPaymentModal(false),
                                    className: "text-gray-500 hover:text-gray-700",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-6 w-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 862,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 861,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 857,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/page.tsx",
                            lineNumber: 855,
                            columnNumber: 13
                        }, this),
                        selectedSeedPackage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: selectedSeedPackage.image,
                                        alt: selectedSeedPackage.name,
                                        className: "w-20 h-20"
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 870,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 869,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium",
                                            children: selectedSeedPackage.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 877,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/images/seed-icon.png",
                                                    alt: "Seeds",
                                                    className: "w-4 h-4 mr-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 879,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        selectedSeedPackage.amount,
                                                        " seeds"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 884,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 878,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-lg mt-2",
                                            children: [
                                                "$",
                                                selectedSeedPackage.price
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 886,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 876,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/page.tsx",
                            lineNumber: 868,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handlePaymentSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Card Number"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 894,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "cardNumber",
                                                    value: paymentDetails.cardNumber,
                                                    onChange: handlePaymentInputChange,
                                                    placeholder: "1234 5678 9012 3456",
                                                    className: "w-full px-3 py-2 border rounded-md",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 897,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 893,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Name on Card"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "cardName",
                                                    value: paymentDetails.cardName,
                                                    onChange: handlePaymentInputChange,
                                                    placeholder: "John Doe",
                                                    className: "w-full px-3 py-2 border rounded-md",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 912,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 908,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                            children: "Expiry Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 925,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "expiryDate",
                                                            value: paymentDetails.expiryDate,
                                                            onChange: handlePaymentInputChange,
                                                            placeholder: "MM/YY",
                                                            className: "w-full px-3 py-2 border rounded-md",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 928,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 924,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                                            children: "CVV"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 940,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "cvv",
                                                            value: paymentDetails.cvv,
                                                            onChange: handlePaymentInputChange,
                                                            placeholder: "123",
                                                            className: "w-full px-3 py-2 border rounded-md",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/store/page.tsx",
                                                            lineNumber: 943,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 939,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 923,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 892,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: paymentProcessing,
                                        className: "w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md",
                                        children: paymentProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "animate-spin rounded-full h-5 w-5 border-2 border-b-0 border-white mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/store/page.tsx",
                                                    lineNumber: 964,
                                                    columnNumber: 23
                                                }, this),
                                                "Processing..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 963,
                                            columnNumber: 21
                                        }, this) : `Pay $${selectedSeedPackage?.price.toFixed(2)}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/store/page.tsx",
                                        lineNumber: 957,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 956,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 text-xs text-gray-500 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Your payment information is secure and encrypted."
                                        }, void 0, false, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 974,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1",
                                            children: [
                                                "You will be charged $",
                                                selectedSeedPackage?.price.toFixed(2),
                                                " for ",
                                                selectedSeedPackage?.amount,
                                                " seeds."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/store/page.tsx",
                                            lineNumber: 975,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/store/page.tsx",
                                    lineNumber: 973,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/store/page.tsx",
                            lineNumber: 891,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/store/page.tsx",
                    lineNumber: 854,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/store/page.tsx",
                lineNumber: 853,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/store/page.tsx",
        lineNumber: 560,
        columnNumber: 5
    }, this);
};
_s(StorePage, "kxmQ8qewQFDnNy+mGEyF0FgnAe4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = StorePage;
const __TURBOPACK__default__export__ = StorePage;
var _c;
__turbopack_context__.k.register(_c, "StorePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_store_page_tsx_9c1a4d72._.js.map