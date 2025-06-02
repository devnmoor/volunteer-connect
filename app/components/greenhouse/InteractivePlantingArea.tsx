import React, { useState, useEffect } from 'react';

const InteractivePlantingArea = ({ 
  plants = [], 
  onPlantGrowth, 
  onPlantWater, 
  environmentEffects 
}) => {
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 6 });
  const [selectedCell, setSelectedCell] = useState(null);
  const [placedPlants, setPlacedPlants] = useState({});
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Initialize with any pre-placed plants
  useEffect(() => {
    const initialPlacement = {};
    
    plants.forEach(plant => {
      if (plant.gridPosition) {
        const cellKey = `${plant.gridPosition.row}-${plant.gridPosition.col}`;
        initialPlacement[cellKey] = {
          plant,
          growthStage: plant.growthStage || 0.3, // Default to 30% grown
          lastWatered: plant.lastWatered || null
        };
      }
    });
    
    setPlacedPlants(initialPlacement);
  }, [plants]);
  
  // Handle drag start for inventory plants
  const handleDragStart = (plant) => {
    setDraggedPlant(plant);
  };
  
  // Handle drag over for grid cells
  const handleDragOver = (e, row, col) => {
    e.preventDefault();
    setHoveredCell({ row, col });
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setHoveredCell(null);
  };
  
  // Handle drop for placing plants
  const handleDrop = (e, row, col) => {
    e.preventDefault();
    
    if (!draggedPlant) return;
    
    const cellKey = `${row}-${col}`;
    
    // Don't allow planting if cell is already occupied
    if (placedPlants[cellKey]) return;
    
    // Place the plant
    setPlacedPlants(prev => ({
      ...prev,
      [cellKey]: {
        plant: draggedPlant,
        growthStage: 0.3, // Start at 30% grown
        lastWatered: new Date()
      }
    }));
    
    // Notify parent component
    if (onPlantGrowth) {
      onPlantGrowth(draggedPlant.id, 0.3);
    }
    
    setDraggedPlant(null);
    setHoveredCell(null);
  };
  
  // Handle watering a plant
  const handleWaterPlant = (row, col) => {
    const cellKey = `${row}-${col}`;
    const plantCell = placedPlants[cellKey];
    
    if (!plantCell) return;
    
    // Increase growth stage
    const newGrowthStage = Math.min(1, plantCell.growthStage + 0.1);
    
    setPlacedPlants(prev => ({
      ...prev,
      [cellKey]: {
        ...prev[cellKey],
        growthStage: newGrowthStage,
        lastWatered: new Date()
      }
    }));
    
    // Notify parent component
    if (onPlantWater) {
      onPlantWater(plantCell.plant.id, newGrowthStage);
    }
  };
  
  // Handle selecting a cell
  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    
    if (placedPlants[cellKey]) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }
  };
  
  // Get cell style
  const getCellStyle = (row, col) => {
    const cellKey = `${row}-${col}`;
    const isOccupied = !!placedPlants[cellKey];
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isHovered = hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
    
    return {
      border: isSelected 
        ? '2px solid #10B981' 
        : isHovered && !isOccupied
          ? '2px dashed #10B981'
          : '1px solid #E5E7EB',
      background: isOccupied 
        ? environmentEffects.timeOfDay === 'night'
          ? '#374151' // Dark gray at night
          : '#F0FDF4' // Light green in day
        : environmentEffects.timeOfDay === 'night'
          ? '#1F2937' // Darker gray at night
          : '#FFFFFF', // White in day
      position: 'relative',
      padding: '4px',
      height: '80px',
      transition: 'all 0.2s ease-in-out'
    };
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-2 bg-green-800 text-white text-sm font-medium">
        Interactive Planting Area
      </div>
      
      <div className="flex-grow p-4 bg-green-50 overflow-auto">
        <div 
          className="grid gap-2" 
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
          }}
        >
          {/* Create the grid cells */}
          {Array.from({ length: gridSize.rows }).map((_, row) => (
            Array.from({ length: gridSize.cols }).map((_, col) => {
              const cellKey = `${row}-${col}`;
              const plantCell = placedPlants[cellKey];
              
              return (
                <div
                  key={cellKey}
                  className="relative rounded-md"
                  style={getCellStyle(row, col)}
                  onDragOver={(e) => handleDragOver(e, row, col)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, row, col)}
                  onClick={() => handleCellClick(row, col)}
                >
                  {/* Soil texture */}
                  <div className="absolute inset-0 rounded-md overflow-hidden">
                    <div 
                      className="w-full h-full bg-yellow-800 opacity-20 bg-opacity-20" 
                      style={{ backgroundImage: 'url(/images/greenhouse/soil-texture.png)' }}
                    ></div>
                  </div>
                  
                  {/* Placed plant */}
                  {plantCell && (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <img 
                        src={plantCell.plant.image} 
                        alt={plantCell.plant.name}
                        className={`w-3/4 h-3/4 object-contain transition-transform duration-1000 ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`}
                        style={{ 
                          transform: `scale(${plantCell.growthStage})`,
                          transformOrigin: 'center bottom'
                        }}
                      />
                      
                      {/* Growth progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500" 
                          style={{ width: `${plantCell.growthStage * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Water droplets - show when recently watered */}
                      {plantCell.lastWatered && (
                        new Date().getTime() - new Date(plantCell.lastWatered).getTime() < 5000
                      ) && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute water-animation bg-blue-400 rounded-full"
                              style={{
                                width: '3px',
                                height: '3px',
                                top: `${Math.random() * 50 + 25}%`,
                                left: `${Math.random() * 70 + 15}%`,
                                animationDelay: `${Math.random() * 0.5}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                      
                      {/* Water button - shows on hover */}
                      <button
                        className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWaterPlant(row, col);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
      
      {/* Plant inventory */}
      <div className="bg-white border-t p-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Plants</h4>
        <div className="flex flex-wrap gap-2">
          {plants.filter(p => !p.gridPosition).map((plant) => (
            <div
              key={plant.id}
              className="border rounded-md p-2 cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={() => handleDragStart(plant)}
            >
              <div className="flex flex-col items-center">
                <img 
                  src={plant.image}
                  alt={plant.name}
                  className="w-10 h-10 object-contain mb-1"
                />
                <span className="text-xs text-center">{plant.name}</span>
              </div>
            </div>
          ))}
          
          {plants.filter(p => !p.gridPosition).length === 0 && (
            <p className="text-sm text-gray-500 p-2">No plants available for planting.</p>
          )}
        </div>
      </div>
      
      {/* Selected plant details */}
      {selectedCell && placedPlants[`${selectedCell.row}-${selectedCell.col}`] && (
        <div className="bg-white border-t p-2">
          <div className="flex items-start">
            <img 
              src={placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.image}
              alt={placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.name}
              className="w-12 h-12 object-contain mr-3"
            />
            <div>
              <h4 className="font-medium text-sm">{placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.name}</h4>
              <p className="text-xs text-gray-600">{Math.round(placedPlants[`${selectedCell.row}-${selectedCell.col}`].growthStage * 100)}% grown</p>
              {placedPlants[`${selectedCell.row}-${selectedCell.col}`].lastWatered && (
                <p className="text-xs text-gray-500">
                  Last watered: {new Date(placedPlants[`${selectedCell.row}-${selectedCell.col}`].lastWatered).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePlantingArea;