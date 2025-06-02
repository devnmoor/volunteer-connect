import React, { useState, useEffect } from 'react';

const TreeGardenVisualization = ({ 
  plants = [],
  onPlantGrowth,
  environmentEffects
}) => {
  // Separate trees from other plants
  const [trees, setTrees] = useState([]);
  const [otherPlants, setOtherPlants] = useState([]);
  const [plantGrowth, setPlantGrowth] = useState({});
  const [selectedTree, setSelectedTree] = useState(null);
  
  // Initialize plants and growth states
  useEffect(() => {
    // Categorize plants
    const treeTypes = ['tree', 'oak', 'apple', 'pine', 'cherry'];
    
    const treePlants = plants.filter(plant => 
      treeTypes.some(type => plant.name.toLowerCase().includes(type))
    );
    
    const otherPlantsList = plants.filter(plant => 
      !treeTypes.some(type => plant.name.toLowerCase().includes(type))
    );
    
    setTrees(treePlants);
    setOtherPlants(otherPlantsList);
    
    // Initialize growth stages
    const initialGrowth = {};
    plants.forEach(plant => {
      initialGrowth[plant.id] = Math.max(0.4, Math.random() * 0.6 + 0.4);
    });
    
    setPlantGrowth(initialGrowth);
  }, [plants]);
  
  // Handle watering a tree to advance its growth
  const handleWaterTree = (tree) => {
    const newGrowthValue = Math.min(1, (plantGrowth[tree.id] || 0.4) + 0.1);
    
    setPlantGrowth(prev => ({
      ...prev,
      [tree.id]: newGrowthValue
    }));
    
    if (onPlantGrowth) {
      onPlantGrowth(tree.id, newGrowthValue);
    }
  };
  
  // Get sky color based on time of day
  const getSkyColor = () => {
    switch (environmentEffects.timeOfDay) {
      case 'day':
        return 'bg-gradient-to-b from-blue-300 to-blue-100';
      case 'dusk':
        return 'bg-gradient-to-b from-orange-300 to-pink-200';
      case 'night':
        return 'bg-gradient-to-b from-blue-900 to-purple-900';
      case 'dawn':
        return 'bg-gradient-to-b from-pink-300 to-yellow-200';
      default:
        return 'bg-gradient-to-b from-blue-300 to-blue-100';
    }
  };
  
  // Position trees in an arc formation
  const positionTree = (index, total) => {
    // Create an arc formation
    const centerX = 50; // Center position (%)
    const bottomY = 85; // Bottom position (%)
    const radius = 40; // Arc radius (%)
    
    // Calculate position on the arc
    const angle = (index / (total - 1)) * Math.PI;
    const x = centerX - (radius * Math.cos(angle));
    const y = bottomY - (radius/2 * Math.sin(angle));
    
    // Add a slight random offset for natural feel
    const offsetX = (Math.random() - 0.5) * 5;
    const offsetY = (Math.random() - 0.5) * 2;
    
    return {
      left: `${x + offsetX}%`,
      top: `${y + offsetY}%`,
      zIndex: Math.floor(y) // Trees in front are drawn over trees in back
    };
  };
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Sky background */}
      <div className={`absolute inset-0 ${getSkyColor()}`}></div>
      
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-700 to-green-500"></div>
      
      {/* Sun/Moon */}
      <div 
        className={`absolute rounded-full transition-all duration-1000 ${
          environmentEffects.timeOfDay === 'night' 
            ? 'bg-gray-200 w-16 h-16 top-12 right-12' // Moon 
            : 'bg-yellow-300 w-24 h-24 top-8 right-24' // Sun
        }`}
      ></div>
      
      {/* Rain effect */}
      {environmentEffects.rain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
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
      
      {/* Trees */}
      {trees.map((tree, index) => {
        const position = positionTree(index, Math.max(trees.length, 3));
        const growthLevel = plantGrowth[tree.id] || 0.5;
        
        return (
          <div 
            key={tree.id}
            className="absolute cursor-pointer transition-transform"
            style={{
              ...position,
              transform: `scale(${growthLevel * 0.8 + 0.5}) ${environmentEffects.wind ? 'rotate(-2deg)' : ''}`,
              transformOrigin: 'center bottom',
              width: '120px',
              height: '200px',
              transition: 'transform 0.5s ease-in-out'
            }}
            onClick={() => setSelectedTree(tree)}
          >
            {/* Tree animation */}
            <div className={`w-full h-full relative ${environmentEffects.wind ? 'plant-sway-animation' : ''}`}>
              <img 
                src={tree.image}
                alt={tree.name}
                className="w-full h-full object-contain object-bottom"
              />
              
              {/* Growth indicator */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white bg-opacity-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${growthLevel * 100}%` }}
                ></div>
              </div>
              
              {/* Water button */}
              <button
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWaterTree(tree);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
      
      {/* Other plants in the foreground */}
      {otherPlants.slice(0, 8).map((plant, index) => {
        const leftPos = 10 + (index * 10) + (Math.random() * 5);
        
        return (
          <div 
            key={plant.id}
            className={`absolute bottom-2 cursor-pointer ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`}
            style={{
              left: `${leftPos}%`,
              width: '60px',
              height: '80px',
              zIndex: 50 + index
            }}
          >
            <img 
              src={plant.image}
              alt={plant.name}
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        );
      })}
      
      {/* Selected tree details */}
      {selectedTree && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg max-w-xs">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{selectedTree.name}</h4>
            <button 
              onClick={() => setSelectedTree(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1">{selectedTree.description}</p>
          <div className="mt-2 flex items-center">
            <div className="flex-grow h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${(plantGrowth[selectedTree.id] || 0.5) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-gray-600">
              {Math.round((plantGrowth[selectedTree.id] || 0.5) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeGardenVisualization;