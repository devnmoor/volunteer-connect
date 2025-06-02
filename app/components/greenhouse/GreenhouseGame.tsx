// app/components/greenhouse/GreenhouseGame.tsx
'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

// Define the Plant interface
interface PlantItem {
  id: string;
  name: string;
  image: string;
  description: string;
  seedCost: number;
  owned: boolean;
  type: 'plant' | 'accessory' | 'special';
}

interface GreenhouseGameProps {
  ownedPlants: PlantItem[];
  ownedAccessories: PlantItem[];
  ownedSpecialItems: PlantItem[];
}

// Define the rooms in the greenhouse
const greenhouseRooms = [
  { id: 'main', name: 'Main Growing Room', background: '/images/greenhouse/main-room.jpg' },
  { id: 'propagation', name: 'Propagation Room', background: '/images/greenhouse/propagation-room.jpg' },
  { id: 'showcase', name: 'Showcase Room', background: '/images/greenhouse/showcase-room.jpg' },
  { id: 'watering', name: 'Watering & Care Station', background: '/images/greenhouse/watering-station.jpg' },
  { id: 'storage', name: 'Storage & Workshop', background: '/images/greenhouse/storage-room.jpg' },
  { id: 'market', name: 'Market Room', background: '/images/greenhouse/market-room.jpg' },
  { id: 'lab', name: 'Hybrid Lab', background: '/images/greenhouse/hybrid-lab.jpg' }
];

