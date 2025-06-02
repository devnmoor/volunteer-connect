import React, { useState, useEffect, useRef } from 'react';
import InteractivePlantingArea from './InteractivePlantingArea';
import TreeGardenVisualization from './TreeGardenVisualization';

const ROOMS = {
  MAIN: 'main-growing-room',
  PROPAGATION: 'propagation-room',
  SHOWCASE: 'showcase-room',
  CARE: 'watering-care-station',
  WORKSHOP: 'storage-workshop',
  MARKET: 'market-room',
  LAB: 'hybrid-lab'
};

const GreenhouseVisualization = ({ 
  plants = [], 
  accessories = [], 
  specialItems = [], 
  onItemPlace,
  onItemMove
}) => {
  const [currentRoom, setCurrentRoom] = useState(ROOMS.MAIN);
  const [selectedItem, setSelectedItem] = useState(null);
  const [placedItems, setPlacedItems] = useState({
    [ROOMS.MAIN]: [],
    [ROOMS.PROPAGATION]: [],
    [ROOMS.SHOWCASE]: [],
    [ROOMS.CARE]: [],
    [ROOMS.WORKSHOP]: [],
    [ROOMS.MARKET]: [],
    [ROOMS.LAB]: []
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [showInventory, setShowInventory] = useState(false);

  // Add weather and environmental effects
  const [environmentEffects, setEnvironmentEffects] = useState({
    sunlight: 60, // 0-100 level
    rain: false,
    wind: false,
    timeOfDay: 'day', // day, dusk, night, dawn
  });
  
  // Growth stages for plants
  const [plantGrowth, setPlantGrowth] = useState({});
  
  // Initialize plant growth stages
  useEffect(() => {
    const initialGrowth = {};
    plants.forEach(plant => {
      // Random growth stage between 0.3 and 1 (fully grown)
      initialGrowth[plant.id] = Math.max(0.3, Math.random() * 0.7 + 0.3);
    });
    setPlantGrowth(initialGrowth);
  }, [plants]);
  
  // Function to advance plant growth
  const advancePlantGrowth = (plantId) => {
    setPlantGrowth(prev => ({
      ...prev,
      [plantId]: Math.min(1, (prev[plantId] || 0) + 0.1)
    }));
  };
  
  // Toggle rain effect
  const toggleRain = () => {
    setEnvironmentEffects(prev => ({
      ...prev,
      rain: !prev.rain
    }));
    
    // If turning on rain, advance growth of all plants
    if (!environmentEffects.rain) {
      const newGrowth = { ...plantGrowth };
      plants.forEach(plant => {
        newGrowth[plant.id] = Math.min(1, (newGrowth[plant.id] || 0) + 0.05);
      });
      setPlantGrowth(newGrowth);
    }
  };
  
  // Toggle wind effect
  const toggleWind = () => {
    setEnvironmentEffects(prev => ({
      ...prev,
      wind: !prev.wind
    }));
  };
  
  // Change time of day
  const changeTimeOfDay = (time) => {
    setEnvironmentEffects(prev => ({
      ...prev,
      timeOfDay: time
    }));
  };
  
  // Apply sunlight to a plant
  const applySunlight = (plantId) => {
    advancePlantGrowth(plantId);
  };

  // Initialize placed items with saved positions if available
  useEffect(() => {
    // Group items by their current room placement
    const initialPlacement = {
      [ROOMS.MAIN]: [],
      [ROOMS.PROPAGATION]: [],
      [ROOMS.SHOWCASE]: [],
      [ROOMS.CARE]: [],
      [ROOMS.WORKSHOP]: [],
      [ROOMS.MARKET]: [],
      [ROOMS.LAB]: []
    };
    
    // Add plants with their saved positions or default to main room
    plants.forEach(plant => {
      const room = plant.placement?.room || ROOMS.MAIN;
      const position = plant.placement?.position || { x: 0, y: 0 };
      
      initialPlacement[room].push({
        ...plant,
        type: 'plant',
        position
      });
    });
    
    // Add accessories with their saved positions
    accessories.forEach(accessory => {
      const room = accessory.placement?.room || ROOMS.MAIN;
      const position = accessory.placement?.position || { x: 0, y: 0 };
      
      initialPlacement[room].push({
        ...accessory,
        type: 'accessory',
        position
      });
    });
    
    // Add special items with their saved positions
    specialItems.forEach(item => {
      const room = item.placement?.room || ROOMS.MAIN;
      const position = item.placement?.position || { x: 0, y: 0 };
      
      initialPlacement[room].push({
        ...item,
        type: 'special',
        position
      });
    });
    
    setPlacedItems(initialPlacement);
  }, [plants, accessories, specialItems]);

  // Handle drag start for inventory item
  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  // Handle drag over for drop zone
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop for placing item
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // Calculate position relative to drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if this is an item from inventory or already placed
    if (draggedItem.isInventory) {
      // Add to current room from inventory
      const newPlacedItems = { ...placedItems };
      newPlacedItems[currentRoom].push({
        ...draggedItem.item,
        position: { x, y }
      });
      
      setPlacedItems(newPlacedItems);
      
      // Notify parent component
      if (onItemPlace) {
        onItemPlace(draggedItem.item, currentRoom, { x, y });
      }
    } else {
      // Move existing item
      const updatedItems = { ...placedItems };
      
      // Find and update the item position
      const item = updatedItems[currentRoom].find(i => i.id === draggedItem.id);
      if (item) {
        item.position = { x, y };
        setPlacedItems(updatedItems);
        
        // Notify parent component
        if (onItemMove) {
          onItemMove(item, currentRoom, { x, y });
        }
      }
    }
    
    setDraggedItem(null);
  };

  // Get room background image
  const getRoomBackground = () => {
    switch (currentRoom) {
      case ROOMS.MAIN:
        return '/images/greenhouse/main-room.jpg';
      case ROOMS.PROPAGATION:
        return '/images/greenhouse/propagation-room.jpg';
      case ROOMS.SHOWCASE:
        return '/images/greenhouse/showcase-room.jpg';
      case ROOMS.CARE:
        return '/images/greenhouse/care-station.jpg';
      case ROOMS.WORKSHOP:
        return '/images/greenhouse/workshop.jpg';
      case ROOMS.MARKET:
        return '/images/greenhouse/market-room.jpg';
      case ROOMS.LAB:
        return '/images/greenhouse/lab.jpg';
      default:
        return '/images/greenhouse/main-room.jpg';
    }
  };

  // Get room name for display
  const getRoomName = () => {
    switch (currentRoom) {
      case ROOMS.MAIN:
        return 'Main Growing Room';
      case ROOMS.PROPAGATION:
        return 'Propagation Room';
      case ROOMS.SHOWCASE:
        return 'Showcase Room';
      case ROOMS.CARE:
        return 'Watering & Care Station';
      case ROOMS.WORKSHOP:
        return 'Storage & Workshop';
      case ROOMS.MARKET:
        return 'Market Room';
      case ROOMS.LAB:
        return 'Hybrid Lab';
      default:
        return 'Greenhouse';
    }
  };

  // Combine all items for inventory
  const inventoryItems = [
    ...plants.filter(p => !p.placement),
    ...accessories.filter(a => !a.placement),
    ...specialItems.filter(s => !s.placement)
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Room Navigation */}
      <div className="bg-green-800 text-white p-2 flex justify-between items-center">
        <h3 className="font-medium">{getRoomName()}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowInventory(!showInventory)}
            className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm"
          >
            {showInventory ? 'Hide Inventory' : 'Show Inventory'}
          </button>
          
          {/* Environment controls */}
          <div className="flex space-x-1">
            {/* Sun button */}
            <button
              onClick={() => changeTimeOfDay(environmentEffects.timeOfDay === 'day' ? 'night' : 'day')}
              className={`p-1 rounded ${environmentEffects.timeOfDay === 'day' ? 'bg-yellow-500' : 'bg-blue-800'}`}
              title={environmentEffects.timeOfDay === 'day' ? 'Switch to Night' : 'Switch to Day'}
            >
              {environmentEffects.timeOfDay === 'day' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Rain button */}
            <button
              onClick={toggleRain}
              className={`p-1 rounded ${environmentEffects.rain ? 'bg-blue-600' : 'bg-gray-600'}`}
              title={environmentEffects.rain ? 'Stop Rain' : 'Start Rain'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
            {/* Wind button */}
            <button
              onClick={toggleWind}
              className={`p-1 rounded ${environmentEffects.wind ? 'bg-blue-600' : 'bg-gray-600'}`}
              title={environmentEffects.wind ? 'Stop Wind' : 'Start Wind'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Room tabs */}
      <div className="bg-green-700 text-white flex overflow-x-auto">
        {Object.values(ROOMS).map((room) => (
          <button
            key={room}
            onClick={() => setCurrentRoom(room)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              currentRoom === room 
                ? 'bg-green-600 font-medium' 
                : 'hover:bg-green-600'
            }`}
          >
            {room === ROOMS.MAIN ? 'Main Growing Room' :
             room === ROOMS.PROPAGATION ? 'Propagation Room' :
             room === ROOMS.SHOWCASE ? 'Showcase Room' :
             room === ROOMS.CARE ? 'Care Station' :
             room === ROOMS.WORKSHOP ? 'Workshop' :
             room === ROOMS.MARKET ? 'Market' : 'Lab'}
          </button>
        ))}
      </div>
      
      {/* 3D Visualization */}
      <div className="relative flex-grow flex">
        {/* Room rendering */}
        <div 
          className="w-full h-full relative overflow-hidden" 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            backgroundImage: `url(${getRoomBackground()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Room rendering - Different visualizations based on room */}
          {currentRoom === ROOMS.PROPAGATION ? (
            <InteractivePlantingArea 
              plants={plants}
              onPlantGrowth={(plantId, growthStage) => {
                // Update the plant growth state
                setPlantGrowth(prev => ({
                  ...prev,
                  [plantId]: growthStage
                }));
              }}
              onPlantWater={(plantId, growthStage) => {
                // Update the plant growth state
                setPlantGrowth(prev => ({
                  ...prev,
                  [plantId]: growthStage
                }));
              }}
              environmentEffects={environmentEffects}
            />
          ) : currentRoom === ROOMS.MAIN ? (
            <TreeGardenVisualization
              plants={plants}
              onPlantGrowth={advancePlantGrowth}
              environmentEffects={environmentEffects}
            />
          ) : (
            <>
              {/* Environmental effects */}
              {/* Rain effect */}
              {environmentEffects.rain && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={`rain-${i}`}
                      className="absolute top-0 bg-blue-400 opacity-70"
                      style={{
                        left: `${Math.random() * 100}%`,
                        width: '1px',
                        height: `${Math.random() * 15 + 10}px`,
                        animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                        animationDelay: `${Math.random() * 1.5}s`,
                        animation: 'water-drop 1.5s linear infinite'
                      }}
                    ></div>
                  ))}
                </div>
              )}
              
              {/* Wind effect */}
              {environmentEffects.wind && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={`wind-${i}`}
                      className="absolute bg-white opacity-30"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: '0%',
                        width: `${Math.random() * 50 + 30}px`,
                        height: '1px',
                        animation: 'plant-sway 3s linear infinite',
                        animationDelay: `${Math.random() * 3}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
              
              {/* Day/Night overlay */}
              {environmentEffects.timeOfDay !== 'day' && (
                <div 
                  className="absolute inset-0 pointer-events-none bg-blue-900 transition-opacity duration-1000"
                  style={{ 
                    opacity: environmentEffects.timeOfDay === 'night' ? 0.5 : 
                              environmentEffects.timeOfDay === 'dusk' ? 0.3 :
                              environmentEffects.timeOfDay === 'dawn' ? 0.2 : 0
                  }}
                ></div>
              )}
              
              {/* Placed items in current room */}
              {placedItems[currentRoom].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="absolute cursor-move hover:z-50 transition-transform hover:scale-105"
                  style={{
                    left: `${item.position.x}px`,
                    top: `${item.position.y}px`,
                    width: '80px',
                    height: '80px'
                  }}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  onClick={() => setSelectedItem(item)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Item label on hover */}
                  <div className="opacity-0 hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-1 transition-opacity">
                    {item.name}
                  </div>
                  
                  {/* Animations for different item types */}
                  {item.type === 'plant' && (
                    <>
                      <div className="absolute inset-0 animate-pulse-slow opacity-10 bg-green-200 rounded-full"></div>
                      <div 
                        className={`absolute inset-0 ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`}
                        style={{ 
                          transform: `scale(${plantGrowth[item.id] || 0.5})`,
                          opacity: (plantGrowth[item.id] || 0.5) * 0.6 + 0.4,
                        }}
                      ></div>
                      
                      {/* Growth stage indicator */}
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-1000" 
                          style={{ width: `${(plantGrowth[item.id] || 0) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Water button for plants */}
                      <button
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          advancePlantGrowth(item.id);
                        }}
                        title="Water plant"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                    </>
                  )}
                  {item.type === 'accessory' && item.name.toLowerCase().includes('water') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 water-animation">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    </div>
                  )}
                  {item.type === 'special' && (
                    <div className="absolute inset-0 sparkle-animation">
                      <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full opacity-70"></div>
                      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-70" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-300 rounded-full opacity-70" style={{animationDelay: '1s'}}></div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {/* Selected item info */}
          {selectedItem && (
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg max-w-xs">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{selectedItem.name}</h4>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">{selectedItem.description}</p>
            </div>
          )}
        </div>
        
        {/* Inventory panel */}
        {showInventory && (
          <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-medium text-sm">Inventory</h3>
            </div>
            
            {inventoryItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No items in inventory
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                {inventoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded p-2 flex flex-col items-center cursor-move hover:bg-gray-50"
                    draggable
                    onDragStart={() => handleDragStart({ item, isInventory: true })}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-xs mt-1 text-center">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenhouseVisualization;