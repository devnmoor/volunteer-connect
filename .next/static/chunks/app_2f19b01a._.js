(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/components/greenhouse/InteractivePlantingArea.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const InteractivePlantingArea = ({ plants = [], onPlantGrowth, onPlantWater, environmentEffects })=>{
    _s();
    const [gridSize, setGridSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        rows: 4,
        cols: 6
    });
    const [selectedCell, setSelectedCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [placedPlants, setPlacedPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [draggedPlant, setDraggedPlant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredCell, setHoveredCell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Initialize with any pre-placed plants
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractivePlantingArea.useEffect": ()=>{
            const initialPlacement = {};
            plants.forEach({
                "InteractivePlantingArea.useEffect": (plant)=>{
                    if (plant.gridPosition) {
                        const cellKey = `${plant.gridPosition.row}-${plant.gridPosition.col}`;
                        initialPlacement[cellKey] = {
                            plant,
                            growthStage: plant.growthStage || 0.3,
                            lastWatered: plant.lastWatered || null
                        };
                    }
                }
            }["InteractivePlantingArea.useEffect"]);
            setPlacedPlants(initialPlacement);
        }
    }["InteractivePlantingArea.useEffect"], [
        plants
    ]);
    // Handle drag start for inventory plants
    const handleDragStart = (plant)=>{
        setDraggedPlant(plant);
    };
    // Handle drag over for grid cells
    const handleDragOver = (e, row, col)=>{
        e.preventDefault();
        setHoveredCell({
            row,
            col
        });
    };
    // Handle drag leave
    const handleDragLeave = ()=>{
        setHoveredCell(null);
    };
    // Handle drop for placing plants
    const handleDrop = (e, row, col)=>{
        e.preventDefault();
        if (!draggedPlant) return;
        const cellKey = `${row}-${col}`;
        // Don't allow planting if cell is already occupied
        if (placedPlants[cellKey]) return;
        // Place the plant
        setPlacedPlants((prev)=>({
                ...prev,
                [cellKey]: {
                    plant: draggedPlant,
                    growthStage: 0.3,
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
    const handleWaterPlant = (row, col)=>{
        const cellKey = `${row}-${col}`;
        const plantCell = placedPlants[cellKey];
        if (!plantCell) return;
        // Increase growth stage
        const newGrowthStage = Math.min(1, plantCell.growthStage + 0.1);
        setPlacedPlants((prev)=>({
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
    const handleCellClick = (row, col)=>{
        const cellKey = `${row}-${col}`;
        if (placedPlants[cellKey]) {
            setSelectedCell({
                row,
                col
            });
        } else {
            setSelectedCell(null);
        }
    };
    // Get cell style
    const getCellStyle = (row, col)=>{
        const cellKey = `${row}-${col}`;
        const isOccupied = !!placedPlants[cellKey];
        const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
        const isHovered = hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
        return {
            border: isSelected ? '2px solid #10B981' : isHovered && !isOccupied ? '2px dashed #10B981' : '1px solid #E5E7EB',
            background: isOccupied ? environmentEffects.timeOfDay === 'night' ? '#374151' // Dark gray at night
             : '#F0FDF4' // Light green in day
             : environmentEffects.timeOfDay === 'night' ? '#1F2937' // Darker gray at night
             : '#FFFFFF',
            position: 'relative',
            padding: '4px',
            height: '80px',
            transition: 'all 0.2s ease-in-out'
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-2 bg-green-800 text-white text-sm font-medium",
                children: "Interactive Planting Area"
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow p-4 bg-green-50 overflow-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-2",
                    style: {
                        gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
                    },
                    children: Array.from({
                        length: gridSize.rows
                    }).map((_, row)=>Array.from({
                            length: gridSize.cols
                        }).map((_, col)=>{
                            const cellKey = `${row}-${col}`;
                            const plantCell = placedPlants[cellKey];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative rounded-md",
                                style: getCellStyle(row, col),
                                onDragOver: (e)=>handleDragOver(e, row, col),
                                onDragLeave: handleDragLeave,
                                onDrop: (e)=>handleDrop(e, row, col),
                                onClick: ()=>handleCellClick(row, col),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 rounded-md overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full h-full bg-yellow-800 opacity-20 bg-opacity-20",
                                            style: {
                                                backgroundImage: 'url(/images/greenhouse/soil-texture.png)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                            lineNumber: 174,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                        lineNumber: 173,
                                        columnNumber: 19
                                    }, this),
                                    plantCell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full flex items-center justify-center relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: plantCell.plant.image,
                                                alt: plantCell.plant.name,
                                                className: `w-3/4 h-3/4 object-contain transition-transform duration-1000 ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`,
                                                style: {
                                                    transform: `scale(${plantCell.growthStage})`,
                                                    transformOrigin: 'center bottom'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 183,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-full bg-green-500 transition-all duration-500",
                                                    style: {
                                                        width: `${plantCell.growthStage * 100}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 194,
                                                columnNumber: 23
                                            }, this),
                                            plantCell.lastWatered && new Date().getTime() - new Date(plantCell.lastWatered).getTime() < 5000 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 pointer-events-none",
                                                children: [
                                                    ...Array(5)
                                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute water-animation bg-blue-400 rounded-full",
                                                        style: {
                                                            width: '3px',
                                                            height: '3px',
                                                            top: `${Math.random() * 50 + 25}%`,
                                                            left: `${Math.random() * 70 + 15}%`,
                                                            animationDelay: `${Math.random() * 0.5}s`
                                                        }
                                                    }, i, false, {
                                                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 205,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "absolute bottom-1 right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    handleWaterPlant(row, col);
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-3 w-3",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 223,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                        lineNumber: 182,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, cellKey, true, {
                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                lineNumber: 163,
                                columnNumber: 17
                            }, this);
                        }))
                }, void 0, false, {
                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-t p-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-medium text-gray-700 mb-2",
                        children: "Available Plants"
                    }, void 0, false, {
                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            plants.filter((p)=>!p.gridPosition).map((plant)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-md p-2 cursor-move hover:shadow-md transition-shadow",
                                    draggable: true,
                                    onDragStart: ()=>handleDragStart(plant),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: plant.image,
                                                alt: plant.name,
                                                className: "w-10 h-10 object-contain mb-1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 255,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-center",
                                                children: plant.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                                lineNumber: 260,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this)
                                }, plant.id, false, {
                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this)),
                            plants.filter((p)=>!p.gridPosition).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 p-2",
                                children: "No plants available for planting."
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                lineNumber: 266,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            selectedCell && placedPlants[`${selectedCell.row}-${selectedCell.col}`] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-t p-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.image,
                            alt: placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.name,
                            className: "w-12 h-12 object-contain mr-3"
                        }, void 0, false, {
                            fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium text-sm",
                                    children: placedPlants[`${selectedCell.row}-${selectedCell.col}`].plant.name
                                }, void 0, false, {
                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-600",
                                    children: [
                                        Math.round(placedPlants[`${selectedCell.row}-${selectedCell.col}`].growthStage * 100),
                                        "% grown"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this),
                                placedPlants[`${selectedCell.row}-${selectedCell.col}`].lastWatered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: [
                                        "Last watered: ",
                                        new Date(placedPlants[`${selectedCell.row}-${selectedCell.col}`].lastWatered).toLocaleTimeString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                                    lineNumber: 284,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                    lineNumber: 274,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/greenhouse/InteractivePlantingArea.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
};
_s(InteractivePlantingArea, "HWwjzInx90uFi4ukn46BakXXna8=");
_c = InteractivePlantingArea;
const __TURBOPACK__default__export__ = InteractivePlantingArea;
var _c;
__turbopack_context__.k.register(_c, "InteractivePlantingArea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/greenhouse/TreeGardenVisualization.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const TreeGardenVisualization = ({ plants = [], onPlantGrowth, environmentEffects })=>{
    _s();
    // Separate trees from other plants
    const [trees, setTrees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [otherPlants, setOtherPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [plantGrowth, setPlantGrowth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedTree, setSelectedTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Initialize plants and growth states
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TreeGardenVisualization.useEffect": ()=>{
            // Categorize plants
            const treeTypes = [
                'tree',
                'oak',
                'apple',
                'pine',
                'cherry'
            ];
            const treePlants = plants.filter({
                "TreeGardenVisualization.useEffect.treePlants": (plant)=>treeTypes.some({
                        "TreeGardenVisualization.useEffect.treePlants": (type)=>plant.name.toLowerCase().includes(type)
                    }["TreeGardenVisualization.useEffect.treePlants"])
            }["TreeGardenVisualization.useEffect.treePlants"]);
            const otherPlantsList = plants.filter({
                "TreeGardenVisualization.useEffect.otherPlantsList": (plant)=>!treeTypes.some({
                        "TreeGardenVisualization.useEffect.otherPlantsList": (type)=>plant.name.toLowerCase().includes(type)
                    }["TreeGardenVisualization.useEffect.otherPlantsList"])
            }["TreeGardenVisualization.useEffect.otherPlantsList"]);
            setTrees(treePlants);
            setOtherPlants(otherPlantsList);
            // Initialize growth stages
            const initialGrowth = {};
            plants.forEach({
                "TreeGardenVisualization.useEffect": (plant)=>{
                    initialGrowth[plant.id] = Math.max(0.4, Math.random() * 0.6 + 0.4);
                }
            }["TreeGardenVisualization.useEffect"]);
            setPlantGrowth(initialGrowth);
        }
    }["TreeGardenVisualization.useEffect"], [
        plants
    ]);
    // Handle watering a tree to advance its growth
    const handleWaterTree = (tree)=>{
        const newGrowthValue = Math.min(1, (plantGrowth[tree.id] || 0.4) + 0.1);
        setPlantGrowth((prev)=>({
                ...prev,
                [tree.id]: newGrowthValue
            }));
        if (onPlantGrowth) {
            onPlantGrowth(tree.id, newGrowthValue);
        }
    };
    // Get sky color based on time of day
    const getSkyColor = ()=>{
        switch(environmentEffects.timeOfDay){
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
    const positionTree = (index, total)=>{
        // Create an arc formation
        const centerX = 50; // Center position (%)
        const bottomY = 85; // Bottom position (%)
        const radius = 40; // Arc radius (%)
        // Calculate position on the arc
        const angle = index / (total - 1) * Math.PI;
        const x = centerX - radius * Math.cos(angle);
        const y = bottomY - radius / 2 * Math.sin(angle);
        // Add a slight random offset for natural feel
        const offsetX = (Math.random() - 0.5) * 5;
        const offsetY = (Math.random() - 0.5) * 2;
        return {
            left: `${x + offsetX}%`,
            top: `${y + offsetY}%`,
            zIndex: Math.floor(y) // Trees in front are drawn over trees in back
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 ${getSkyColor()}`
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-700 to-green-500"
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute rounded-full transition-all duration-1000 ${environmentEffects.timeOfDay === 'night' ? 'bg-gray-200 w-16 h-16 top-12 right-12' // Moon 
                 : 'bg-yellow-300 w-24 h-24 top-8 right-24' // Sun
                }`
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            environmentEffects.rain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 pointer-events-none overflow-hidden",
                children: [
                    ...Array(50)
                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 bg-blue-400 opacity-70",
                        style: {
                            left: `${Math.random() * 100}%`,
                            width: '1px',
                            height: `${Math.random() * 15 + 10}px`,
                            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                            animationDelay: `${Math.random() * 1.5}s`,
                            animation: 'water-drop 1.5s linear infinite'
                        }
                    }, `rain-${i}`, false, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            trees.map((tree, index)=>{
                const position = positionTree(index, Math.max(trees.length, 3));
                const growthLevel = plantGrowth[tree.id] || 0.5;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute cursor-pointer transition-transform",
                    style: {
                        ...position,
                        transform: `scale(${growthLevel * 0.8 + 0.5}) ${environmentEffects.wind ? 'rotate(-2deg)' : ''}`,
                        transformOrigin: 'center bottom',
                        width: '120px',
                        height: '200px',
                        transition: 'transform 0.5s ease-in-out'
                    },
                    onClick: ()=>setSelectedTree(tree),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full h-full relative ${environmentEffects.wind ? 'plant-sway-animation' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: tree.image,
                                alt: tree.name,
                                className: "w-full h-full object-contain object-bottom"
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white bg-opacity-50 rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-green-500",
                                    style: {
                                        width: `${growthLevel * 100}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                    lineNumber: 158,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    handleWaterTree(tree);
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                        lineNumber: 173,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                    lineNumber: 172,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 165,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 149,
                        columnNumber: 13
                    }, this)
                }, tree.id, false, {
                    fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                    lineNumber: 135,
                    columnNumber: 11
                }, this);
            }),
            otherPlants.slice(0, 8).map((plant, index)=>{
                const leftPos = 10 + index * 10 + Math.random() * 5;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `absolute bottom-2 cursor-pointer ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`,
                    style: {
                        left: `${leftPos}%`,
                        width: '60px',
                        height: '80px',
                        zIndex: 50 + index
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: plant.image,
                        alt: plant.name,
                        className: "w-full h-full object-contain object-bottom"
                    }, void 0, false, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 196,
                        columnNumber: 13
                    }, this)
                }, plant.id, false, {
                    fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                    lineNumber: 186,
                    columnNumber: 11
                }, this);
            }),
            selectedTree && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg max-w-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-medium text-sm",
                                children: selectedTree.name
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedTree(null),
                                className: "text-gray-500 hover:text-gray-700",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-600 mt-1",
                        children: selectedTree.description
                    }, void 0, false, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-grow h-1 bg-gray-200 rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-green-500",
                                    style: {
                                        width: `${(plantGrowth[selectedTree.id] || 0.5) * 100}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-xs text-gray-600",
                                children: [
                                    Math.round((plantGrowth[selectedTree.id] || 0.5) * 100),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
                lineNumber: 207,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/greenhouse/TreeGardenVisualization.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
};
_s(TreeGardenVisualization, "H2QlKiwfB58/EeilZS+k1Jq5hrk=");
_c = TreeGardenVisualization;
const __TURBOPACK__default__export__ = TreeGardenVisualization;
var _c;
__turbopack_context__.k.register(_c, "TreeGardenVisualization");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/greenhouse/GreenhouseVisualization.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$InteractivePlantingArea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/greenhouse/InteractivePlantingArea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$TreeGardenVisualization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/greenhouse/TreeGardenVisualization.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ROOMS = {
    MAIN: 'main-growing-room',
    PROPAGATION: 'propagation-room',
    SHOWCASE: 'showcase-room',
    CARE: 'watering-care-station',
    WORKSHOP: 'storage-workshop',
    MARKET: 'market-room',
    LAB: 'hybrid-lab'
};
const GreenhouseVisualization = ({ plants = [], accessories = [], specialItems = [], onItemPlace, onItemMove })=>{
    _s();
    const [currentRoom, setCurrentRoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(ROOMS.MAIN);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [placedItems, setPlacedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        [ROOMS.MAIN]: [],
        [ROOMS.PROPAGATION]: [],
        [ROOMS.SHOWCASE]: [],
        [ROOMS.CARE]: [],
        [ROOMS.WORKSHOP]: [],
        [ROOMS.MARKET]: [],
        [ROOMS.LAB]: []
    });
    const [draggedItem, setDraggedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showInventory, setShowInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Add weather and environmental effects
    const [environmentEffects, setEnvironmentEffects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        sunlight: 60,
        rain: false,
        wind: false,
        timeOfDay: 'day'
    });
    // Growth stages for plants
    const [plantGrowth, setPlantGrowth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Initialize plant growth stages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GreenhouseVisualization.useEffect": ()=>{
            const initialGrowth = {};
            plants.forEach({
                "GreenhouseVisualization.useEffect": (plant)=>{
                    // Random growth stage between 0.3 and 1 (fully grown)
                    initialGrowth[plant.id] = Math.max(0.3, Math.random() * 0.7 + 0.3);
                }
            }["GreenhouseVisualization.useEffect"]);
            setPlantGrowth(initialGrowth);
        }
    }["GreenhouseVisualization.useEffect"], [
        plants
    ]);
    // Function to advance plant growth
    const advancePlantGrowth = (plantId)=>{
        setPlantGrowth((prev)=>({
                ...prev,
                [plantId]: Math.min(1, (prev[plantId] || 0) + 0.1)
            }));
    };
    // Toggle rain effect
    const toggleRain = ()=>{
        setEnvironmentEffects((prev)=>({
                ...prev,
                rain: !prev.rain
            }));
        // If turning on rain, advance growth of all plants
        if (!environmentEffects.rain) {
            const newGrowth = {
                ...plantGrowth
            };
            plants.forEach((plant)=>{
                newGrowth[plant.id] = Math.min(1, (newGrowth[plant.id] || 0) + 0.05);
            });
            setPlantGrowth(newGrowth);
        }
    };
    // Toggle wind effect
    const toggleWind = ()=>{
        setEnvironmentEffects((prev)=>({
                ...prev,
                wind: !prev.wind
            }));
    };
    // Change time of day
    const changeTimeOfDay = (time)=>{
        setEnvironmentEffects((prev)=>({
                ...prev,
                timeOfDay: time
            }));
    };
    // Apply sunlight to a plant
    const applySunlight = (plantId)=>{
        advancePlantGrowth(plantId);
    };
    // Initialize placed items with saved positions if available
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GreenhouseVisualization.useEffect": ()=>{
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
            plants.forEach({
                "GreenhouseVisualization.useEffect": (plant)=>{
                    const room = plant.placement?.room || ROOMS.MAIN;
                    const position = plant.placement?.position || {
                        x: 0,
                        y: 0
                    };
                    initialPlacement[room].push({
                        ...plant,
                        type: 'plant',
                        position
                    });
                }
            }["GreenhouseVisualization.useEffect"]);
            // Add accessories with their saved positions
            accessories.forEach({
                "GreenhouseVisualization.useEffect": (accessory)=>{
                    const room = accessory.placement?.room || ROOMS.MAIN;
                    const position = accessory.placement?.position || {
                        x: 0,
                        y: 0
                    };
                    initialPlacement[room].push({
                        ...accessory,
                        type: 'accessory',
                        position
                    });
                }
            }["GreenhouseVisualization.useEffect"]);
            // Add special items with their saved positions
            specialItems.forEach({
                "GreenhouseVisualization.useEffect": (item)=>{
                    const room = item.placement?.room || ROOMS.MAIN;
                    const position = item.placement?.position || {
                        x: 0,
                        y: 0
                    };
                    initialPlacement[room].push({
                        ...item,
                        type: 'special',
                        position
                    });
                }
            }["GreenhouseVisualization.useEffect"]);
            setPlacedItems(initialPlacement);
        }
    }["GreenhouseVisualization.useEffect"], [
        plants,
        accessories,
        specialItems
    ]);
    // Handle drag start for inventory item
    const handleDragStart = (item)=>{
        setDraggedItem(item);
    };
    // Handle drag over for drop zone
    const handleDragOver = (e)=>{
        e.preventDefault();
    };
    // Handle drop for placing item
    const handleDrop = (e)=>{
        e.preventDefault();
        if (!draggedItem) return;
        // Calculate position relative to drop zone
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Check if this is an item from inventory or already placed
        if (draggedItem.isInventory) {
            // Add to current room from inventory
            const newPlacedItems = {
                ...placedItems
            };
            newPlacedItems[currentRoom].push({
                ...draggedItem.item,
                position: {
                    x,
                    y
                }
            });
            setPlacedItems(newPlacedItems);
            // Notify parent component
            if (onItemPlace) {
                onItemPlace(draggedItem.item, currentRoom, {
                    x,
                    y
                });
            }
        } else {
            // Move existing item
            const updatedItems = {
                ...placedItems
            };
            // Find and update the item position
            const item = updatedItems[currentRoom].find((i)=>i.id === draggedItem.id);
            if (item) {
                item.position = {
                    x,
                    y
                };
                setPlacedItems(updatedItems);
                // Notify parent component
                if (onItemMove) {
                    onItemMove(item, currentRoom, {
                        x,
                        y
                    });
                }
            }
        }
        setDraggedItem(null);
    };
    // Get room background image
    const getRoomBackground = ()=>{
        switch(currentRoom){
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
    const getRoomName = ()=>{
        switch(currentRoom){
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
        ...plants.filter((p)=>!p.placement),
        ...accessories.filter((a)=>!a.placement),
        ...specialItems.filter((s)=>!s.placement)
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-green-800 text-white p-2 flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-medium",
                        children: getRoomName()
                    }, void 0, false, {
                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowInventory(!showInventory),
                                className: "px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm",
                                children: showInventory ? 'Hide Inventory' : 'Show Inventory'
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>changeTimeOfDay(environmentEffects.timeOfDay === 'day' ? 'night' : 'day'),
                                        className: `p-1 rounded ${environmentEffects.timeOfDay === 'day' ? 'bg-yellow-500' : 'bg-blue-800'}`,
                                        title: environmentEffects.timeOfDay === 'day' ? 'Switch to Night' : 'Switch to Day',
                                        children: environmentEffects.timeOfDay === 'day' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-5 w-5 text-yellow-100",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 284,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-5 w-5 text-blue-100",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 288,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                            lineNumber: 287,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleRain,
                                        className: `p-1 rounded ${environmentEffects.rain ? 'bg-blue-600' : 'bg-gray-600'}`,
                                        title: environmentEffects.rain ? 'Stop Rain' : 'Start Rain',
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-5 w-5 text-blue-100",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 294,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: toggleWind,
                                        className: `p-1 rounded ${environmentEffects.wind ? 'bg-blue-600' : 'bg-gray-600'}`,
                                        title: environmentEffects.wind ? 'Stop Wind' : 'Start Wind',
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-5 w-5 text-blue-100",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 311,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-green-700 text-white flex overflow-x-auto",
                children: Object.values(ROOMS).map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setCurrentRoom(room),
                        className: `px-4 py-2 text-sm whitespace-nowrap ${currentRoom === room ? 'bg-green-600 font-medium' : 'hover:bg-green-600'}`,
                        children: room === ROOMS.MAIN ? 'Main Growing Room' : room === ROOMS.PROPAGATION ? 'Propagation Room' : room === ROOMS.SHOWCASE ? 'Showcase Room' : room === ROOMS.CARE ? 'Care Station' : room === ROOMS.WORKSHOP ? 'Workshop' : room === ROOMS.MARKET ? 'Market' : 'Lab'
                    }, room, false, {
                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex-grow flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full relative overflow-hidden",
                        onDragOver: handleDragOver,
                        onDrop: handleDrop,
                        style: {
                            backgroundImage: `url(${getRoomBackground()})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        },
                        children: [
                            currentRoom === ROOMS.PROPAGATION ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$InteractivePlantingArea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                plants: plants,
                                onPlantGrowth: (plantId, growthStage)=>{
                                    // Update the plant growth state
                                    setPlantGrowth((prev)=>({
                                            ...prev,
                                            [plantId]: growthStage
                                        }));
                                },
                                onPlantWater: (plantId, growthStage)=>{
                                    // Update the plant growth state
                                    setPlantGrowth((prev)=>({
                                            ...prev,
                                            [plantId]: growthStage
                                        }));
                                },
                                environmentEffects: environmentEffects
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this) : currentRoom === ROOMS.MAIN ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$TreeGardenVisualization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                plants: plants,
                                onPlantGrowth: advancePlantGrowth,
                                environmentEffects: environmentEffects
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 374,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    environmentEffects.rain && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 pointer-events-none overflow-hidden",
                                        children: [
                                            ...Array(30)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 bg-blue-400 opacity-70",
                                                style: {
                                                    left: `${Math.random() * 100}%`,
                                                    width: '1px',
                                                    height: `${Math.random() * 15 + 10}px`,
                                                    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                                                    animationDelay: `${Math.random() * 1.5}s`,
                                                    animation: 'water-drop 1.5s linear infinite'
                                                }
                                            }, `rain-${i}`, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 386,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 384,
                                        columnNumber: 17
                                    }, this),
                                    environmentEffects.wind && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 pointer-events-none overflow-hidden",
                                        children: [
                                            ...Array(15)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bg-white opacity-30",
                                                style: {
                                                    top: `${Math.random() * 100}%`,
                                                    left: '0%',
                                                    width: `${Math.random() * 50 + 30}px`,
                                                    height: '1px',
                                                    animation: 'plant-sway 3s linear infinite',
                                                    animationDelay: `${Math.random() * 3}s`
                                                }
                                            }, `wind-${i}`, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 406,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 404,
                                        columnNumber: 17
                                    }, this),
                                    environmentEffects.timeOfDay !== 'day' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 pointer-events-none bg-blue-900 transition-opacity duration-1000",
                                        style: {
                                            opacity: environmentEffects.timeOfDay === 'night' ? 0.5 : environmentEffects.timeOfDay === 'dusk' ? 0.3 : environmentEffects.timeOfDay === 'dawn' ? 0.2 : 0
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 424,
                                        columnNumber: 17
                                    }, this),
                                    placedItems[currentRoom].map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute cursor-move hover:z-50 transition-transform hover:scale-105",
                                            style: {
                                                left: `${item.position.x}px`,
                                                top: `${item.position.y}px`,
                                                width: '80px',
                                                height: '80px'
                                            },
                                            draggable: true,
                                            onDragStart: ()=>setDraggedItem(item),
                                            onClick: ()=>setSelectedItem(item),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: item.image,
                                                    alt: item.name,
                                                    className: "w-full h-full object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "opacity-0 hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-1 transition-opacity",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                    lineNumber: 456,
                                                    columnNumber: 19
                                                }, this),
                                                item.type === 'plant' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-0 animate-pulse-slow opacity-10 bg-green-200 rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `absolute inset-0 ${environmentEffects.wind ? 'plant-sway-animation' : 'plant-animation'}`,
                                                            style: {
                                                                transform: `scale(${plantGrowth[item.id] || 0.5})`,
                                                                opacity: (plantGrowth[item.id] || 0.5) * 0.6 + 0.4
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-full bg-green-500 transition-all duration-1000",
                                                                style: {
                                                                    width: `${(plantGrowth[item.id] || 0) * 100}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                                lineNumber: 474,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 473,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity focus:outline-none",
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                advancePlantGrowth(item.id);
                                                            },
                                                            title: "Water plant",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                className: "h-4 w-4",
                                                                fill: "none",
                                                                viewBox: "0 0 24 24",
                                                                stroke: "currentColor",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                                    lineNumber: 490,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                item.type === 'accessory' && item.name.toLowerCase().includes('water') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 water-animation",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-1 h-1 bg-blue-400 rounded-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 21
                                                }, this),
                                                item.type === 'special' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 sparkle-animation",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full opacity-70"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute bottom-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full opacity-70",
                                                            style: {
                                                                animationDelay: '0.5s'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 503,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-300 rounded-full opacity-70",
                                                            style: {
                                                                animationDelay: '1s'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                            lineNumber: 504,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `${item.id}-${index}`, true, {
                                            fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                            lineNumber: 436,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true),
                            selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg max-w-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-sm",
                                                children: selectedItem.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 516,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedItem(null),
                                                className: "text-gray-500 hover:text-gray-700",
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 517,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 515,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-600 mt-1",
                                        children: selectedItem.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 524,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 514,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    showInventory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-64 bg-white border-l border-gray-200 overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-b border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-medium text-sm",
                                    children: "Inventory"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                    lineNumber: 533,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 532,
                                columnNumber: 13
                            }, this),
                            inventoryItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 text-center text-gray-500 text-sm",
                                children: "No items in inventory"
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 p-2",
                                children: inventoryItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded p-2 flex flex-col items-center cursor-move hover:bg-gray-50",
                                        draggable: true,
                                        onDragStart: ()=>handleDragStart({
                                                item,
                                                isInventory: true
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: item.image,
                                                alt: item.name,
                                                className: "w-12 h-12 object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 549,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs mt-1 text-center",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                                lineNumber: 554,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                        lineNumber: 543,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                                lineNumber: 541,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                        lineNumber: 531,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
                lineNumber: 341,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/greenhouse/GreenhouseVisualization.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
};
_s(GreenhouseVisualization, "x9JwdaPO+uBeuHOtiBdfNBn7H8Q=");
_c = GreenhouseVisualization;
const __TURBOPACK__default__export__ = GreenhouseVisualization;
var _c;
__turbopack_context__.k.register(_c, "GreenhouseVisualization");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/greenhouse/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/greenhouse/page.tsx
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$GreenhouseVisualization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/greenhouse/GreenhouseVisualization.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const Greenhouse = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [accessories, setAccessories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [specialItems, setSpecialItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isIdentityConfirmed, setIsIdentityConfirmed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // Changed to true for demo
    const [fullName, setFullName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showItemDetails, setShowItemDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Greenhouse.useEffect": ()=>{
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].onAuthStateChanged({
                "Greenhouse.useEffect.unsubscribe": async (user)=>{
                    if (user) {
                        setUser(user);
                        try {
                            // Get user profile
                            const userProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserProfile"])(user.uid);
                            if (userProfile) {
                                setProfile(userProfile);
                                // Fetch user's items from Firestore
                                await fetchUserItems(user.uid);
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
            }["Greenhouse.useEffect.unsubscribe"]);
            return ({
                "Greenhouse.useEffect": ()=>unsubscribe()
            })["Greenhouse.useEffect"];
        }
    }["Greenhouse.useEffect"], [
        router
    ]);
    // Fetch user's purchased items
    const fetchUserItems = async (userId)=>{
        try {
            // Get user's document
            const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId));
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
            const storeItemsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'storeItems');
            const storeItemsSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(storeItemsRef);
            const allStoreItems = {};
            storeItemsSnapshot.forEach((doc)=>{
                allStoreItems[doc.id] = {
                    id: doc.id,
                    ...doc.data()
                };
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
                const userPlants = ownedItems.plants.map((id)=>allStoreItems[id]).filter((item)=>item);
                const userAccessories = ownedItems.accessories.map((id)=>allStoreItems[id]).filter((item)=>item);
                const userSpecialItems = ownedItems.specials.map((id)=>allStoreItems[id]).filter((item)=>item);
                setPlants(userPlants);
                setAccessories(userAccessories);
                setSpecialItems(userSpecialItems);
            }
        } catch (err) {
            console.error('Error fetching user items:', err);
            setError('Failed to load your greenhouse inventory: ' + err.message);
        }
    };
    // If no store items exist yet, use demo data
    const fetchDemoPlants = async (ownedPlantIds)=>{
        // This simulates fetching plants from a database
        const demoPlants = [
            {
                id: 'plant1',
                name: 'Sunflower',
                image: '/images/plants/sunflower.png',
                description: 'A tall, cheerful flower that follows the sun. Sunflowers represent adoration, loyalty, and longevity.',
                seedCost: 10,
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
            }
        ];
        // Filter to return only owned plants
        return demoPlants.filter((plant)=>ownedPlantIds.includes(plant.id));
    };
    const fetchDemoAccessories = async (ownedAccessoryIds)=>{
        const demoAccessories = [
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
            }
        ];
        return demoAccessories.filter((acc)=>ownedAccessoryIds.includes(acc.id));
    };
    const fetchDemoSpecialItems = async (ownedSpecialIds)=>{
        const demoSpecialItems = [
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
        return demoSpecialItems.filter((item)=>ownedSpecialIds.includes(item.id));
    };
    // Handle item placement in the greenhouse
    const handleItemPlace = async (item, room, position)=>{
        if (!user) return;
        try {
            // Update the item placement in the database
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
            // Create placement data
            const placementData = {
                room,
                position
            };
            // Create the update object using the correct path for the specific item
            const updateData = {
                [`itemPlacements.${item.id}`]: placementData,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            };
            // Update Firestore
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, updateData);
            // Update local state
            if (item.type === 'plant') {
                setPlants((prev)=>prev.map((p)=>p.id === item.id ? {
                            ...p,
                            placement: placementData
                        } : p));
            } else if (item.type === 'accessory') {
                setAccessories((prev)=>prev.map((a)=>a.id === item.id ? {
                            ...a,
                            placement: placementData
                        } : a));
            } else if (item.type === 'special') {
                setSpecialItems((prev)=>prev.map((s)=>s.id === item.id ? {
                            ...s,
                            placement: placementData
                        } : s));
            }
        } catch (err) {
            console.error('Error updating item placement:', err);
        }
    };
    // Handle item movement within the greenhouse
    const handleItemMove = async (item, room, position)=>{
        if (!user) return;
        try {
            // Update the item placement in the database
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
            // Create placement data
            const placementData = {
                room,
                position
            };
            // Create the update object
            const updateData = {
                [`itemPlacements.${item.id}`]: placementData,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            };
            // Update Firestore
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, updateData);
            // Update local state
            if (item.type === 'plant') {
                setPlants((prev)=>prev.map((p)=>p.id === item.id ? {
                            ...p,
                            placement: placementData
                        } : p));
            } else if (item.type === 'accessory') {
                setAccessories((prev)=>prev.map((a)=>a.id === item.id ? {
                            ...a,
                            placement: placementData
                        } : a));
            } else if (item.type === 'special') {
                setSpecialItems((prev)=>prev.map((s)=>s.id === item.id ? {
                            ...s,
                            placement: placementData
                        } : s));
            }
        } catch (err) {
            console.error('Error updating item placement:', err);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
            }, void 0, false, {
                fileName: "[project]/app/greenhouse/page.tsx",
                lineNumber: 359,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/greenhouse/page.tsx",
            lineNumber: 358,
            columnNumber: 7
        }, this);
    }
    if (!profile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-red-100 text-red-700 rounded-md",
                children: "Error loading your greenhouse. Please try again later."
            }, void 0, false, {
                fileName: "[project]/app/greenhouse/page.tsx",
                lineNumber: 367,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/greenhouse/page.tsx",
            lineNumber: 366,
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
                                        children: "Your Greenhouse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 379,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600",
                                        children: "Arrange your plants and accessories in your virtual greenhouse"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 378,
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
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-green-800",
                                        children: profile.seeds
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-3 bg-red-100 text-red-700 rounded",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 393,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-2",
                                        children: "Plants"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/images/plants/sunflower.png",
                                                    alt: "Plants",
                                                    className: "w-6 h-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/greenhouse/page.tsx",
                                                    lineNumber: 404,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-bold",
                                                children: plants.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-2",
                                        children: "Accessories"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 411,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/images/accessories/watering-can.png",
                                                    alt: "Accessories",
                                                    className: "w-6 h-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/greenhouse/page.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-bold",
                                                children: accessories.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 416,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 412,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 p-4 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-2",
                                        children: "Special Items"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/images/accessories/bee-box.png",
                                                    alt: "Special Items",
                                                    className: "w-6 h-6"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/greenhouse/page.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-bold",
                                                children: specialItems.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 426,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 422,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[600px] border border-gray-200 rounded-lg overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$greenhouse$2f$GreenhouseVisualization$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            plants: plants,
                            accessories: accessories,
                            specialItems: specialItems,
                            onItemPlace: handleItemPlace,
                            onItemMove: handleItemMove
                        }, void 0, false, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 433,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this),
                    plants.length === 0 && accessories.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 bg-green-50 rounded-lg p-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-green-800 mb-2",
                                children: "Your greenhouse is empty!"
                            }, void 0, false, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 445,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4",
                                children: "Visit the store to purchase plants and accessories for your greenhouse."
                            }, void 0, false, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 446,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/store'),
                                className: "px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg",
                                children: "Visit Store"
                            }, void 0, false, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 449,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 444,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/greenhouse/page.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-green-800 mb-4",
                        children: "Your Greenhouse Inventory"
                    }, void 0, false, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 461,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-3 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-5 h-5 bg-green-100 rounded-full mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 467,
                                                columnNumber: 15
                                            }, this),
                                            "Plants"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 466,
                                        columnNumber: 13
                                    }, this),
                                    plants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 p-4 rounded text-center text-gray-500",
                                        children: "No plants yet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 472,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: plants.map((plant)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow",
                                                onClick: ()=>{
                                                    setSelectedItem(plant);
                                                    setShowItemDetails(true);
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-center mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-green-50 rounded-full flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: plant.image,
                                                                alt: plant.name,
                                                                className: "w-12 h-12 object-contain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                                lineNumber: 488,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/greenhouse/page.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-medium text-center",
                                                        children: plant.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, plant.id, true, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 478,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 476,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 465,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-3 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-5 h-5 bg-yellow-100 rounded-full mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 505,
                                                columnNumber: 15
                                            }, this),
                                            "Accessories"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 504,
                                        columnNumber: 13
                                    }, this),
                                    accessories.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 p-4 rounded text-center text-gray-500",
                                        children: "No accessories yet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: accessories.map((accessory)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow",
                                                onClick: ()=>{
                                                    setSelectedItem(accessory);
                                                    setShowItemDetails(true);
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-center mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: accessory.image,
                                                                alt: accessory.name,
                                                                className: "w-12 h-12 object-contain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                                lineNumber: 526,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/greenhouse/page.tsx",
                                                            lineNumber: 525,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 524,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-medium text-center",
                                                        children: accessory.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, accessory.id, true, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 516,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 503,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium mb-3 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-5 h-5 bg-purple-100 rounded-full mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 543,
                                                columnNumber: 15
                                            }, this),
                                            "Special Items"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 542,
                                        columnNumber: 13
                                    }, this),
                                    specialItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 p-4 rounded text-center text-gray-500",
                                        children: "No special items yet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 548,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: specialItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow",
                                                onClick: ()=>{
                                                    setSelectedItem(item);
                                                    setShowItemDetails(true);
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-center mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: item.image,
                                                                alt: item.name,
                                                                className: "w-12 h-12 object-contain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                                lineNumber: 564,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/greenhouse/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-medium text-center",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/greenhouse/page.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 554,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 463,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 border-t pt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-50 rounded-lg p-4 flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-medium text-green-800",
                                            children: "Need more plants or accessories?"
                                        }, void 0, false, {
                                            fileName: "[project]/app/greenhouse/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600",
                                            children: "Visit the store to expand your collection."
                                        }, void 0, false, {
                                            fileName: "[project]/app/greenhouse/page.tsx",
                                            lineNumber: 584,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 582,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/store'),
                                    className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md",
                                    children: "Visit Store"
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 586,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 581,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/greenhouse/page.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/greenhouse/page.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this),
            showItemDetails && selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg max-w-md w-full p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold",
                                    children: selectedItem.name
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 601,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowItemDetails(false),
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
                                            fileName: "[project]/app/greenhouse/page.tsx",
                                            lineNumber: 607,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 602,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 600,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-32 h-32 rounded-full flex items-center justify-center bg-green-50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: selectedItem.image,
                                    alt: selectedItem.name,
                                    className: "w-24 h-24 object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 614,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 613,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 612,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-4",
                            children: selectedItem.description
                        }, void 0, false, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 622,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 p-3 rounded-md mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: "Seed Cost:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 626,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/images/seed-icon.png",
                                                alt: "Seeds",
                                                className: "w-4 h-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 628,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold",
                                                children: selectedItem.seedCost
                                            }, void 0, false, {
                                                fileName: "[project]/app/greenhouse/page.tsx",
                                                lineNumber: 633,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/greenhouse/page.tsx",
                                        lineNumber: 627,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/greenhouse/page.tsx",
                                lineNumber: 625,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 624,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowItemDetails(false),
                                    className: "px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 639,
                                    columnNumber: 15
                                }, this),
                                !selectedItem.placement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowItemDetails(false);
                                    // Code to place item in greenhouse visualization
                                    },
                                    className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md",
                                    children: "Place in Greenhouse"
                                }, void 0, false, {
                                    fileName: "[project]/app/greenhouse/page.tsx",
                                    lineNumber: 647,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/greenhouse/page.tsx",
                            lineNumber: 638,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/greenhouse/page.tsx",
                    lineNumber: 599,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/greenhouse/page.tsx",
                lineNumber: 598,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/greenhouse/page.tsx",
        lineNumber: 375,
        columnNumber: 5
    }, this);
};
_s(Greenhouse, "KIdDeL37Noe8bz4GU78yXcLugSs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Greenhouse;
const __TURBOPACK__default__export__ = Greenhouse;
var _c;
__turbopack_context__.k.register(_c, "Greenhouse");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_2f19b01a._.js.map