const GreenhouseGame = forwardRef<any, GreenhouseGameProps>(({ 
  ownedPlants, 
  ownedAccessories, 
  ownedSpecialItems 
}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const itemsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  
  const [currentRoom, setCurrentRoom] = useState('main');
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loadingTextures, setLoadingTextures] = useState(true);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    focusItem: (itemId: string) => {
      focusOnItem(itemId);
    },
    changeRoom: (roomId: string) => {
      changeRoom(roomId);
    }
  }));
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || initialized) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Set up background for the current room
    setupRoomBackground(currentRoom);
    
    // Add the owned items to the scene
    addItemsToScene();
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Add subtle animations for plants
      animatePlants();
      
      renderer.render(scene, camera);
    };
    
    animate();
    setInitialized(true);
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [currentRoom, initialized]);
  
  // Update scene when owned items change
  useEffect(() => {
    if (!initialized) return;
    
    // Clear existing items
    if (sceneRef.current) {
      itemsRef.current.forEach((object) => {
        sceneRef.current?.remove(object);
      });
      
      itemsRef.current.clear();
    }
    
    // Add new items
    addItemsToScene();
  }, [ownedPlants, ownedAccessories, ownedSpecialItems, initialized]);
  
  // Setup room background
  const setupRoomBackground = (roomId: string) => {
    if (!sceneRef.current) return;
    
    const room = greenhouseRooms.find(r => r.id === roomId);
    if (!room) return;
    
    // Use a placeholder color while loading the texture
    sceneRef.current.background = new THREE.Color(0x88cc99);
    
    // Load the room background texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      room.background,
      (texture) => {
        if (sceneRef.current) {
          sceneRef.current.background = texture;
          setLoadingTextures(false);
        }
      },
      undefined,
      (error) => {
        console.error('Error loading room texture:', error);
        setLoadingTextures(false);
        // Keep the placeholder background
      }
    );
  };
  
  // Add items to the scene
  const addItemsToScene = () => {
    if (!sceneRef.current) return;
    
    // Add plants
    ownedPlants.forEach((plant, index) => {
      const x = (index % 5) * 1.5 - 3;
      const y = Math.floor(index / 5) * -1.5 + 1;
      
      createPlantObject(plant, new THREE.Vector3(x, y, 0));
    });
    
    // Add accessories
    ownedAccessories.forEach((accessory, index) => {
      const x = (index % 3) * 2 - 2;
      const y = -3;
      
      createAccessoryObject(accessory, new THREE.Vector3(x, y, 0));
    });
    
    // Add special items
    ownedSpecialItems.forEach((specialItem, index) => {
      const x = index * 2 - (ownedSpecialItems.length - 1);
      const y = 2;
      
      createSpecialItemObject(specialItem, new THREE.Vector3(x, y, 0));
    });
  };
  
  // Create a plant object
  const createPlantObject = (plant: PlantItem, position: THREE.Vector3) => {
    if (!sceneRef.current) return;
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      plant.image,
      (texture) => {
        // Create a sprite using the plant image
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 1, 1);
        sprite.position.copy(position);
        sprite.userData = { id: plant.id, type: plant.type, name: plant.name };
        
        // Add to scene
        sceneRef.current?.add(sprite);
        itemsRef.current.set(plant.id, sprite);
        
        // Add growth animation
        animatePlantGrowth(sprite);
      }
    );
  };
  
  // Create an accessory object
  const createAccessoryObject = (accessory: PlantItem, position: THREE.Vector3) => {
    if (!sceneRef.current) return;
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      accessory.image,
      (texture) => {
        // Create a sprite using the accessory image
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.8, 0.8, 0.8);
        sprite.position.copy(position);
        sprite.userData = { id: accessory.id, type: accessory.type, name: accessory.name };
        
        // Add to scene
        sceneRef.current?.add(sprite);
        itemsRef.current.set(accessory.id, sprite);
      }
    );
  };
  
  // Create a special item object
  const createSpecialItemObject = (specialItem: PlantItem, position: THREE.Vector3) => {
    if (!sceneRef.current) return;
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      specialItem.image,
      (texture) => {
        // Create a sprite using the special item image
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1.2, 1.2, 1.2);
        sprite.position.copy(position);
        sprite.userData = { id: specialItem.id, type: specialItem.type, name: specialItem.name };
        
        // Add to scene
        sceneRef.current?.add(sprite);
        itemsRef.current.set(specialItem.id, sprite);
        
        // Add special effects
        animateSpecialItem(sprite);
      }
    );
  };
  
  // Animate plants (subtle movement)
  const animatePlants = () => {
    const time = Date.now() * 0.001;
    
    itemsRef.current.forEach((object) => {
      if (object.userData?.type === 'plant') {
        // Subtle swaying for plants
        object.position.x += Math.sin(time + object.position.y) * 0.0005;
        object.position.y += Math.sin(time + object.position.x) * 0.0003;
      } else if (object.userData?.type === 'special') {
        // Gentle rotation and pulsing for special items
        object.rotation.z = Math.sin(time * 0.5) * 0.05;
        const scale = 1.2 + Math.sin(time) * 0.05;
        object.scale.set(scale, scale, scale);
      }
    });
  };
  
  // Animate plant growth (when first added)
  const animatePlantGrowth = (plant: THREE.Object3D) => {
    plant.scale.set(0.1, 0.1, 0.1);
    
    const growthDuration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const growPlant = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / growthDuration, 1);
      
      // Ease-out effect: start fast, end slow
      const scale = 0.1 + 0.9 * (1 - Math.pow(1 - progress, 3));
      plant.scale.set(scale, scale, scale);
      
      if (progress < 1) {
        requestAnimationFrame(growPlant);
      }
    };
    
    growPlant();
  };
  
  // Animate special items
  const animateSpecialItem = (item: THREE.Object3D) => {
    // Add special glow or effects for special items
    // This is a placeholder for more advanced effects
  };
  
  // Focus on a specific item
  const focusOnItem = (itemId: string) => {
    const item = itemsRef.current.get(itemId);
    if (!item || !cameraRef.current) return;
    
    const targetPosition = new THREE.Vector3().copy(item.position);
    targetPosition.z = cameraRef.current.position.z;
    
    // Animate camera move
    const startPosition = cameraRef.current.position.clone();
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Ease-in-out effect
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      cameraRef.current!.position.lerpVectors(startPosition, targetPosition, easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  };
  
  // Change to a different room
  const changeRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    setupRoomBackground(roomId);
  };
  
  // Handle dragging items
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    // Find intersections with objects in the scene
    const intersects = raycaster.intersectObjects(sceneRef.current.children);
    
    if (intersects.length > 0) {
      const firstIntersect = intersects[0].object;
      if (firstIntersect.userData?.id) {
        setDraggingItem(firstIntersect.userData.id);
      }
    }
  };
  
  // Handle dragging movement
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggingItem || !mountRef.current || !cameraRef.current) return;
    
    const item = itemsRef.current.get(draggingItem);
    if (!item) return;
    
    // Calculate mouse position in normalized device coordinates
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Convert to world coordinates
    const vector = new THREE.Vector3(x, y, 0);
    vector.unproject(cameraRef.current);
    vector.z = 0; // Keep z-coordinate constant
    
    // Update item position
    item.position.copy(vector);
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setDraggingItem(null);
  };
  
  return (
    <div 
      className="relative w-full h-full" 
      ref={mountRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Room navigation buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {greenhouseRooms.map(room => (
          <button
            key={room.id}
            onClick={() => changeRoom(room.id)}
            className={`px-2 py-1 text-xs rounded-md ${
              currentRoom === room.id
                ? 'bg-green-600 text-white'
                : 'bg-white/80 text-green-800 hover:bg-green-100'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>
      
      {/* Inventory toggle button */}
      <button
        onClick={() => setShowInventory(!showInventory)}
        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-green-800 p-2 rounded-full z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
      
      {/* Inventory panel */}
      {showInventory && (
        <div className="absolute top-16 right-4 bg-white/90 rounded-lg shadow-lg p-4 w-64 max-h-96 overflow-y-auto z-10">
          <h3 className="font-medium mb-2">Plants</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {ownedPlants.map(plant => (
              <div 
                key={plant.id} 
                className="bg-green-50 rounded-md p-2 text-center cursor-pointer"
                onClick={() => focusOnItem(plant.id)}
              >
                <img src={plant.image} alt={plant.name} className="w-10 h-10 mx-auto" />
                <p className="text-xs truncate">{plant.name}</p>
              </div>
            ))}
          </div>
          
          <h3 className="font-medium mb-2">Accessories</h3>
          <div className="grid grid-cols-3 gap-2">
            {ownedAccessories.map(accessory => (
              <div 
                key={accessory.id} 
                className="bg-blue-50 rounded-md p-2 text-center cursor-pointer"
                onClick={() => focusOnItem(accessory.id)}
              >
                <img src={accessory.image} alt={accessory.name} className="w-10 h-10 mx-auto" />
                <p className="text-xs truncate">{accessory.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {loadingTextures && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-green-800 font-medium">Loading greenhouse...</p>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-16 left-4 bg-white/80 rounded-lg p-2 text-xs text-gray-800 z-10">
        <p>• Click and drag items to move them</p>
        <p>• Use room buttons to navigate</p>
        <p>• Click inventory to access all items</p>
      </div>
    </div>
  );
});

export default GreenhouseGame;
