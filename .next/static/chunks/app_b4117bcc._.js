(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/lib/firebase/firestore.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/lib/firebase/firestore.ts - Updated VolunteerTask interface
__turbopack_context__.s({
    "addSeeds": (()=>addSeeds),
    "assignTaskToUser": (()=>assignTaskToUser),
    "checkWeeklyCompletion": (()=>checkWeeklyCompletion),
    "completeTask": (()=>completeTask),
    "createTask": (()=>createTask),
    "getCurrentWeekKey": (()=>getCurrentWeekKey),
    "getNearbyOpportunities": (()=>getNearbyOpportunities),
    "getTasks": (()=>getTasks),
    "getUserTasks": (()=>getUserTasks),
    "getWeeklyTasks": (()=>getWeeklyTasks),
    "resetWeeklyTasks": (()=>resetWeeklyTasks)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
;
;
const getCurrentWeekKey = ()=>{
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber}`;
};
const createTask = async (taskData, userId)=>{
    try {
        // Define the task data without isAssigned (since it doesn't exist in the interface)
        const task = {
            ...taskData,
            createdBy: userId,
            completedBy: [],
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        // If you need isAssigned for functionality, add it to the firestore document
        // but not to the typed object
        const firestoreData = {
            ...task,
            // Add any additional fields needed for Firestore but not in the interface
            assignedTo: null
        };
        const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), firestoreData);
        return {
            id: docRef.id,
            ...task
        };
    } catch (error) {
        throw error;
    }
};
const resetWeeklyTasks = async (userId)=>{
    try {
        // Get user's current tasks
        const userTasks = await getUserTasks(userId);
        // For each task, unassign it
        for (const task of userTasks){
            if (task.id) {
                const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                    assignedTo: null,
                    isAssigned: false,
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
            }
        }
        // Get new tasks to assign based on user's preferences
        // You can modify this based on your application's requirement
        // For example, you can get 3 new tasks per week
        const availableTasksQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isAssigned', '==', false), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('requiredLevel', '==', 'Sapling') // Adjust as needed for the user's level
        );
        const availableTasksSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(availableTasksQuery);
        const availableTasks = [];
        availableTasksSnapshot.forEach((doc)=>{
            availableTasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        // Assign up to 3 new tasks
        const tasksToAssign = availableTasks.slice(0, 3);
        for (const task of tasksToAssign){
            if (task.id) {
                await assignTaskToUser(task.id, userId);
            }
        }
        return true;
    } catch (error) {
        console.error('Error resetting weekly tasks:', error);
        throw error;
    }
};
const getTasks = async (filters)=>{
    try {
        const tasksCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks');
        let q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(tasksCollection);
        // Build query based on filters
        const constraints = [];
        if (filters.category) {
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('category', '==', filters.category));
        }
        if (filters.locationType) {
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('locationType', '==', filters.locationType));
        }
        if (filters.requiredLevel) {
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('requiredLevel', '==', filters.requiredLevel));
        }
        if (filters.isAssigned !== undefined) {
            constraints.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isAssigned', '==', filters.isAssigned));
        }
        if (constraints.length > 0) {
            q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(tasksCollection, ...constraints);
        }
        const querySnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const tasks = [];
        querySnapshot.forEach((doc)=>{
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return tasks;
    } catch (error) {
        throw error;
    }
};
const getUserTasks = async (userId)=>{
    try {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('assignedTo', '==', userId));
        const querySnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        const tasks = [];
        querySnapshot.forEach((doc)=>{
            tasks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return tasks;
    } catch (error) {
        throw error;
    }
};
const assignTaskToUser = async (taskId, userId)=>{
    try {
        const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', taskId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
            completionDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            assignedTo: userId,
            isAssigned: true,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    } catch (error) {
        throw error;
    }
};
const completeTask = async (taskId, userId, completionData)=>{
    try {
        // Update the task document
        const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', taskId);
        const taskDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(taskRef);
        if (!taskDoc.exists()) {
            throw new Error('Task not found');
        }
        const taskData = taskDoc.data();
        const completedBy = taskData.completedBy || [];
        if (!completedBy.includes(userId)) {
            completedBy.push(userId);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
            completedBy,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        // Create a completion record
        const completion = {
            taskId,
            userId,
            completionDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            imageUrl: completionData.imageUrl,
            summary: completionData.summary,
            contactInfo: completionData.contactInfo,
            rating: completionData.rating,
            feedback: completionData.feedback,
            timeSpent: completionData.timeSpent,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        const completionRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'taskCompletions'), completion);
        return {
            id: completionRef.id,
            ...completion
        };
    } catch (error) {
        throw error;
    }
};
const getNearbyOpportunities = async (latitude, longitude, radiusInKm = 10, userLevel)=>{
    try {
        // In a real implementation, we would use a spatial query
        // For simplicity, we'll get all tasks and filter them manually
        const tasks = await getTasks({
            isAssigned: false,
            requiredLevel: userLevel === 'Bloom' ? undefined : userLevel // Bloom users can see all opportunities
        });
        // Filter tasks by distance
        const nearbyTasks = tasks.filter((task)=>{
            // Check if task has coordinates
            if (!task.location?.coordinates?.latitude || !task.location?.coordinates?.longitude) {
                return false;
            }
            // Calculate distance using Haversine formula
            const distance = calculateDistance(latitude, longitude, task.location.coordinates.latitude, task.location.coordinates.longitude);
            return distance <= radiusInKm;
        });
        return nearbyTasks;
    } catch (error) {
        throw error;
    }
};
// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2)=>{
    const R = 6371; // Radius of the Earth in km
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
const degToRad = (deg)=>{
    return deg * (Math.PI / 180);
};
const getWeeklyTasks = async (userId, weeklyCommitment)=>{
    try {
        // Get user profile to determine level and preferences
        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        const userLevel = userData.level;
        const preferences = userData.rankingPreferences;
        // Sort categories by user preference
        const sortedCategories = [
            {
                category: 'communityService',
                rank: preferences.communityService
            },
            {
                category: 'environmentalAction',
                rank: preferences.environmentalAction
            },
            {
                category: 'educationYouthSupport',
                rank: preferences.educationYouthSupport
            },
            {
                category: 'healthWellness',
                rank: preferences.healthWellness
            }
        ].sort((a, b)=>a.rank - b.rank).map((item)=>item.category);
        // Get unassigned tasks suitable for user's level
        const availableTasks = await getTasks({
            isAssigned: false,
            requiredLevel: userLevel
        });
        // Prioritize tasks based on user preferences
        const prioritizedTasks = availableTasks.sort((a, b)=>{
            const categoryIndexA = sortedCategories.indexOf(a.category);
            const categoryIndexB = sortedCategories.indexOf(b.category);
            return categoryIndexA - categoryIndexB;
        });
        // Limit to weekly commitment number
        const tasksToAssign = prioritizedTasks.slice(0, weeklyCommitment);
        // Assign tasks to user
        for (const task of tasksToAssign){
            if (task.id) {
                await assignTaskToUser(task.id, userId);
            }
        }
        return tasksToAssign;
    } catch (error) {
        throw error;
    }
};
const addSeeds = async (userId, amount)=>{
    try {
        const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId);
        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        const currentSeeds = userData.seeds || 0;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
            seeds: currentSeeds + amount,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return currentSeeds + amount;
    } catch (error) {
        console.error('Error adding seeds:', error);
        throw error;
    }
};
const checkWeeklyCompletion = async (userId)=>{
    try {
        // Get user's assigned tasks
        const userTasks = await getUserTasks(userId);
        // Get user's completed tasks
        const completedTasks = userTasks.filter((task)=>task.completedBy && task.completedBy.includes(userId));
        // Calculate seeds based on completion ratio
        const completionRatio = userTasks.length > 0 ? completedTasks.length / userTasks.length : 0;
        let seedsEarned = 0;
        if (completionRatio === 1) {
            // All tasks completed, award 5 seeds
            seedsEarned = 5;
        } else if (completionRatio > 0) {
            // Partial completion, award proportional seeds (rounded down)
            seedsEarned = Math.floor(completionRatio * 5);
        }
        if (seedsEarned > 0) {
            // Add seeds to user's account
            await addSeeds(userId, seedsEarned);
        }
        return {
            total: userTasks.length,
            completed: completedTasks.length,
            seedsEarned
        };
    } catch (error) {
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/lib/tasks/taskGenerator.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/lib/tasks/taskGenerator.ts - FIXED VERSION (No undefined values)
__turbopack_context__.s({
    "generateNearbyBusinessTask": (()=>generateNearbyBusinessTask),
    "generateRandomTasks": (()=>generateRandomTasks),
    "generateWeeklyTasks": (()=>generateWeeklyTasks)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/auth.ts [app-client] (ecmascript)");
;
// Sample locations to use when precise location isn't available
const fallbackLocations = [
    {
        name: 'Local Community Center',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Neighborhood Park',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Public Library',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Elementary School',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Senior Center',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Food Bank',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Animal Shelter',
        latitude: 0,
        longitude: 0
    },
    {
        name: 'Community Garden',
        latitude: 0,
        longitude: 0
    }
];
// Task templates by category
const taskTemplates = {
    communityService: [
        {
            title: 'Help at a Local Food Bank',
            description: 'sort and package food donations to support families in need.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'Neighborhood Cleanup',
            description: 'join a team to pick up litter and beautify public spaces in your community.',
            estimatedTime: 90,
            locationType: 'inPerson'
        },
        {
            title: 'Senior Companion',
            description: 'spend time with senior citizens who may be experiencing isolation. Chat, play games, or help with simple tasks.',
            estimatedTime: 60,
            locationType: 'inPerson'
        },
        {
            title: 'Donation Drive Coordinator',
            description: 'organize a collection drive for clothes, books, or toys to donate to those in need.',
            estimatedTime: 180,
            locationType: 'remote'
        },
        {
            title: 'Community Event Volunteer',
            description: 'help set up, run, or clean up at a local community event or festival.',
            estimatedTime: 240,
            locationType: 'inPerson'
        }
    ],
    environmentalAction: [
        {
            title: 'Tree Planting Initiative',
            description: 'join a team to plant trees and improve the local ecosystem.',
            estimatedTime: 180,
            locationType: 'inPerson'
        },
        {
            title: 'Beach or Waterway Cleanup',
            description: 'help remove trash and plastic from beaches, rivers, or lakes to protect wildlife.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'Recycling Education Campaign',
            description: 'create and share information about proper recycling practices in your community.',
            estimatedTime: 90,
            locationType: 'remote'
        },
        {
            title: 'Community Garden Helper',
            description: 'assist with planting, weeding, and harvesting at a local community garden.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'Wildlife Habitat Improvement',
            description: 'help build or improve habitats for local wildlife, such as bird houses or butterfly gardens.',
            estimatedTime: 150,
            locationType: 'inPerson'
        }
    ],
    educationYouthSupport: [
        {
            title: 'Virtual Tutoring Session',
            description: 'provide one-on-one tutoring help for a student who needs assistance with schoolwork.',
            estimatedTime: 60,
            locationType: 'virtual'
        },
        {
            title: 'Reading Buddy',
            description: 'read with young children to help improve their literacy skills and foster a love of reading.',
            estimatedTime: 45,
            locationType: 'virtual'
        },
        {
            title: 'STEM Workshop Assistant',
            description: 'help run a workshop teaching science, technology, engineering, or math concepts to youth.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'After-School Program Helper',
            description: 'assist with activities, homework help, or supervision at an after-school program.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'College Application Mentor',
            description: 'help high school students navigate the college application process, essays, and scholarships.',
            estimatedTime: 90,
            locationType: 'virtual'
        }
    ],
    healthWellness: [
        {
            title: 'Wellness Check Caller',
            description: 'make phone calls to check on elderly or vulnerable community members.',
            estimatedTime: 60,
            locationType: 'remote'
        },
        {
            title: 'Health Fair Volunteer',
            description: 'assist with organization or activities at a community health fair.',
            estimatedTime: 180,
            locationType: 'inPerson'
        },
        {
            title: 'Meal Preparation Helper',
            description: 'prepare meals for those who are ill, elderly, or unable to cook for themselves.',
            estimatedTime: 120,
            locationType: 'inPerson'
        },
        {
            title: 'Mental Health Awareness Campaign',
            description: 'create and share resources about mental health awareness and support options.',
            estimatedTime: 90,
            locationType: 'remote'
        },
        {
            title: 'Fitness Buddy',
            description: 'accompany someone who needs motivation or assistance with physical activity.',
            estimatedTime: 60,
            locationType: 'inPerson'
        }
    ]
};
// Business-specific task templates
const businessTaskTemplates = [
    {
        businessType: 'coffee shop',
        tasks: [
            {
                title: 'Coffee Shop Community Corner',
                description: 'work with a local coffee shop to establish a community bulletin board or book exchange corner.',
                category: 'communityService',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'Coffee Grounds Recycling Program',
                description: 'coordinate with a local coffee shop to collect used coffee grounds for community garden composting.',
                category: 'environmentalAction',
                estimatedTime: 90,
                locationType: 'inPerson'
            }
        ]
    },
    {
        businessType: 'restaurant',
        tasks: [
            {
                title: 'Restaurant Food Donation Coordination',
                description: 'help coordinate the donation of unused food from restaurants to local shelters or food banks.',
                category: 'communityService',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'Sustainable Restaurant Practices',
                description: 'work with local restaurants to implement more environmentally friendly practices like reducing single-use plastics.',
                category: 'environmentalAction',
                estimatedTime: 150,
                locationType: 'inPerson'
            }
        ]
    },
    {
        businessType: 'library',
        tasks: [
            {
                title: 'Library Reading Program',
                description: 'help organize or run reading programs for children at the local library.',
                category: 'educationYouthSupport',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'Digital Literacy Workshops',
                description: 'assist seniors or other community members with technology skills at the local library.',
                category: 'educationYouthSupport',
                estimatedTime: 90,
                locationType: 'inPerson'
            }
        ]
    },
    {
        businessType: 'park',
        tasks: [
            {
                title: 'Park Cleanup Initiative',
                description: 'organize or participate in a cleanup day at a local park.',
                category: 'environmentalAction',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'Nature Walk Guide',
                description: 'lead educational nature walks for community members at a local park.',
                category: 'educationYouthSupport',
                estimatedTime: 90,
                locationType: 'inPerson'
            }
        ]
    },
    {
        businessType: 'school',
        tasks: [
            {
                title: 'School Garden Project',
                description: 'help maintain or establish a garden at a local school to teach children about growing food.',
                category: 'environmentalAction',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'After-School Tutoring',
                description: 'provide tutoring support to students after school hours.',
                category: 'educationYouthSupport',
                estimatedTime: 90,
                locationType: 'inPerson'
            }
        ]
    },
    {
        businessType: 'grocery store',
        tasks: [
            {
                title: 'Grocery Delivery for Seniors',
                description: 'coordinate with a local grocery store to help deliver groceries to elderly or disabled community members.',
                category: 'healthWellness',
                estimatedTime: 120,
                locationType: 'inPerson'
            },
            {
                title: 'Food Waste Reduction Program',
                description: 'work with a local grocery store to implement or improve food waste reduction and donation programs.',
                category: 'environmentalAction',
                estimatedTime: 150,
                locationType: 'inPerson'
            }
        ]
    }
];
// Helper function to get random element from array
const getRandomElement = (array)=>{
    return array[Math.floor(Math.random() * array.length)];
};
// Helper function to get random task template by category
const getRandomTaskTemplate = (category)=>{
    return getRandomElement(taskTemplates[category]);
};
// Helper function to generate a variation of a task description
const generateTaskVariation = (description)=>{
    const introductions = [
        '',
        'We need your help to ',
        'An exciting opportunity to ',
        'Your community needs you to ',
        'Make a difference by helping to ',
        'Join others to '
    ];
    const conclusion = [
        '',
        ' This is a great way to make a positive impact!',
        ' Your contribution will make a real difference.',
        ' This is perfect for someone with your interests!',
        ' This opportunity matches your volunteering goals.',
        ' Help create positive change through this activity.'
    ];
    return `${getRandomElement(introductions)}${description.replace(/\.$/, '')}${getRandomElement(conclusion)}`;
};
// Helper function to create clean task data (no undefined values)
const createTaskData = (baseTask)=>{
    // Start with required fields only
    const cleanTask = {
        title: baseTask.title,
        description: baseTask.description,
        category: baseTask.category,
        estimatedTime: baseTask.estimatedTime,
        locationType: baseTask.locationType,
        isAssigned: false,
        completedBy: [],
        status: 'open'
    };
    // Only add optional fields if they have valid values
    if (baseTask.location && baseTask.location.address && baseTask.location.coordinates && typeof baseTask.location.coordinates.latitude === 'number' && typeof baseTask.location.coordinates.longitude === 'number') {
        cleanTask.location = baseTask.location;
    }
    if (baseTask.impact) {
        cleanTask.impact = baseTask.impact;
    }
    if (baseTask.requirements) {
        cleanTask.requirements = baseTask.requirements;
    }
    return cleanTask;
};
const generateNearbyBusinessTask = (businessName, businessType, location, userLevel)=>{
    const businessTemplate = businessTaskTemplates.find((template)=>businessType.toLowerCase().includes(template.businessType)) || getRandomElement(businessTaskTemplates);
    if (!businessTemplate) return null;
    const taskTemplate = getRandomElement(businessTemplate.tasks);
    const baseTask = {
        title: taskTemplate.title.replace('a local', businessName),
        description: generateTaskVariation(taskTemplate.description.replace('a local', businessName)),
        category: taskTemplate.category,
        estimatedTime: taskTemplate.estimatedTime,
        locationType: taskTemplate.locationType,
        isAssigned: false,
        completedBy: [],
        status: 'open'
    };
    // Only add location for non-Sprout users with valid coordinates
    if (userLevel !== __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserLevel"].Sprout && location && typeof location.latitude === 'number' && typeof location.longitude === 'number' && !isNaN(location.latitude) && !isNaN(location.longitude)) {
        baseTask.location = {
            address: businessName,
            coordinates: {
                latitude: location.latitude,
                longitude: location.longitude
            }
        };
    }
    return createTaskData(baseTask);
};
const generateRandomTasks = (count, userLevel, userLocation, preferences)=>{
    const tasks = [];
    const categories = Object.keys(taskTemplates);
    let sortedCategories = [
        ...categories
    ];
    if (preferences) {
        sortedCategories.sort((a, b)=>(preferences[a] || 5) - (preferences[b] || 5));
    }
    for(let i = 0; i < count; i++){
        const usePreference = Math.random() < 0.7;
        const category = usePreference ? sortedCategories[i % sortedCategories.length] : getRandomElement(categories);
        const template = getRandomTaskTemplate(category);
        const baseTask = {
            title: template.title,
            description: generateTaskVariation(template.description),
            category: category,
            estimatedTime: template.estimatedTime,
            locationType: template.locationType,
            isAssigned: false,
            completedBy: [],
            status: 'open'
        };
        // Only add location for in-person tasks with valid user location
        const shouldHaveLocation = template.locationType === 'inPerson' && userLevel !== 'Sprout' && userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number' && !isNaN(userLocation.latitude) && !isNaN(userLocation.longitude) && userLocation.latitude !== 0;
        if (shouldHaveLocation) {
            const radiusKm = 5;
            const randomAngle = Math.random() * 2 * Math.PI;
            const randomDistance = Math.random() * radiusKm;
            const latOffset = randomDistance * Math.cos(randomAngle) / 111;
            const lngOffset = randomDistance * Math.sin(randomAngle) / (111 * Math.cos(userLocation.latitude * Math.PI / 180));
            baseTask.location = {
                address: getRandomElement(fallbackLocations).name,
                coordinates: {
                    latitude: userLocation.latitude + latOffset,
                    longitude: userLocation.longitude + lngOffset
                }
            };
        }
        tasks.push(createTaskData(baseTask));
    }
    return tasks;
};
const generateWeeklyTasks = (weeklyCommitment, userLevel, userLocation, preferences)=>{
    return generateRandomTasks(weeklyCommitment, userLevel, userLocation, preferences);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/lib/location/locationService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/lib/location/locationService.ts
__turbopack_context__.s({
    "getNearbyPlaces": (()=>getNearbyPlaces),
    "requestLocationPermission": (()=>requestLocationPermission),
    "reverseGeocode": (()=>reverseGeocode)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/auth.ts [app-client] (ecmascript)");
;
// Mock data for nearby places
// In a real implementation, this would come from a Maps API like Google Maps or Mapbox
const mockNearbyPlaces = [
    {
        name: 'Central Park',
        type: 'park',
        location: {
            latitude: 40.7812,
            longitude: -73.9665
        },
        distance: 800
    },
    {
        name: 'Main Street Library',
        type: 'library',
        location: {
            latitude: 40.7125,
            longitude: -74.0082
        },
        distance: 1200
    },
    {
        name: 'Sunrise Cafe',
        type: 'coffee shop',
        location: {
            latitude: 40.7155,
            longitude: -74.0050
        },
        distance: 300
    },
    {
        name: 'Green Grocers',
        type: 'grocery store',
        location: {
            latitude: 40.7140,
            longitude: -74.0062
        },
        distance: 500
    },
    {
        name: 'Community Center',
        type: 'community center',
        location: {
            latitude: 40.7135,
            longitude: -74.0072
        },
        distance: 600
    },
    {
        name: 'Washington High School',
        type: 'school',
        location: {
            latitude: 40.7145,
            longitude: -74.0090
        },
        distance: 900
    },
    {
        name: 'Riverfront Park',
        type: 'park',
        location: {
            latitude: 40.7160,
            longitude: -74.0040
        },
        distance: 700
    },
    {
        name: 'City Hospital',
        type: 'hospital',
        location: {
            latitude: 40.7170,
            longitude: -74.0095
        },
        distance: 1500
    },
    {
        name: 'Local Pizzeria',
        type: 'restaurant',
        location: {
            latitude: 40.7132,
            longitude: -74.0058
        },
        distance: 400
    },
    {
        name: 'Starbucks',
        type: 'coffee shop',
        location: {
            latitude: 40.7138,
            longitude: -74.0063
        },
        distance: 250
    }
];
const requestLocationPermission = async (userId)=>{
    if (!navigator.geolocation) {
        return {
            success: false,
            error: 'Geolocation is not supported by your browser'
        };
    }
    try {
        // Request current position
        const position = await new Promise((resolve, reject)=>{
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        // Update user profile with location
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUserProfile"])(userId, {
            location
        });
        return {
            success: true,
            location
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to get location'
        };
    }
};
const getNearbyPlaces = async (location, radius = 2000, limit = 5)=>{
    // In a real implementation, this would call a Maps API
    // For now, we'll simulate it using our mock data and some distance calculations
    // Function to calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2)=>{
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    // In a real implementation, we would call a Maps API here
    // For the mock version, we'll just filter our static data
    // Calculate distance for each place
    const placesWithActualDistance = mockNearbyPlaces.map((place)=>({
            ...place,
            distance: calculateDistance(location.latitude, location.longitude, place.location.latitude, place.location.longitude)
        }));
    // Filter by radius and sort by distance
    const nearbyPlaces = placesWithActualDistance.filter((place)=>place.distance <= radius).sort((a, b)=>a.distance - b.distance).slice(0, limit);
    return nearbyPlaces;
};
const reverseGeocode = async (latitude, longitude)=>{
    // Simulate API delay
    await new Promise((resolve)=>setTimeout(resolve, 500));
    // Return mock data based on coordinates
    // In a real app, this would call Google Maps, Mapbox, or another geocoding service
    return {
        formattedAddress: `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`,
        neighborhood: 'Sample Neighborhood',
        city: 'Sample City',
        state: 'Sample State',
        country: 'Sample Country',
        postalCode: '10000'
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/lib/firebase/tasksService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/lib/firebase/tasksService.ts - SAFER VERSION with better error handling
__turbopack_context__.s({
    "assignWeeklyTasks": (()=>assignWeeklyTasks),
    "checkAndAssignWeeklyTasks": (()=>checkAndAssignWeeklyTasks),
    "forceResetUserTasks": (()=>forceResetUserTasks),
    "getSuggestedTasks": (()=>getSuggestedTasks),
    "resetWeeklyTasksForAllUsers": (()=>resetWeeklyTasksForAllUsers)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskGenerator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/tasks/taskGenerator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$location$2f$locationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/location/locationService.ts [app-client] (ecmascript)");
;
;
;
;
;
// Helper function to clean task data before saving to Firestore
const cleanTaskData = (task)=>{
    const cleanedTask = {
        title: task.title || 'Untitled Task',
        description: task.description || 'No description provided',
        category: task.category || 'communityService',
        estimatedTime: task.estimatedTime || 60,
        locationType: task.locationType || 'remote',
        isAssigned: Boolean(task.isAssigned),
        completedBy: Array.isArray(task.completedBy) ? task.completedBy : [],
        status: task.status || 'open'
    };
    // Only add optional fields if they exist and are not undefined/null
    if (task.location && task.location.address && task.location.coordinates && typeof task.location.coordinates.latitude === 'number' && typeof task.location.coordinates.longitude === 'number' && !isNaN(task.location.coordinates.latitude) && !isNaN(task.location.coordinates.longitude)) {
        cleanedTask.location = {
            address: String(task.location.address),
            coordinates: {
                latitude: Number(task.location.coordinates.latitude),
                longitude: Number(task.location.coordinates.longitude)
            }
        };
    }
    if (task.impact && typeof task.impact === 'string') {
        cleanedTask.impact = task.impact;
    }
    if (task.requirements && typeof task.requirements === 'string') {
        cleanedTask.requirements = task.requirements;
    }
    if (task.assignedTo && typeof task.assignedTo === 'string') {
        cleanedTask.assignedTo = task.assignedTo;
    }
    if (task.weekAssigned && typeof task.weekAssigned === 'string') {
        cleanedTask.weekAssigned = task.weekAssigned;
    }
    if (task.createdBy && typeof task.createdBy === 'string') {
        cleanedTask.createdBy = task.createdBy;
    }
    if (task.isCustom === true) {
        cleanedTask.isCustom = true;
    }
    return cleanedTask;
};
const checkAndAssignWeeklyTasks = async (userId)=>{
    try {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid user ID provided');
        }
        const currentWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentWeekKey"])();
        // Check if user already has tasks for this week
        const existingTasksQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('assignedTo', '==', userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('weekAssigned', '==', currentWeek));
        const existingTasksSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(existingTasksQuery);
        // If user already has tasks for this week, return them
        if (!existingTasksSnapshot.empty) {
            const existingTasks = [];
            existingTasksSnapshot.forEach((doc)=>{
                existingTasks.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(`User ${userId} already has ${existingTasks.length} tasks for week ${currentWeek}`);
            return existingTasks;
        }
        console.log(`No tasks found for user ${userId} for week ${currentWeek}. Assigning new tasks...`);
        // If no tasks for current week, assign new ones
        return await assignWeeklyTasks(userId);
    } catch (error) {
        console.error('Error checking and assigning weekly tasks:', error);
        throw error;
    }
};
const assignWeeklyTasks = async (userId)=>{
    try {
        console.log(`Starting task assignment for user: ${userId}`);
        // Get user profile
        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }
        const userProfile = userDoc.data();
        const { weeklyCommitment = 1, level: userLevel = 'Sprout', rankingPreferences = {}, location } = userProfile;
        const currentWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentWeekKey"])();
        console.log(`Assigning ${weeklyCommitment} tasks for user level ${userLevel} for week ${currentWeek}`);
        // Create tasks based on user preferences
        let tasksToAssign = [];
        // First, try to generate location-based tasks if the user has location data
        if (userLevel !== 'Sprout' && location && typeof location.latitude === 'number' && typeof location.longitude === 'number' && !isNaN(location.latitude) && !isNaN(location.longitude) && location.latitude !== 0) {
            try {
                console.log(`Generating location-based tasks for coordinates: ${location.latitude}, ${location.longitude}`);
                // Get nearby places
                const nearbyPlaces = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$location$2f$locationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNearbyPlaces"])(location, 2000, 10);
                console.log(`Found ${nearbyPlaces.length} nearby places`);
                // Generate tasks for some of the nearby places
                for (const place of nearbyPlaces.slice(0, Math.min(2, weeklyCommitment))){
                    const businessTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskGenerator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateNearbyBusinessTask"])(place.name, place.type, place.location, userLevel);
                    if (businessTask) {
                        tasksToAssign.push(businessTask);
                        console.log(`Generated location-based task: ${businessTask.title}`);
                    }
                }
            } catch (locationError) {
                console.warn('Could not generate location-based tasks:', locationError);
            // Continue with random tasks if location-based generation fails
            }
        }
        // Generate additional random tasks to fulfill the user's weekly commitment
        const additionalTasksNeeded = weeklyCommitment - tasksToAssign.length;
        console.log(`Need ${additionalTasksNeeded} additional tasks`);
        if (additionalTasksNeeded > 0) {
            const randomTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskGenerator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateWeeklyTasks"])(additionalTasksNeeded, userLevel, location, rankingPreferences);
            tasksToAssign = [
                ...tasksToAssign,
                ...randomTasks
            ];
            console.log(`Generated ${randomTasks.length} random tasks`);
        }
        console.log(`Total tasks to assign: ${tasksToAssign.length}`);
        // Save tasks to Firestore using individual addDoc calls instead of batch
        // This avoids potential batch write issues
        const assignedTasks = [];
        for(let i = 0; i < tasksToAssign.length; i++){
            const task = tasksToAssign[i];
            try {
                // Clean the task data to remove any undefined values
                const cleanedTask = cleanTaskData({
                    ...task,
                    assignedTo: userId,
                    isAssigned: true,
                    weekAssigned: currentWeek,
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
                console.log(`Saving task ${i + 1}: ${cleanedTask.title}`);
                // Use addDoc for individual task creation
                const taskRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), cleanedTask);
                // Add the id to the task object for return
                assignedTasks.push({
                    id: taskRef.id,
                    ...cleanedTask
                });
                console.log(`Successfully saved task with ID: ${taskRef.id}`);
            } catch (taskError) {
                console.error(`Error saving task ${i + 1}:`, taskError);
            // Continue with other tasks even if one fails
            }
        }
        console.log(`Successfully assigned ${assignedTasks.length} tasks to user ${userId} for week ${currentWeek}`);
        return assignedTasks;
    } catch (error) {
        console.error('Error assigning weekly tasks:', error);
        throw error;
    }
};
const resetWeeklyTasksForAllUsers = async ()=>{
    try {
        console.log('Starting weekly task reset for all users...');
        // Get all users
        const usersSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users'));
        console.log(`Found ${usersSnapshot.docs.length} users to process`);
        // Process users in smaller batches to avoid timeout
        const batchSize = 10;
        const userBatches = [];
        for(let i = 0; i < usersSnapshot.docs.length; i += batchSize){
            userBatches.push(usersSnapshot.docs.slice(i, i + batchSize));
        }
        let totalUsersProcessed = 0;
        for (const userBatch of userBatches){
            console.log(`Processing batch of ${userBatch.length} users...`);
            // Archive old tasks for this batch
            for (const userDoc of userBatch){
                const userId = userDoc.id;
                try {
                    // Archive old tasks for this user
                    const oldTasksQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('assignedTo', '==', userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isAssigned', '==', true));
                    const oldTasksSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(oldTasksQuery);
                    // Update old tasks individually
                    for (const taskDoc of oldTasksSnapshot.docs){
                        try {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskDoc.ref, {
                                isAssigned: false,
                                isArchived: true,
                                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                            });
                        } catch (updateError) {
                            console.error(`Error archiving task ${taskDoc.id}:`, updateError);
                        }
                    }
                    console.log(`Archived ${oldTasksSnapshot.docs.length} tasks for user ${userId}`);
                } catch (archiveError) {
                    console.error(`Error archiving tasks for user ${userId}:`, archiveError);
                }
            }
            // Assign new tasks for this batch
            for (const userDoc of userBatch){
                try {
                    await assignWeeklyTasks(userDoc.id);
                    totalUsersProcessed++;
                } catch (error) {
                    console.error(`Failed to assign tasks to user ${userDoc.id}:`, error);
                // Continue with other users
                }
            }
        }
        console.log(`Successfully processed ${totalUsersProcessed} users for weekly task assignment`);
    } catch (error) {
        console.error('Error in weekly task reset:', error);
        throw error;
    }
};
const getSuggestedTasks = async (userId, limit = 10)=>{
    try {
        // Get user profile
        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }
        const userProfile = userDoc.data();
        const { level: userLevel, rankingPreferences } = userProfile;
        // Convert ranking preferences to categories sorted by preference
        const categories = Object.entries(rankingPreferences || {}).sort(([, rankA], [, rankB])=>rankA - rankB).map(([category])=>{
            switch(category){
                case 'communityService':
                    return 'communityService';
                case 'environmentalAction':
                    return 'environmentalAction';
                case 'educationYouthSupport':
                    return 'educationYouthSupport';
                case 'healthWellness':
                    return 'healthWellness';
                default:
                    return category;
            }
        });
        // Query for unassigned tasks suitable for the user's level
        let suggestedTasks = [];
        // Try to get tasks from each category in order of preference
        for (const category of categories){
            if (suggestedTasks.length >= limit) break;
            const categoryQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('category', '==', category), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isAssigned', '==', false));
            const categorySnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(categoryQuery);
            categorySnapshot.forEach((doc)=>{
                if (suggestedTasks.length < limit) {
                    suggestedTasks.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });
        }
        // If we still don't have enough tasks, generate some on the fly
        if (suggestedTasks.length < limit) {
            const additionalTasksNeeded = limit - suggestedTasks.length;
            // Get user location if available
            const location = userProfile.location;
            // Generate random tasks
            const randomTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskGenerator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateWeeklyTasks"])(additionalTasksNeeded, userLevel, location, rankingPreferences);
            // We don't save these to Firestore yet - they're just suggestions
            suggestedTasks = [
                ...suggestedTasks,
                ...randomTasks
            ];
        }
        return suggestedTasks;
    } catch (error) {
        console.error('Error getting suggested tasks:', error);
        throw error;
    }
};
const forceResetUserTasks = async (userId)=>{
    try {
        console.log(`Force resetting tasks for user: ${userId}`);
        // Archive current tasks
        const currentTasksQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks'), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('assignedTo', '==', userId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isAssigned', '==', true));
        const currentTasksSnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(currentTasksQuery);
        // Update tasks individually instead of using batch
        for (const taskDoc of currentTasksSnapshot.docs){
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskDoc.ref, {
                    isAssigned: false,
                    isArchived: true,
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
            } catch (updateError) {
                console.error(`Error archiving task ${taskDoc.id}:`, updateError);
            }
        }
        console.log(`Archived ${currentTasksSnapshot.docs.length} existing tasks`);
        // Assign new tasks
        return await assignWeeklyTasks(userId);
    } catch (error) {
        console.error('Error force resetting user tasks:', error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/lib/tasks/taskResources.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/lib/tasks/taskResources.ts
__turbopack_context__.s({
    "generateTaskResources": (()=>generateTaskResources)
});
const generateTaskResources = (task)=>{
    // Resources by task location type
    const locationBasedResources = {
        remote: [
            {
                title: 'Working From Home Effectively',
                url: 'https://www.example.com/remote-work-guide',
                description: 'Tips for effective remote volunteering'
            }
        ],
        inPerson: [
            {
                title: 'In-Person Volunteering Safety Guide',
                url: 'https://www.example.com/safety-guide',
                description: 'Safety tips for in-person volunteering'
            }
        ],
        virtual: [
            {
                title: 'Virtual Meeting Best Practices',
                url: 'https://www.example.com/virtual-meetings',
                description: 'How to run effective virtual volunteering sessions'
            }
        ]
    };
    // Resources by category
    const categoryBasedResources = {
        communityService: [
            {
                title: 'Community Service Guide',
                url: 'https://www.example.com/community-service',
                description: 'Guide to effective community service'
            }
        ],
        environmentalAction: [
            {
                title: 'Environmental Volunteer Guide',
                url: 'https://www.example.com/environmental-guide',
                description: 'Best practices for environmental volunteering'
            }
        ],
        educationYouthSupport: [
            {
                title: 'Working With Youth',
                url: 'https://www.example.com/youth-support',
                description: 'Tips for supporting youth through education'
            }
        ],
        healthWellness: [
            {
                title: 'Health & Wellness Volunteering',
                url: 'https://www.example.com/health-wellness',
                description: 'Guide to health and wellness volunteering'
            }
        ]
    };
    // Task-specific resources
    const taskSpecificResources = {
        'Mental Health Awareness Campaign': [
            {
                title: 'Creating Effective Awareness Campaigns',
                url: 'https://www.example.com/awareness-campaigns',
                description: 'How to create impactful awareness campaigns'
            },
            {
                title: 'Mental Health Resources',
                url: 'https://www.example.com/mental-health',
                description: 'Facts and statistics about mental health'
            },
            {
                title: 'Mental Health Organizations',
                url: 'https://www.example.com/mental-health-orgs',
                description: 'Directory of mental health organizations'
            }
        ]
    };
    // Combine resources based on task properties
    let resources = [];
    // Add location-based resources
    if (task.locationType && locationBasedResources[task.locationType]) {
        resources = [
            ...resources,
            ...locationBasedResources[task.locationType]
        ];
    }
    // Add category-based resources
    if (task.category && categoryBasedResources[task.category]) {
        resources = [
            ...resources,
            ...categoryBasedResources[task.category]
        ];
    }
    // Add task-specific resources
    if (taskSpecificResources[task.title]) {
        resources = [
            ...resources,
            ...taskSpecificResources[task.title]
        ];
    }
    return resources;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/TaskDetailModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/TaskDetailModal.tsx - Fixed version for date handling and optional properties
// Fix for the lines with Date.toDate() errors
// The issue is that we're treating Date objects as if they were Firestore Timestamps
// Let's create a helper function to safely handle both:
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
const TaskDetailModal = ({ task, resources, isCompleted, isInProgress = false, onStartTask, onClose, userId })=>{
    _s();
    const [selectedTab, setSelectedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('details');
    const [showCalendarOptions, setShowCalendarOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Helper function to safely format dates from either Date objects or Firestore Timestamps
    const formatDate = (dateValue)=>{
        if (!dateValue) return 'Not specified';
        // Create a JavaScript Date object, handling both regular Date objects and Firestore Timestamps
        let date;
        if (typeof dateValue.toDate === 'function') {
            // It's a Firestore Timestamp
            date = dateValue.toDate();
        } else if (dateValue instanceof Date) {
            // It's already a Date object
            date = dateValue;
        } else {
            // It might be a string or number, try to convert
            date = new Date(dateValue);
        }
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    // Helper function to safely format time from either Date objects or Firestore Timestamps
    const formatTime = (dateValue)=>{
        if (!dateValue) return '';
        // Create a JavaScript Date object, handling both regular Date objects and Firestore Timestamps
        let date;
        if (typeof dateValue.toDate === 'function') {
            // It's a Firestore Timestamp
            date = dateValue.toDate();
        } else if (dateValue instanceof Date) {
            // It's already a Date object
            date = dateValue;
        } else {
            // It might be a string or number, try to convert
            date = new Date(dateValue);
        }
        return date.toLocaleTimeString();
    };
    // Format address if available
    const formatAddress = ()=>{
        if (!task.location) return 'Remote / Not specified';
        if (task.location.address) return task.location.address;
        if (task.location.coordinates) {
            return `(${task.location.coordinates.latitude.toFixed(4)}, ${task.location.coordinates.longitude.toFixed(4)})`;
        }
        return 'Location not specified';
    };
    // Handle calendar export
    const handleCalendarExport = (type)=>{
        // In a real implementation, you would generate the appropriate calendar file
        alert(`Exporting to ${type} calendar. This would download a calendar file in a real implementation.`);
        setShowCalendarOptions(false);
    };
    // Format time spent (handle undefined value)
    const formatTimeSpent = (seconds)=>{
        if (seconds === undefined || seconds <= 0) return 'None';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-gray-900 pr-8",
                                    children: task.title
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "text-gray-400 hover:text-gray-500",
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
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex mt-4 border-b",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedTab('details'),
                                    className: `px-4 py-2 text-sm font-medium ${selectedTab === 'details' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`,
                                    children: "Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedTab('resources'),
                                    className: `px-4 py-2 text-sm font-medium ${selectedTab === 'resources' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`,
                                    children: "Resources"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedTab('history'),
                                    className: `px-4 py-2 text-sm font-medium ${selectedTab === 'history' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`,
                                    children: "Activity"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedTab('status'),
                                    className: `px-4 py-2 text-sm font-medium ${selectedTab === 'status' ? 'text-green-700 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`,
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 flex-grow overflow-y-auto",
                    children: [
                        selectedTab === 'details' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-700 whitespace-pre-line",
                                        children: task.description
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900",
                                                    children: task.category === 'communityService' ? 'Community Service' : task.category === 'environmentalAction' ? 'Environmental Action' : task.category === 'educationYouthSupport' ? 'Education & Youth Support' : 'Health & Wellness'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 176,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Estimated Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900",
                                                    children: task.estimatedTime < 60 ? `${task.estimatedTime} minutes` : `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60 > 0 ? `${task.estimatedTime % 60}m` : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Location Type"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900",
                                                    children: task.locationType === 'remote' ? 'Remote (do from home)' : task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Address / Location"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900",
                                                    children: formatAddress()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Date Added"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-900",
                                                    children: formatDate(task.createdAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-medium text-gray-500 mb-1",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `font-medium ${isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : task.status === 'paused' ? 'text-yellow-600' : task.status === 'scheduled' ? 'text-purple-600' : 'text-gray-600'}`,
                                                    children: isCompleted ? 'Completed' : isInProgress ? 'In Progress' : task.status === 'paused' ? 'Paused' : task.status === 'scheduled' ? 'Scheduled' : 'Open'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this),
                                task.impact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-500 mb-1",
                                            children: "Impact"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: task.impact
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 232,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 17
                                }, this),
                                task.requirements && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium text-gray-500 mb-1",
                                            children: "Requirements"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 238,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: task.requirements
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this),
                        selectedTab === 'resources' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 mb-4",
                                    children: "Helpful Resources"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                resources.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500",
                                    children: "No resources available for this task."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: resources.map((resource, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border rounded-md p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-medium text-gray-900 mb-1",
                                                    children: resource.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this),
                                                resource.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600 text-sm mb-2",
                                                    children: resource.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: resource.url,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-sm text-green-600 hover:underline inline-flex items-center",
                                                    children: [
                                                        "Visit Resource",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "h-4 w-4 ml-1",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                lineNumber: 267,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 266,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 254,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 252,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 246,
                            columnNumber: 13
                        }, this),
                        selectedTab === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 mb-4",
                                    children: "Activity History"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this),
                                task.pauseData && task.pauseData.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: task.pauseData.map((pause, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-l-4 border-yellow-400 pl-4 py-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-gray-900",
                                                                    children: "Task Paused"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                    lineNumber: 287,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: [
                                                                        formatDate(pause.pauseTime),
                                                                        " at ",
                                                                        formatTime(pause.pauseTime)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                    lineNumber: 288,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 25
                                                        }, this),
                                                        pause.resumeTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-right",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-green-600",
                                                                    children: "Resumed"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                    lineNumber: 294,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: [
                                                                        formatDate(pause.resumeTime),
                                                                        " at ",
                                                                        formatTime(pause.resumeTime)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                    lineNumber: 295,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 293,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-gray-700",
                                                            children: [
                                                                "Reason: ",
                                                                pause.reason
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600 mt-1",
                                                            children: pause.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 284,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 282,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500",
                                    children: "No activity recorded for this task yet."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 309,
                                    columnNumber: 17
                                }, this),
                                isCompleted && task.completionDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 border-l-4 border-green-400 pl-4 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-gray-900",
                                            children: "Task Completed"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 314,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600",
                                            children: [
                                                formatDate(task.completionDate),
                                                " at ",
                                                formatTime(task.completionDate)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 315,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 313,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this),
                        selectedTab === 'status' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-medium text-gray-900 mb-4",
                                    children: "Task Status"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 325,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 p-4 rounded-lg mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-3 h-3 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : isInProgress ? 'bg-blue-500' : task.status === 'paused' ? 'bg-yellow-500' : task.status === 'scheduled' ? 'bg-purple-500' : 'bg-gray-500'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-medium",
                                                    children: "Current Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `ml-2 ${isCompleted ? 'text-green-600' : isInProgress ? 'text-blue-600' : task.status === 'paused' ? 'text-yellow-600' : task.status === 'scheduled' ? 'text-purple-600' : 'text-gray-600'}`,
                                                    children: isCompleted ? 'Completed' : isInProgress ? 'In Progress' : task.status === 'paused' ? 'Paused' : task.status === 'scheduled' ? 'Scheduled' : 'Open'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this),
                                        task.scheduledTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-5 text-sm text-gray-600",
                                            children: [
                                                "Scheduled for: ",
                                                formatDate(task.scheduledTime),
                                                " at ",
                                                formatTime(task.scheduledTime)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 350,
                                            columnNumber: 19
                                        }, this),
                                        task.timeSpent !== undefined && task.timeSpent > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-5 text-sm text-gray-600",
                                            children: [
                                                "Time spent: ",
                                                formatTimeSpent(task.timeSpent)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 356,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 p-4 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium mb-2",
                                            children: "Task Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3 h-3 rounded-full mr-2 ${task.createdAt ? 'bg-green-500' : 'bg-gray-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 366,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: "Created"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 21
                                                        }, this),
                                                        task.createdAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 ml-2",
                                                            children: formatDate(task.createdAt)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 369,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3 h-3 rounded-full mr-2 ${task.scheduledTime ? 'bg-green-500' : 'bg-gray-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 376,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: "Scheduled"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 21
                                                        }, this),
                                                        task.scheduledTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 ml-2",
                                                            children: formatDate(task.scheduledTime)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 379,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3 h-3 rounded-full mr-2 ${task.status === 'in-progress' || task.status === 'paused' || isCompleted ? 'bg-green-500' : 'bg-gray-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: "Started"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-3 h-3 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: "Completed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 21
                                                        }, this),
                                                        isCompleted && task.completionDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 ml-2",
                                                            children: formatDate(task.completionDate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 324,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-t flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: task.isCustom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1",
                                children: "Custom Task"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                lineNumber: 408,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 406,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "px-4 py-2 border rounded text-gray-700 hover:bg-gray-50",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: onStartTask,
                                            className: `px-4 py-2 ${isInProgress ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded`,
                                            children: isInProgress ? 'View Progress' : 'Start Task'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 424,
                                            columnNumber: 17
                                        }, this),
                                        !isInProgress && !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onMouseEnter: ()=>setShowCalendarOptions(true),
                                                    onMouseLeave: ()=>setShowCalendarOptions(false),
                                                    className: "absolute -top-10 right-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded",
                                                    children: "Schedule Task"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 21
                                                }, this),
                                                showCalendarOptions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-10 right-full mr-1 bg-white shadow-lg rounded-md overflow-hidden z-10",
                                                    onMouseEnter: ()=>setShowCalendarOptions(true),
                                                    onMouseLeave: ()=>setShowCalendarOptions(false),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCalendarExport('Google'),
                                                                className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap",
                                                                children: "Google Calendar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                lineNumber: 453,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCalendarExport('Outlook'),
                                                                className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap",
                                                                children: "Outlook"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCalendarExport('iCal'),
                                                                className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap",
                                                                children: "iCal"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCalendarExport('Office365'),
                                                                className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left whitespace-nowrap",
                                                                children: "Office365"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                        lineNumber: 452,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                            lineNumber: 437,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                                    lineNumber: 423,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                            lineNumber: 414,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
                    lineNumber: 405,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/TaskDetailModal.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
};
_s(TaskDetailModal, "EFhlYlY0Z6JbP6N3YO46zFiAP/M=");
_c = TaskDetailModal;
const __TURBOPACK__default__export__ = TaskDetailModal;
var _c;
__turbopack_context__.k.register(_c, "TaskDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/AnimatedTimer.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/AnimatedTimer.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const AnimatedTimer = ({ totalSeconds, elapsedSeconds, isRunning, size = 48, showLabels = false })=>{
    _s();
    const [currentElapsed, setCurrentElapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(elapsedSeconds);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    // Update elapsed time and current time every second when running
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedTimer.useEffect": ()=>{
            if (isRunning) {
                const interval = setInterval({
                    "AnimatedTimer.useEffect.interval": ()=>{
                        setCurrentElapsed({
                            "AnimatedTimer.useEffect.interval": (prev)=>prev + 1
                        }["AnimatedTimer.useEffect.interval"]);
                        setCurrentTime(new Date());
                    }
                }["AnimatedTimer.useEffect.interval"], 1000);
                return ({
                    "AnimatedTimer.useEffect": ()=>clearInterval(interval)
                })["AnimatedTimer.useEffect"];
            }
        }
    }["AnimatedTimer.useEffect"], [
        isRunning
    ]);
    // Reset when elapsedSeconds prop changes (for paused tasks)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedTimer.useEffect": ()=>{
            setCurrentElapsed(elapsedSeconds);
        }
    }["AnimatedTimer.useEffect"], [
        elapsedSeconds
    ]);
    // Calculate progress and remaining time
    const progress = Math.min(currentElapsed / totalSeconds, 1);
    const remainingSeconds = Math.max(totalSeconds - currentElapsed, 0);
    // Calculate hand positions for real clock movement
    const secondsInCurrentMinute = currentTime.getSeconds();
    const minutesInCurrentHour = currentTime.getMinutes() + secondsInCurrentMinute / 60;
    const hoursIn12Format = currentTime.getHours() % 12 + minutesInCurrentHour / 60;
    // Calculate angles for hands (360 degrees = full rotation)
    const secondAngle = secondsInCurrentMinute / 60 * 360;
    const minuteAngle = minutesInCurrentHour / 60 * 360;
    const hourAngle = hoursIn12Format / 12 * 360;
    // Task progress angle (for the progress indicator)
    const progressAngle = progress * 360;
    // Get estimated completion time
    const getEstimatedCompletion = ()=>{
        if (!isRunning || remainingSeconds <= 0) return null;
        const now = new Date();
        const completionTime = new Date(now.getTime() + remainingSeconds * 1000);
        return completionTime;
    };
    // Format time display
    const formatTime = (seconds)=>{
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };
    const estimatedCompletion = getEstimatedCompletion();
    const center = size / 2;
    const radius = (size - 4) / 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: size,
                        height: size,
                        className: "transform -rotate-90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: center,
                                cy: center,
                                r: radius,
                                fill: "white",
                                stroke: "#E5E7EB",
                                strokeWidth: "2"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: center,
                                cy: center,
                                r: radius - 3,
                                fill: "none",
                                stroke: isRunning ? "#10B981" : progress >= 1 ? "#EF4444" : "#6B7280",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeDasharray: `${2 * Math.PI * (radius - 3)}`,
                                strokeDashoffset: `${2 * Math.PI * (radius - 3) * (1 - progress)}`,
                                className: "transition-all duration-1000 ease-linear"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            [
                                ...Array(12)
                            ].map((_, i)=>{
                                const angle = i * 30 * (Math.PI / 180);
                                const x1 = center + (radius - 8) * Math.cos(angle);
                                const y1 = center + (radius - 8) * Math.sin(angle);
                                const x2 = center + (radius - 4) * Math.cos(angle);
                                const y2 = center + (radius - 4) * Math.sin(angle);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: x1,
                                    y1: y1,
                                    x2: x2,
                                    y2: y2,
                                    stroke: "#9CA3AF",
                                    strokeWidth: i % 3 === 0 ? "2" : "1",
                                    className: "transform rotate-90",
                                    style: {
                                        transformOrigin: `${center}px ${center}px`
                                    }
                                }, i, false, {
                                    fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this);
                            }),
                            [
                                ...Array(60)
                            ].map((_, i)=>{
                                if (i % 5 !== 0) {
                                    const angle = i * 6 * (Math.PI / 180);
                                    const x1 = center + (radius - 6) * Math.cos(angle);
                                    const y1 = center + (radius - 6) * Math.sin(angle);
                                    const x2 = center + (radius - 4) * Math.cos(angle);
                                    const y2 = center + (radius - 4) * Math.sin(angle);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: x1,
                                        y1: y1,
                                        x2: x2,
                                        y2: y2,
                                        stroke: "#D1D5DB",
                                        strokeWidth: "0.5",
                                        className: "transform rotate-90",
                                        style: {
                                            transformOrigin: `${center}px ${center}px`
                                        }
                                    }, `min-${i}`, false, {
                                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this);
                                }
                                return null;
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: center,
                                y1: center,
                                x2: center + radius * 0.5 * Math.cos((hourAngle - 90) * (Math.PI / 180)),
                                y2: center + radius * 0.5 * Math.sin((hourAngle - 90) * (Math.PI / 180)),
                                stroke: "#1F2937",
                                strokeWidth: "3",
                                strokeLinecap: "round",
                                className: isRunning ? "transition-all duration-1000 ease-linear" : "transition-all duration-500"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: center,
                                y1: center,
                                x2: center + radius * 0.75 * Math.cos((minuteAngle - 90) * (Math.PI / 180)),
                                y2: center + radius * 0.75 * Math.sin((minuteAngle - 90) * (Math.PI / 180)),
                                stroke: "#374151",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                className: isRunning ? "transition-all duration-1000 ease-linear" : "transition-all duration-500"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: center,
                                y1: center,
                                x2: center + radius * 0.9 * Math.cos((secondAngle - 90) * (Math.PI / 180)),
                                y2: center + radius * 0.9 * Math.sin((secondAngle - 90) * (Math.PI / 180)),
                                stroke: "#EF4444",
                                strokeWidth: "1",
                                strokeLinecap: "round",
                                className: "transition-all duration-75 ease-linear"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: center,
                                cy: center,
                                r: "3",
                                fill: "#1F2937"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: center,
                                cy: center,
                                r: "1.5",
                                fill: "#10B981",
                                className: "animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -top-1 -right-1 w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : progress >= 1 ? 'bg-red-500' : 'bg-gray-400'}`
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            showLabels && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs font-medium text-gray-700",
                        children: [
                            formatTime(currentElapsed),
                            " / ",
                            formatTime(totalSeconds)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this),
                    remainingSeconds > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500",
                        children: [
                            formatTime(remainingSeconds),
                            " remaining"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this),
                    estimatedCompletion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-blue-600",
                        children: [
                            "Est. done: ",
                            estimatedCompletion.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                        lineNumber: 241,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/AnimatedTimer.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
};
_s(AnimatedTimer, "bUzM3CO+GXattehmXReLErl7gNY=");
_c = AnimatedTimer;
const __TURBOPACK__default__export__ = AnimatedTimer;
var _c;
__turbopack_context__.k.register(_c, "AnimatedTimer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/TaskTimeDisplay.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/TaskTimeDisplay.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$AnimatedTimer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/AnimatedTimer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const TaskTimeDisplay = ({ task, isActive = false, size = 'medium', showLiveUpdates = true })=>{
    _s();
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [liveElapsed, setLiveElapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Update current time every second for live updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskTimeDisplay.useEffect": ()=>{
            if (showLiveUpdates) {
                const interval = setInterval({
                    "TaskTimeDisplay.useEffect.interval": ()=>{
                        setCurrentTime(new Date());
                    }
                }["TaskTimeDisplay.useEffect.interval"], 1000);
                return ({
                    "TaskTimeDisplay.useEffect": ()=>clearInterval(interval)
                })["TaskTimeDisplay.useEffect"];
            }
        }
    }["TaskTimeDisplay.useEffect"], [
        showLiveUpdates
    ]);
    // Calculate elapsed time including live updates
    const getElapsedSeconds = ()=>{
        let totalElapsed = task.timeSpent || 0;
        // If task is currently active, add time since start
        if (isActive && task.startTime && showLiveUpdates) {
            const startTime = task.startTime.toDate ? task.startTime.toDate() : new Date(task.startTime);
            const currentElapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
            totalElapsed += Math.max(currentElapsed, 0);
        }
        return totalElapsed;
    };
    // Get total estimated time in seconds
    const getTotalSeconds = ()=>{
        return (task.estimatedTime || 60) * 60; // Convert minutes to seconds
    };
    // Calculate remaining time
    const getRemainingSeconds = ()=>{
        const elapsed = getElapsedSeconds();
        const total = getTotalSeconds();
        return Math.max(total - elapsed, 0);
    };
    // Get estimated completion time
    const getEstimatedCompletion = ()=>{
        if (!isActive) return null;
        const remaining = getRemainingSeconds();
        if (remaining <= 0) return null;
        const completionTime = new Date(currentTime.getTime() + remaining * 1000);
        return completionTime;
    };
    // Format time for display with live seconds
    const formatTime = (seconds, showSeconds = true)=>{
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return showSeconds ? `${hours}h ${minutes}m ${secs}s` : `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return showSeconds ? `${minutes}m ${secs}s` : `${minutes}m`;
        } else {
            return `${secs}s`;
        }
    };
    // Get progress percentage
    const getProgress = ()=>{
        const elapsed = getElapsedSeconds();
        const total = getTotalSeconds();
        return Math.min(elapsed / total * 100, 100);
    };
    const elapsedSeconds = getElapsedSeconds();
    const totalSeconds = getTotalSeconds();
    const remainingSeconds = getRemainingSeconds();
    const estimatedCompletion = getEstimatedCompletion();
    const progress = getProgress();
    // Determine sizes and display options
    const sizeConfig = {
        small: {
            timer: 32,
            showLabels: false,
            showSeconds: false
        },
        medium: {
            timer: 48,
            showLabels: true,
            showSeconds: true
        },
        large: {
            timer: 64,
            showLabels: true,
            showSeconds: true
        }
    };
    const config = sizeConfig[size];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$AnimatedTimer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                totalSeconds: totalSeconds,
                elapsedSeconds: elapsedSeconds,
                isRunning: isActive,
                size: config.timer,
                showLabels: false
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                lineNumber: 112,
                columnNumber: 13
            }, this),
            config.showLabels && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center space-y-1",
                children: [
                    isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-green-50 px-3 py-1 rounded-full border border-green-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                    lineNumber: 127,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-mono font-bold text-green-800",
                                    children: formatTime(elapsedSeconds, config.showSeconds)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                    lineNumber: 128,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 126,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 125,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-gray-200 rounded-full h-1.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-1.5 rounded-full transition-all duration-1000 ${isActive ? 'bg-green-500' : progress >= 100 ? 'bg-red-500' : 'bg-blue-500'}`,
                            style: {
                                width: `${Math.min(progress, 100)}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 137,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 136,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600",
                                children: [
                                    "Elapsed: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium font-mono",
                                        children: formatTime(elapsedSeconds, false)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                        lineNumber: 148,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                lineNumber: 147,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600",
                                children: [
                                    "Total: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: formatTime(totalSeconds, false)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                        lineNumber: 151,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                                lineNumber: 150,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 146,
                        columnNumber: 21
                    }, this),
                    remainingSeconds > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-sm font-medium ${isActive ? 'text-orange-600 font-mono' : 'text-orange-600'}`,
                            children: [
                                formatTime(remainingSeconds, isActive),
                                " remaining"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 158,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 157,
                        columnNumber: 25
                    }, this),
                    estimatedCompletion && isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center bg-blue-50 px-2 py-1 rounded",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-blue-600 font-medium",
                            children: [
                                "Est. completion: ",
                                estimatedCompletion.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 167,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 166,
                        columnNumber: 25
                    }, this),
                    progress > 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center bg-red-50 px-2 py-1 rounded border border-red-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-red-600 font-medium",
                            children: [
                                "⚠️ ",
                                formatTime(elapsedSeconds - totalSeconds, config.showSeconds),
                                " overtime"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 180,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 179,
                        columnNumber: 25
                    }, this),
                    isActive && elapsedSeconds > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-gray-500",
                            children: progress < 50 ? '🚀 On track' : progress < 80 ? '⏰ Good pace' : progress < 100 ? '⚡ Final stretch' : '🔥 Overtime'
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                            lineNumber: 189,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                        lineNumber: 188,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
                lineNumber: 122,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/TaskTimeDisplay.tsx",
        lineNumber: 110,
        columnNumber: 9
    }, this);
};
_s(TaskTimeDisplay, "oh4m6RpnObqKfH3AgBgWy4eyHtw=");
_c = TaskTimeDisplay;
const __TURBOPACK__default__export__ = TaskTimeDisplay;
var _c;
__turbopack_context__.k.register(_c, "TaskTimeDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/TaskCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/TaskCard.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskResources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/tasks/taskResources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TaskDetailModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskTimeDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TaskTimeDisplay.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const TaskCard = ({ task, isCompleted, onComplete, userId, isDisabled = false, onTaskStart, onTaskPause, activeTaskId })=>{
    _s();
    const [showDetailModal, setShowDetailModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFullDescription, setShowFullDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeRemaining, setTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const resources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$tasks$2f$taskResources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateTaskResources"])(task);
    // Check if this task is currently active (timer running)
    const isActiveTask = activeTaskId === task.id;
    // Check if description is too long
    const isDescriptionLong = task.description.length > 120;
    const truncatedDescription = isDescriptionLong ? `${task.description.substring(0, 120)}...` : task.description;
    // Check if task is in progress
    const isInProgress = task.status === 'in-progress' || task.status === 'paused';
    // Check if task has any time tracking data
    const hasTimeData = task.timeSpent && task.timeSpent > 0 || task.status === 'in-progress' || task.status === 'paused';
    // Get time since scheduled (if applicable)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskCard.useEffect": ()=>{
            if (task.scheduledTime) {
                const scheduledTime = task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime);
                const now = new Date();
                // If scheduled time is in the future, show countdown
                if (scheduledTime > now) {
                    const interval = setInterval({
                        "TaskCard.useEffect.interval": ()=>{
                            const timeDiff = scheduledTime.getTime() - new Date().getTime();
                            setTimeRemaining(timeDiff > 0 ? timeDiff : 0);
                        }
                    }["TaskCard.useEffect.interval"], 1000);
                    return ({
                        "TaskCard.useEffect": ()=>clearInterval(interval)
                    })["TaskCard.useEffect"];
                }
            }
        }
    }["TaskCard.useEffect"], [
        task.scheduledTime
    ]);
    // Get category color
    const getCategoryColor = (category)=>{
        switch(category){
            case 'communityService':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'environmentalAction':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'educationYouthSupport':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'healthWellness':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    // Format time remaining for scheduled tasks
    const formatTimeRemaining = ()=>{
        if (timeRemaining === null) return '';
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor(timeRemaining % (1000 * 60 * 60) / (1000 * 60));
        const seconds = Math.floor(timeRemaining % (1000 * 60) / 1000);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };
    // Handle button click based on task state
    const handleButtonClick = ()=>{
        if (isCompleted) return;
        if (isActiveTask) {
            // Task is currently active, pause it
            onTaskPause?.(task.id);
        } else if (isInProgress) {
            // Task is in progress but not active, view progress
            onComplete(task);
        } else {
            // Task is not started, show start task modal
            onComplete(task);
        }
    };
    // Get button text and style based on task state
    const getButtonInfo = ()=>{
        if (isCompleted) {
            return {
                text: 'Task Completed',
                className: 'bg-green-100 text-green-800 cursor-default',
                disabled: true
            };
        }
        if (isActiveTask) {
            return {
                text: 'Pause Timer',
                className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                disabled: false
            };
        }
        if (isInProgress) {
            return {
                text: 'View Progress',
                className: 'bg-blue-600 hover:bg-blue-700 text-white',
                disabled: false
            };
        }
        // Check if task is scheduled and show countdown
        if (task.scheduledTime && task.status === 'scheduled') {
            const scheduledTime = task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime);
            const now = new Date();
            const timeDiff = scheduledTime.getTime() - now.getTime();
            if (timeDiff > 0) {
                // Task is scheduled for the future
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));
                if (hours > 0) {
                    return {
                        text: `Starts in ${hours}h ${minutes}m`,
                        className: 'bg-purple-100 text-purple-800 cursor-default',
                        disabled: true
                    };
                } else if (minutes > 0) {
                    return {
                        text: `Starts in ${minutes}m`,
                        className: 'bg-purple-100 text-purple-800 cursor-default',
                        disabled: true
                    };
                } else {
                    return {
                        text: 'Ready to Start',
                        className: 'bg-green-600 hover:bg-green-700 text-white animate-pulse',
                        disabled: false
                    };
                }
            }
        }
        return {
            text: 'Start Task',
            className: 'bg-green-600 hover:bg-green-700 text-white',
            disabled: false
        };
    };
    const buttonInfo = getButtonInfo();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `border rounded-lg overflow-hidden relative ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`,
        children: [
            isActiveTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 left-2 bg-yellow-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center animate-pulse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-2 h-2 bg-white rounded-full mr-1 animate-ping"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    "Timer Active"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowDetailModal(true),
                className: "absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white",
                title: "View details",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    className: "h-5 w-5 text-gray-500",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            task.scheduledTime && timeRemaining !== null && !isActiveTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-3 w-3 mr-1 text-purple-600",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: formatTimeRemaining()
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 213,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `py-1 px-3 text-sm font-medium ${getCategoryColor(task.category)}`,
                children: task.category === 'communityService' ? 'Community Service' : task.category === 'environmentalAction' ? 'Environmental Action' : task.category === 'educationYouthSupport' ? 'Education & Youth' : 'Health & Wellness'
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-2 pr-6",
                        children: task.title
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            showFullDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 text-sm",
                                children: task.description
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 text-sm",
                                children: truncatedDescription
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            isDescriptionLong && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowFullDescription(!showFullDescription),
                                className: "text-xs text-green-600 mt-1 hover:underline",
                                children: showFullDescription ? 'View Less' : 'View More'
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    hasTimeData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskTimeDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            task: task,
                            isActive: isActiveTask,
                            size: "medium"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-3 w-3 mr-1",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    task.estimatedTime < 60 ? `${task.estimatedTime} minutes` : `${Math.floor(task.estimatedTime / 60)}h ${task.estimatedTime % 60 > 0 ? `${task.estimatedTime % 60}m` : ''}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-3 w-3 mr-1",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this),
                                    task.locationType === 'remote' ? 'Do from home' : task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            task.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-xs rounded-full px-2 py-1 flex items-center ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : task.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : task.status === 'scheduled' ? 'bg-purple-100 text-purple-800' : task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: task.status === 'in-progress' ? 'In Progress' : task.status === 'paused' ? 'Paused' : task.status === 'scheduled' ? 'Scheduled' : task.status === 'completed' ? 'Completed' : 'Open'
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this),
                    resources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-gray-700 mb-1",
                                children: "Helpful Resources:"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 298,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-1",
                                children: [
                                    resources.slice(0, 2).map((resource, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: resource.url,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-xs text-green-600 hover:underline",
                                            children: [
                                                resource.title,
                                                index < Math.min(resources.length, 2) - 1 ? ', ' : ''
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                            lineNumber: 301,
                                            columnNumber: 17
                                        }, this)),
                                    resources.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowDetailModal(true),
                                        className: "text-xs text-green-600 hover:underline",
                                        children: [
                                            "+",
                                            resources.length - 2,
                                            " more"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                        lineNumber: 312,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleButtonClick,
                        disabled: buttonInfo.disabled,
                        className: `w-full py-2 ${buttonInfo.className} rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${!buttonInfo.disabled ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`,
                        children: buttonInfo.text
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            showDetailModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: task,
                resources: resources,
                isCompleted: isCompleted,
                isInProgress: isInProgress,
                onStartTask: ()=>{
                    setShowDetailModal(false);
                    handleButtonClick();
                },
                onClose: ()=>setShowDetailModal(false),
                userId: userId
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TaskCard.tsx",
                lineNumber: 337,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/TaskCard.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
};
_s(TaskCard, "NFFcDuXshp68oBN1H9tXIT0kP1s=");
_c = TaskCard;
const __TURBOPACK__default__export__ = TaskCard;
var _c;
__turbopack_context__.k.register(_c, "TaskCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/PauseReasonModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/PauseReasonModal.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const PauseReasonModal = ({ onSubmit, onResume })=>{
    _s();
    const [selectedReasons, setSelectedReasons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const reasons = [
        'Taking a break',
        'Need to attend to something urgent',
        'Technical issues',
        'Meeting with someone',
        'Waiting for resources/information',
        'Other'
    ];
    const handleReasonToggle = (reason)=>{
        if (selectedReasons.includes(reason)) {
            setSelectedReasons((prev)=>prev.filter((r)=>r !== reason));
        } else {
            setSelectedReasons((prev)=>[
                    ...prev,
                    reason
                ]);
        }
    };
    const handleSubmit = ()=>{
        if (selectedReasons.length === 0 || !description.trim()) return;
        onSubmit(selectedReasons.join(', '), description);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-md w-full p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-semibold mb-4",
                    children: "Why are you pausing this task?"
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-700 mb-2",
                            children: "Select all that apply:"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: reasons.map((reason)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: selectedReasons.includes(reason),
                                            onChange: ()=>handleReasonToggle(reason),
                                            className: "h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 text-sm text-gray-700",
                                            children: reason
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                                            lineNumber: 55,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, reason, true, {
                                    fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 mb-1",
                            children: "Please provide more details:"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: description,
                            onChange: (e)=>setDescription(e.target.value),
                            className: "w-full px-3 py-2 border rounded-md h-32",
                            placeholder: "Add more context about why you're pausing...",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onResume,
                            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                            children: "Resume Instead"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: selectedReasons.length === 0 || !description.trim(),
                            className: `px-4 py-2 ${selectedReasons.length === 0 || !description.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'} rounded-md`,
                            children: "Pause Task"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/PauseReasonModal.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
};
_s(PauseReasonModal, "75/rnOK+AHm1vh4/NoHOEsBBeZs=");
_c = PauseReasonModal;
const __TURBOPACK__default__export__ = PauseReasonModal;
var _c;
__turbopack_context__.k.register(_c, "PauseReasonModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/EnhancedTaskCompletionModal.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$PauseReasonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/PauseReasonModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm2017.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const EnhancedTaskCompletionModal = ({ task, userId, onClose, onComplete, onTaskStart, onTaskPause })=>{
    _s();
    const [showScheduleModal, setShowScheduleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmationModal, setShowConfirmationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPauseReasonModal, setShowPauseReasonModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timerVisible, setTimerVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scheduledDate, setScheduledDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [scheduledTime, setScheduledTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [timeSpent, setTimeSpent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.timeSpent || 0);
    const [timerActive, setTimerActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timerIntervalId, setTimerIntervalId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scheduledDateTime, setScheduledDateTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [calendarType, setCalendarType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadedImages, setUploadedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.images || []);
    const [taskStatus, setTaskStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.completedBy?.includes(userId) ? 'completed' : task.status || 'open');
    const [pauseData, setPauseData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.pauseData || []);
    const [timerWindowExpired, setTimerWindowExpired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [windowTimerId, setWindowTimerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Check if the scheduled time has arrived and if we're within the 10-minute window
    const isTimerEnabled = ()=>{
        if (!scheduledDateTime) return false;
        const now = new Date();
        const timeDiff = now.getTime() - scheduledDateTime.getTime();
        // Enable if scheduled time has passed but not more than 10 minutes ago
        return timeDiff >= 0 && timeDiff <= 10 * 60 * 1000;
    };
    // Check if task is scheduled and we're in the window
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnhancedTaskCompletionModal.useEffect": ()=>{
            if (task.scheduledTime && task.status === 'scheduled') {
                const scheduledTime = task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime);
                setScheduledDateTime(scheduledTime);
                const now = new Date();
                const timeDiff = now.getTime() - scheduledTime.getTime();
                // If scheduled time has already passed and we're still within 10 minutes
                if (timeDiff >= 0 && timeDiff <= 10 * 60 * 1000) {
                    // Set a timer to disable the button after 10 minutes
                    const remainingWindowTime = 10 * 60 * 1000 - timeDiff;
                    const windowTimer = setTimeout({
                        "EnhancedTaskCompletionModal.useEffect.windowTimer": ()=>{
                            setTimerWindowExpired(true);
                        }
                    }["EnhancedTaskCompletionModal.useEffect.windowTimer"], remainingWindowTime);
                    setWindowTimerId(windowTimer);
                } else if (timeDiff > 10 * 60 * 1000) {
                    // Window already expired
                    setTimerWindowExpired(true);
                } else if (timeDiff < 0) {
                    // Scheduled time is in the future
                    const timeUntilScheduled = Math.abs(timeDiff);
                    // Set a timer to enable the button at scheduled time
                    const scheduleTimer = setTimeout({
                        "EnhancedTaskCompletionModal.useEffect.scheduleTimer": ()=>{
                            // Schedule another timer for the 10-minute window
                            const windowTimer = setTimeout({
                                "EnhancedTaskCompletionModal.useEffect.scheduleTimer.windowTimer": ()=>{
                                    setTimerWindowExpired(true);
                                }
                            }["EnhancedTaskCompletionModal.useEffect.scheduleTimer.windowTimer"], 10 * 60 * 1000);
                            setWindowTimerId(windowTimer);
                        }
                    }["EnhancedTaskCompletionModal.useEffect.scheduleTimer"], timeUntilScheduled);
                    // Clean up on unmount
                    return ({
                        "EnhancedTaskCompletionModal.useEffect": ()=>{
                            clearTimeout(scheduleTimer);
                            if (windowTimerId) clearTimeout(windowTimerId);
                        }
                    })["EnhancedTaskCompletionModal.useEffect"];
                }
            }
            return ({
                "EnhancedTaskCompletionModal.useEffect": ()=>{
                    if (windowTimerId) clearTimeout(windowTimerId);
                }
            })["EnhancedTaskCompletionModal.useEffect"];
        }
    }["EnhancedTaskCompletionModal.useEffect"], [
        task.scheduledTime,
        task.status
    ]);
    // Start timer function
    const startTimer = ()=>{
        if (!timerActive) {
            setTimerActive(true);
            setTaskStatus('in-progress');
            onTaskStart(task.id);
            const interval = setInterval(()=>{
                setTimeSpent((prev)=>prev + 1);
            }, 1000);
            setTimerIntervalId(interval);
            // Update task status in Firestore
            updateTaskStatus('in-progress');
        }
    };
    // Stop timer function
    const stopTimer = ()=>{
        if (timerActive && timerIntervalId) {
            clearInterval(timerIntervalId);
            setTimerActive(false);
            setShowPauseReasonModal(true);
            onTaskPause();
        }
    };
    // Update task status in Firestore
    const updateTaskStatus = async (status)=>{
        try {
            if (!task.id) return;
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                status: status,
                timeSpent: timeSpent,
                lastUpdated: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };
    // Complete task now
    const completeTaskNow = async ()=>{
        try {
            if (!task.id) return;
            // Create update data
            const updateData = {
                completedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(userId),
                completionDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                timeSpent: timeSpent,
                status: 'completed',
                images: uploadedImages
            };
            // Update the task in Firestore
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, updateData);
            // Add a seed to the user's account
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                seeds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1),
                completedTasks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1)
            });
            // Call the callback
            onComplete();
            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };
    // Schedule task
    const handleScheduleTask = ()=>{
        setShowScheduleModal(true);
    };
    // Handle submit schedule
    const handleSubmit = ()=>{
        if (!scheduledDate || !scheduledTime) return;
        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        setScheduledDateTime(dateTime);
        setShowScheduleModal(false);
        setShowConfirmationModal(true);
    };
    // Handle image upload
    const handleImageUpload = async (e)=>{
        if (!e.target.files?.length || !task.id) return;
        try {
            const file = e.target.files[0];
            // Create a storage reference
            const storageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"], `task-images/${task.id}/${Date.now()}-${file.name}`);
            // Upload the file
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadBytes"])(storageRef, file);
            // Get the download URL
            const downloadURL = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDownloadURL"])(storageRef);
            // Add to uploaded images array
            setUploadedImages((prev)=>[
                    ...prev,
                    downloadURL
                ]);
            // Update the task in Firestore with the new image
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(downloadURL)
            });
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    // Remove image
    const handleRemoveImage = (index)=>{
        setUploadedImages((prev)=>prev.filter((_, i)=>i !== index));
    // In a full implementation, you would also remove from storage
    // and update the Firestore document
    };
    // Handle calendar selection
    const handleCalendarExport = (type)=>{
        setCalendarType(type);
    // In a real app, you would generate the appropriate calendar file
    };
    // Handle confirmation
    const handleConfirmation = async (addToCalendar)=>{
        setShowConfirmationModal(false);
        if (!scheduledDateTime || !task.id) return;
        try {
            // Update task with scheduled time in Firestore
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                scheduledTime: scheduledDateTime,
                status: 'scheduled'
            });
            setTaskStatus('scheduled');
            // If scheduled time is now or in the past, start timer immediately
            const now = new Date();
            if (scheduledDateTime <= now) {
                setTimerVisible(true);
                startTimer();
            } else {
                // Set a timeout to start the timer at the scheduled time
                const timeUntilStart = scheduledDateTime.getTime() - now.getTime();
                setTimeout(()=>{
                    setTimerVisible(true);
                    startTimer();
                }, timeUntilStart);
            }
            // If user wants to add to calendar, handle that
            if (addToCalendar && calendarType) {
                // In a real app, generate and download the calendar file
                alert(`Adding to ${calendarType} calendar would happen here.`);
            }
        } catch (error) {
            console.error('Error scheduling task:', error);
        }
        // Close the modal
        onClose();
    };
    // Handle pause reason submission
    const handlePauseReasonSubmit = async (reason, description)=>{
        const pauseInfo = {
            pauseTime: new Date(),
            reason,
            description
        };
        const updatedPauseData = [
            ...pauseData,
            pauseInfo
        ];
        setPauseData(updatedPauseData);
        setShowPauseReasonModal(false);
        // Update task with pause information in Firestore
        try {
            if (!task.id) return;
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                pauseData: updatedPauseData,
                status: 'paused',
                timeSpent: timeSpent
            });
            setTaskStatus('paused');
        } catch (error) {
            console.error('Error updating task pause data:', error);
        }
    };
    // Resume timer
    const resumeTimer = async ()=>{
        // Update the last pause entry with resume time
        if (pauseData.length > 0) {
            const updatedPauseData = [
                ...pauseData
            ];
            const lastIndex = updatedPauseData.length - 1;
            updatedPauseData[lastIndex] = {
                ...updatedPauseData[lastIndex],
                resumeTime: new Date()
            };
            setPauseData(updatedPauseData);
            // Update in Firestore
            try {
                if (!task.id) return;
                const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                    pauseData: updatedPauseData,
                    status: 'in-progress'
                });
                setTaskStatus('in-progress');
            } catch (error) {
                console.error('Error updating task resume data:', error);
            }
        }
        // Start timer again
        startTimer();
    };
    // Clean up on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnhancedTaskCompletionModal.useEffect": ()=>{
            return ({
                "EnhancedTaskCompletionModal.useEffect": ()=>{
                    if (timerIntervalId) {
                        clearInterval(timerIntervalId);
                    }
                    if (windowTimerId) {
                        clearTimeout(windowTimerId);
                    }
                }
            })["EnhancedTaskCompletionModal.useEffect"];
        }
    }["EnhancedTaskCompletionModal.useEffect"], [
        timerIntervalId,
        windowTimerId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg shadow-xl max-w-lg w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-4",
                                children: [
                                    taskStatus === 'completed' ? 'Task Completed: ' : 'Complete Task: ',
                                    task.title
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 372,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 px-3 py-2 bg-gray-100 rounded-md",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium text-gray-700",
                                    children: [
                                        "Status: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `font-semibold ${taskStatus === 'completed' ? 'text-green-600' : taskStatus === 'in-progress' ? 'text-blue-600' : taskStatus === 'paused' ? 'text-yellow-600' : taskStatus === 'scheduled' ? 'text-purple-600' : 'text-gray-600'}`,
                                            children: taskStatus === 'completed' ? 'Completed' : taskStatus === 'in-progress' ? 'In Progress' : taskStatus === 'paused' ? 'Paused' : taskStatus === 'scheduled' ? 'Scheduled' : 'Open'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                            lineNumber: 379,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this),
                            taskStatus !== 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-700 mb-6",
                                children: "Ready to complete this volunteer task? You can either:"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 394,
                                columnNumber: 15
                            }, this),
                            taskStatus !== 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-purple-100 rounded-full p-2 mr-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "h-5 w-5 text-purple-600",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 405,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-medium text-gray-900",
                                                                children: "Schedule Task"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-600 text-sm",
                                                                children: "Schedule this task for a specific time. You'll get a reminder when it's time to start."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 402,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleScheduleTask,
                                                className: "mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm",
                                                children: "Schedule Task"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 416,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-blue-100 rounded-full p-2 mr-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "h-5 w-5 text-blue-600",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-medium text-gray-900",
                                                                children: "Start Timer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 432,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-600 text-sm",
                                                                children: "Start a timer to track the time you spend on this task. The timer will help you log your volunteer hours."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 433,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 431,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 425,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setTimerVisible(true);
                                                    startTimer();
                                                    onClose();
                                                },
                                                disabled: taskStatus === 'scheduled' && !isTimerEnabled(),
                                                className: `mt-3 w-full py-2 ${taskStatus === 'scheduled' && !isTimerEnabled() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white rounded-md text-sm`,
                                                children: "Start Timer"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 438,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 424,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-green-100 rounded-full p-2 mr-3",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "h-5 w-5 text-green-600",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M5 13l4 4L19 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-medium text-gray-900",
                                                                children: "Complete Now"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 463,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-gray-600 text-sm",
                                                                children: "Mark this task as completed right now. Use this option if you've already finished the task."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                                lineNumber: 464,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                        lineNumber: 462,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 456,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: completeTaskNow,
                                                className: "mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm",
                                                children: "Complete Now"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 469,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 455,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 400,
                                columnNumber: 15
                            }, this),
                            taskStatus === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 rounded-lg p-6 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-100 rounded-full p-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-8 w-8 text-green-600",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M5 13l4 4L19 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 483,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                            lineNumber: 482,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 481,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-medium text-green-800 mb-2",
                                        children: "Task Already Completed!"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 488,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-green-700",
                                        children: "You've already completed this task successfully."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 489,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 496,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 495,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 371,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this),
            showScheduleModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg max-w-md w-full p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "Schedule Task"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 511,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Date"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 514,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    value: scheduledDate,
                                    onChange: (e)=>setScheduledDate(e.target.value),
                                    className: "w-full px-3 py-2 border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 517,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 513,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Time"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 526,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "time",
                                    value: scheduledTime,
                                    onChange: (e)=>setScheduledTime(e.target.value),
                                    className: "w-full px-3 py-2 border rounded-md"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 529,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 525,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowScheduleModal(false),
                                    className: "px-4 py-2 border rounded-md text-gray-700",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 538,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSubmit,
                                    disabled: !scheduledDate || !scheduledTime,
                                    className: `px-4 py-2 ${!scheduledDate || !scheduledTime ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-md`,
                                    children: "Schedule"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 544,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 537,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                    lineNumber: 510,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                lineNumber: 509,
                columnNumber: 9
            }, this),
            showConfirmationModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg max-w-md w-full p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: "Task Scheduled!"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 560,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-700 mb-6",
                            children: [
                                "Your task has been scheduled for ",
                                scheduledDateTime?.toLocaleDateString(),
                                " at ",
                                scheduledDateTime?.toLocaleTimeString(),
                                ". Would you like to add it to your calendar?"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 562,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-3 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCalendarExport('Google'),
                                    className: "p-3 border rounded-md hover:bg-gray-50 text-center",
                                    children: "Google Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 568,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCalendarExport('Outlook'),
                                    className: "p-3 border rounded-md hover:bg-gray-50 text-center",
                                    children: "Outlook"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 574,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCalendarExport('iCal'),
                                    className: "p-3 border rounded-md hover:bg-gray-50 text-center",
                                    children: "Apple Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 580,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleCalendarExport('Other'),
                                    className: "p-3 border rounded-md hover:bg-gray-50 text-center",
                                    children: "Other"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 586,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 567,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleConfirmation(false),
                                    className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50",
                                    children: "Skip"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 595,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleConfirmation(true),
                                    className: "flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                                    children: "Add to Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 602,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 594,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mt-4 text-center",
                            children: "You'll receive a notification when it's time to start your task. You'll have 10 minutes to start the timer once the scheduled time arrives."
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 610,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                    lineNumber: 559,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                lineNumber: 558,
                columnNumber: 9
            }, this),
            showPauseReasonModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$PauseReasonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSubmit: handlePauseReasonSubmit,
                onResume: resumeTimer
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                lineNumber: 620,
                columnNumber: 9
            }, this),
            timerVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 z-[70] flex items-center space-x-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-12 h-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "48",
                            height: "48",
                            viewBox: "0 0 48 48",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "24",
                                    cy: "24",
                                    r: "22",
                                    fill: "white",
                                    stroke: "#10B981",
                                    strokeWidth: "2"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 633,
                                    columnNumber: 15
                                }, this),
                                [
                                    ...Array(12)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "24",
                                        y1: "4",
                                        x2: "24",
                                        y2: "8",
                                        stroke: "#10B981",
                                        strokeWidth: "1.5",
                                        transform: `rotate(${i * 30} 24 24)`
                                    }, i, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 637,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "24",
                                    y1: "24",
                                    x2: "24",
                                    y2: "12",
                                    stroke: "#065F46",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    transform: `rotate(${timeSpent / 43200 * 360} 24 24)`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 650,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "24",
                                    y1: "24",
                                    x2: "24",
                                    y2: "8",
                                    stroke: "#059669",
                                    strokeWidth: "1.5",
                                    strokeLinecap: "round",
                                    transform: `rotate(${timeSpent / 3600 * 360} 24 24)`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 662,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "24",
                                    y1: "26",
                                    x2: "24",
                                    y2: "7",
                                    stroke: "#EF4444",
                                    strokeWidth: "1",
                                    strokeLinecap: "round",
                                    transform: `rotate(${timeSpent % 60 * 6} 24 24)`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 674,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "24",
                                    cy: "24",
                                    r: "1.5",
                                    fill: "#065F46"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 686,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 631,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 629,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-medium text-gray-700",
                                children: task.title
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 691,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-bold text-green-800",
                                children: [
                                    Math.floor(timeSpent / 3600),
                                    "h ",
                                    Math.floor(timeSpent % 3600 / 60),
                                    "m ",
                                    timeSpent % 60,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 692,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>fileInputRef.current?.click(),
                                        className: `text-xs ${timerActive ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`,
                                        disabled: !timerActive,
                                        children: "Upload Image"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 698,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        ref: fileInputRef,
                                        onChange: handleImageUpload,
                                        accept: "image/*",
                                        multiple: true,
                                        className: "hidden",
                                        disabled: !timerActive
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 705,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 697,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 690,
                        columnNumber: 11
                    }, this),
                    uploadedImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-1 overflow-x-auto max-w-xs",
                        children: uploadedImages.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: img,
                                        alt: `Upload ${index + 1}`,
                                        className: "h-10 w-10 object-cover rounded-md"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 722,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleRemoveImage(index),
                                        className: "absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm",
                                        title: "Remove image",
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
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                                lineNumber: 733,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                            lineNumber: 732,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                        lineNumber: 727,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 721,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 719,
                        columnNumber: 13
                    }, this),
                    timerActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: stopTimer,
                        className: "ml-2 p-2 bg-yellow-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-yellow-600",
                        title: "Pause Timer",
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
                                d: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 748,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 747,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 742,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: resumeTimer,
                        className: "ml-2 p-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-600",
                        title: "Resume Timer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-4 w-4",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 758,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                    lineNumber: 759,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 757,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 752,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: completeTaskNow,
                        className: "ml-2 p-2 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-green-700",
                        title: "Complete Task",
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
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                                lineNumber: 769,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                            lineNumber: 768,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                        lineNumber: 763,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx",
                lineNumber: 628,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
};
_s(EnhancedTaskCompletionModal, "2OWaSYsM+qHlE+U8eJlf5oRTPgE=");
_c = EnhancedTaskCompletionModal;
const __TURBOPACK__default__export__ = EnhancedTaskCompletionModal;
var _c;
__turbopack_context__.k.register(_c, "EnhancedTaskCompletionModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/ProgressRecordingModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/ProgressRecordingModal.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ProgressRecordingModal = ({ task, userId, onClose, onSubmit })=>{
    _s();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [images, setImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleImageUpload = async (e)=>{
        if (!e.target.files?.length) return;
        // Check if adding these would exceed the limit
        if (images.length + e.target.files.length > 5) {
            setError(`You can upload a maximum of 5 images. You currently have ${images.length}.`);
            return;
        }
        setUploading(true);
        setError('');
        try {
            const newImages = [];
            // Upload each image
            for(let i = 0; i < e.target.files.length; i++){
                const file = e.target.files[i];
                // Create a reference to storage
                const storageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storage"], `task-progress/${task.id}/${userId}/${Date.now()}-${file.name}`);
                // Upload the file
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadBytes"])(storageRef, file);
                // Get the download URL
                const downloadURL = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDownloadURL"])(storageRef);
                newImages.push(downloadURL);
            }
            // Add new images to state
            setImages((prev)=>[
                    ...prev,
                    ...newImages
                ]);
        } catch (err) {
            console.error('Error uploading images:', err);
            setError(err.message || 'Failed to upload images');
        } finally{
            setUploading(false);
        }
    };
    const handleRemoveImage = (index)=>{
        setImages((prev)=>prev.filter((_, i)=>i !== index));
    };
    const handleSubmit = async ()=>{
        // Validate form
        if (!title.trim()) {
            setError('Please provide a title for this progress entry');
            return;
        }
        if (!description.trim()) {
            setError('Please provide a description of your progress');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Create progress entry
            const progressEntry = {
                timestamp: new Date(),
                title: title.trim(),
                description: description.trim(),
                images
            };
            // Update task with progress entry and change status to paused
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                progressEntries: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(progressEntry),
                status: 'paused',
                lastProgressUpdate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            // Call submit callback
            onSubmit();
            // Close modal
            onClose();
        } catch (err) {
            console.error('Error recording progress:', err);
            setError(err.message || 'Failed to record progress');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-gray-900",
                                        children: "Record Your Progress"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mt-1",
                                        children: task.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-gray-400 hover:text-gray-500",
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
                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                        lineNumber: 146,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-3 bg-red-100 text-red-700 rounded-md",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                            lineNumber: 154,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Progress Title*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 161,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: title,
                                            onChange: (e)=>setTitle(e.target.value),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            placeholder: "e.g., Completed first phase of cleanup",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "What did you accomplish?*"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: description,
                                            onChange: (e)=>setDescription(e.target.value),
                                            className: "w-full px-3 py-2 border rounded-md h-32",
                                            placeholder: "Describe what you've done so far and any important details...",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Progress Photos (Max 5)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 188,
                                            columnNumber: 15
                                        }, this),
                                        images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                                                children: images.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: img,
                                                                alt: `Progress photo ${index + 1}`,
                                                                className: "w-full h-24 object-cover rounded-md"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleRemoveImage(index),
                                                                className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600",
                                                                title: "Remove image",
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
                                                                        d: "M6 18L18 6M6 6l12 12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                                        lineNumber: 209,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                                    lineNumber: 208,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                                lineNumber: 203,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>fileInputRef.current?.click(),
                                            className: "w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-50",
                                            disabled: uploading || images.length >= 5,
                                            children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-gray-600 rounded-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Uploading..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-5 w-5 mr-2",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 21
                                                    }, this),
                                                    images.length >= 5 ? 'Maximum images reached' : 'Add photos of your progress'
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            ref: fileInputRef,
                                            onChange: handleImageUpload,
                                            accept: "image/*",
                                            multiple: true,
                                            className: "hidden",
                                            disabled: uploading || images.length >= 5
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-1",
                                            children: [
                                                images.length,
                                                "/5 images uploaded. Supported formats: JPG, PNG"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-t bg-gray-50 flex justify-end space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50",
                            disabled: loading,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: loading || !title.trim() || !description.trim(),
                            className: `px-6 py-2 ${loading || !title.trim() || !description.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md flex items-center`,
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this),
                                    "Recording..."
                                ]
                            }, void 0, true) : 'Record Progress'
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
                    lineNumber: 255,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
            lineNumber: 134,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/ProgressRecordingModal.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
};
_s(ProgressRecordingModal, "svxj0Nb9UMPbYLBkeBtezc1rj/k=");
_c = ProgressRecordingModal;
const __TURBOPACK__default__export__ = ProgressRecordingModal;
var _c;
__turbopack_context__.k.register(_c, "ProgressRecordingModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/TaskStartModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/TaskStartModal.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const TaskStartModal = ({ task, onClose, onStartTimer, onScheduled })=>{
    _s();
    const [showScheduleForm, setShowScheduleForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scheduledDate, setScheduledDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [scheduledTime, setScheduledTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Get minimum date (today)
    const getMinDate = ()=>{
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    // Get minimum time if date is today
    const getMinTime = ()=>{
        if (scheduledDate === getMinDate()) {
            const now = new Date();
            return now.toTimeString().slice(0, 5);
        }
        return '';
    };
    const handleStartNow = ()=>{
        onStartTimer(task.id);
        onClose();
    };
    const handleScheduleSubmit = async ()=>{
        if (!scheduledDate || !scheduledTime) {
            setError('Please select both date and time');
            return;
        }
        // Check if scheduled time is in the future
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();
        if (scheduledDateTime <= now) {
            setError('Please select a future date and time');
            return;
        }
        try {
            setLoading(true);
            setError('');
            // Update task with scheduled time
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                scheduledTime: scheduledDateTime,
                status: 'scheduled',
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            onScheduled();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to schedule task');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-md w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-gray-900",
                                        children: "Start Task"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mt-1",
                                        children: task.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-gray-400 hover:text-gray-500",
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
                                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this),
                        !showScheduleForm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-700 mb-6",
                                    children: "How would you like to start this volunteering task?"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: handleStartNow,
                                    className: "border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-green-100 rounded-full p-2 mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-6 w-6 text-green-600",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-gray-900",
                                                    children: "Start Timer Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 ml-11",
                                            children: "Begin working on this task immediately. The timer will start and you can track your progress."
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 130,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setShowScheduleForm(true),
                                    className: "border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-purple-100 rounded-full p-2 mr-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-6 w-6 text-purple-600",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-semibold text-gray-900",
                                                    children: "Schedule for Later"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 ml-11",
                                            children: "Set a specific date and time to start this task. You'll see a countdown until it begins."
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowScheduleForm(false),
                                            className: "text-gray-500 hover:text-gray-700 mr-3",
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
                                                    d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold",
                                            children: "Schedule Task"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Date"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: scheduledDate,
                                            onChange: (e)=>setScheduledDate(e.target.value),
                                            min: getMinDate(),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 mb-1",
                                            children: "Time"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "time",
                                            value: scheduledTime,
                                            onChange: (e)=>setScheduledTime(e.target.value),
                                            min: getMinTime(),
                                            className: "w-full px-3 py-2 border rounded-md",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this),
                                scheduledDate && scheduledTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-purple-50 p-3 rounded-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-purple-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Scheduled for:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 197,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-purple-600 mt-1",
                                            children: "You'll see a countdown timer and can start when the time arrives."
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowScheduleForm(false),
                                            className: "flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50",
                                            disabled: loading,
                                            children: "Back"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleScheduleSubmit,
                                            disabled: loading || !scheduledDate || !scheduledTime,
                                            className: `flex-1 px-4 py-2 ${loading || !scheduledDate || !scheduledTime ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md`,
                                            children: loading ? 'Scheduling...' : 'Schedule Task'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                            lineNumber: 214,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                            lineNumber: 154,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/TaskStartModal.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
};
_s(TaskStartModal, "8LiohrT66hY+tk/bmUOEhIVjPVc=");
_c = TaskStartModal;
const __TURBOPACK__default__export__ = TaskStartModal;
var _c;
__turbopack_context__.k.register(_c, "TaskStartModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/PauseConfirmationModal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/PauseConfirmationModal.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const PauseConfirmationModal = ({ task, onConfirm, onCancel })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-md w-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-yellow-100 rounded-full p-3 mr-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-6 w-6 text-yellow-600",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                        lineNumber: 24,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                    lineNumber: 23,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-bold text-gray-900",
                                        children: "Pause Timer?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                        lineNumber: 28,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mt-1",
                                        children: task.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                        lineNumber: 29,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-700 mb-6",
                        children: "Are you sure you want to pause your timer? You'll be asked to record your progress before the timer stops."
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium",
                                children: "No, Keep Working"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onConfirm,
                                className: "flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium",
                                children: "Yes, Pause Timer"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/PauseConfirmationModal.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
};
_c = PauseConfirmationModal;
const __TURBOPACK__default__export__ = PauseConfirmationModal;
var _c;
__turbopack_context__.k.register(_c, "PauseConfirmationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/CompletionAnimation.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/CompletionAnimation.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const CompletionAnimation = ({ mysteryReward })=>{
    _s();
    const [animationStage, setAnimationStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CompletionAnimation.useEffect": ()=>{
            // Progress through animation stages
            const timer1 = setTimeout({
                "CompletionAnimation.useEffect.timer1": ()=>setAnimationStage(2)
            }["CompletionAnimation.useEffect.timer1"], 1000);
            const timer2 = setTimeout({
                "CompletionAnimation.useEffect.timer2": ()=>setAnimationStage(3)
            }["CompletionAnimation.useEffect.timer2"], 2500);
            return ({
                "CompletionAnimation.useEffect": ()=>{
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                }
            })["CompletionAnimation.useEffect"];
        }
    }["CompletionAnimation.useEffect"], []);
    // Seed color based on mystery reward
    const getSeedColor = ()=>{
        if (!mysteryReward) return "#22c55e"; // Regular green seed
        switch(mysteryReward){
            case 'silver':
                return "linear-gradient(135deg, #f1f5f9, #94a3b8)";
            case 'gold':
                return "linear-gradient(135deg, #fef3c7, #f59e0b)";
            case 'diamond':
                return "linear-gradient(135deg, #e0f2fe, #0ea5e9)";
            case 'eternity':
                return "linear-gradient(135deg, #fae8ff, #d946ef)";
            case 'mystery':
                return "linear-gradient(135deg, #10b981, #6366f1, #ef4444)";
            default:
                return "#22c55e";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center z-[100]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md w-full bg-white rounded-xl p-8 text-center relative overflow-hidden",
            children: [
                animationStage >= 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 overflow-hidden",
                    children: [
                        ...Array(20)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute animate-fly-seed",
                            style: {
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 1}s`,
                                animationDuration: `${1 + Math.random() * 3}s`,
                                // Set random direction for each seed
                                '--random-x': `${Math.random() * 200 - 100}px`,
                                '--random-y': `${Math.random() * 200 - 100}px`
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-4 rounded-full",
                                style: {
                                    background: getSeedColor()
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                                lineNumber: 58,
                                columnNumber: 17
                            }, this)
                        }, i, false, {
                            fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                            lineNumber: 45,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                    lineNumber: 43,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-gray-800 mb-6",
                    children: animationStage < 3 ? "Task Completed!" : "You've Earned a Seed!"
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                animationStage >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-24 w-24 rounded-full animate-pulse-grow",
                        style: {
                            background: getSeedColor()
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                        lineNumber: 73,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this),
                animationStage >= 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-700",
                            children: "Congratulations on completing your task!"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this),
                        mysteryReward && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-purple-50 p-4 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-purple-800 font-medium",
                                    children: [
                                        "WOW! You found a ",
                                        mysteryReward.charAt(0).toUpperCase() + mysteryReward.slice(1),
                                        " Seed!"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                                    lineNumber: 88,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-purple-700 mt-1",
                                    children: "These rare seeds will help your Greenhouse flourish and earn you special recognition!"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                                    lineNumber: 91,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                            lineNumber: 87,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600",
                            children: "The more tasks you complete each week, the higher your chance to find a mystery seed!"
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/dashboard/CompletionAnimation.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
};
_s(CompletionAnimation, "czxaODawg16XXII9rNa/XM+r8d0=");
_c = CompletionAnimation;
const __TURBOPACK__default__export__ = CompletionAnimation;
var _c;
__turbopack_context__.k.register(_c, "CompletionAnimation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/TasksList.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/TasksList.tsx - Enhanced Version
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TaskCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedTaskCompletionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$ProgressRecordingModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/ProgressRecordingModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskStartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TaskStartModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$PauseConfirmationModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/PauseConfirmationModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskTimeDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TaskTimeDisplay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$CompletionAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/CompletionAnimation.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const TasksList = ({ tasks, userId })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('open');
    const [selectedTask, setSelectedTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCompletionModal, setShowCompletionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showProgressModal, setShowProgressModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showStartModal, setShowStartModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPauseConfirmation, setShowPauseConfirmation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCompletionAnimation, setShowCompletionAnimation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTaskId, setActiveTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mysteryRewardReceived, setMysteryRewardReceived] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pausedTaskData, setPausedTaskData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Enhanced state for better UX
    const [taskStartTimes, setTaskStartTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [weeklyTarget, setWeeklyTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5); // Could be dynamic based on user level
    const [showWeeklyStats, setShowWeeklyStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Update current time every second for live updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TasksList.useEffect": ()=>{
            const interval = setInterval({
                "TasksList.useEffect.interval": ()=>{
                    setCurrentTime(new Date());
                }
            }["TasksList.useEffect.interval"], 1000);
            return ({
                "TasksList.useEffect": ()=>clearInterval(interval)
            })["TasksList.useEffect"];
        }
    }["TasksList.useEffect"], []);
    // Group tasks by status with enhanced logic
    const openTasks = tasks.filter((task)=>!task.completedBy?.includes(userId) && (!task.status || task.status === 'open'));
    const scheduledTasksList = tasks.filter((task)=>!task.completedBy?.includes(userId) && task.status === 'scheduled');
    const inProgressTasks = tasks.filter((task)=>!task.completedBy?.includes(userId) && (task.status === 'in-progress' || task.status === 'paused'));
    const completedTasks = tasks.filter((task)=>task.completedBy?.includes(userId) || task.status === 'completed');
    // Calculate weekly progress
    const weeklyProgress = {
        completed: completedTasks.length,
        total: tasks.length,
        percentage: tasks.length > 0 ? Math.round(completedTasks.length / tasks.length * 100) : 0,
        inProgress: inProgressTasks.length,
        scheduled: scheduledTasksList.length
    };
    // Get active task details
    const activeTask = activeTaskId ? tasks.find((t)=>t.id === activeTaskId) : null;
    const activeTaskStartTime = activeTaskId ? taskStartTimes[activeTaskId] : null;
    // Calculate live elapsed time for active task
    const getLiveElapsedTime = ()=>{
        if (!activeTask || !activeTaskStartTime) return 0;
        const baseTime = activeTask.timeSpent || 0; // Previous time spent
        const sessionTime = Math.floor((currentTime.getTime() - activeTaskStartTime.getTime()) / 1000);
        return baseTime + sessionTime;
    };
    // Calculate remaining time for active task
    const getRemainingTime = ()=>{
        if (!activeTask) return 0;
        const totalEstimated = (activeTask.estimatedTime || 60) * 60; // Convert to seconds
        const elapsed = getLiveElapsedTime();
        return Math.max(totalEstimated - elapsed, 0);
    };
    // Format time display
    const formatTime = (seconds)=>{
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };
    // Get estimated completion time
    const getEstimatedCompletion = ()=>{
        const remaining = getRemainingTime();
        if (remaining <= 0) return null;
        const completionTime = new Date(currentTime.getTime() + remaining * 1000);
        return completionTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    // Combine open and scheduled tasks for the "Open Tasks" tab
    const allOpenTasks = [
        ...openTasks,
        ...scheduledTasksList
    ];
    // Handle complete task action
    const handleCompleteTask = async (task)=>{
        try {
            if (!task || !task.id) {
                console.error('Invalid task or missing task ID');
                return;
            }
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', task.id);
            const updateData = {
                completionDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                status: 'completed'
            };
            if (userId) {
                updateData.completedBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(userId);
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, updateData);
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                seeds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1),
                completedTasks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1)
            });
            // Check for mystery seed
            const mysteryReward = checkForMysteryReward();
            if (mysteryReward) {
                setMysteryRewardReceived(mysteryReward);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                    [`mysterySeeds.${mysteryReward}`]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1)
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'shoutouts'), {
                    userId: userId,
                    seedType: mysteryReward,
                    timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
            }
            // Clear active task if it was the completed one
            if (activeTaskId === task.id) {
                setActiveTaskId(null);
                setTaskStartTimes((prev)=>{
                    const updated = {
                        ...prev
                    };
                    delete updated[task.id];
                    return updated;
                });
            }
            setShowCompletionAnimation(true);
            setTimeout(()=>{
                setShowCompletionAnimation(false);
                setMysteryRewardReceived(null);
            }, 5000);
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };
    const checkForMysteryReward = ()=>{
        const random = Math.random() * 100;
        if (random <= 0.001) return 'mystery';
        if (random <= 0.01) return 'eternity';
        if (random <= 0.1) return 'diamond';
        if (random <= 5) return 'gold';
        if (random <= 10) return 'silver';
        return null;
    };
    const handleTaskCardClick = (task)=>{
        setSelectedTask(task);
        if (task.status === 'in-progress' || task.status === 'paused') {
            setShowCompletionModal(true);
        } else if (task.completedBy?.includes(userId)) {
            setShowCompletionModal(true);
        } else {
            setShowStartModal(true);
        }
    };
    const closeAllModals = ()=>{
        setShowCompletionModal(false);
        setShowProgressModal(false);
        setShowStartModal(false);
        setShowPauseConfirmation(false);
        setSelectedTask(null);
        setPausedTaskData(null);
    };
    const handleTaskStart = async (taskId)=>{
        try {
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', taskId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                status: 'in-progress',
                startTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            setActiveTaskId(taskId);
            setTaskStartTimes((prev)=>({
                    ...prev,
                    [taskId]: new Date()
                }));
        } catch (error) {
            console.error('Error starting task:', error);
        }
    };
    const handleTaskPause = async (taskId)=>{
        try {
            const task = tasks.find((t)=>t.id === taskId);
            if (!task) return;
            let currentElapsed = task.timeSpent || 0;
            if (taskStartTimes[taskId]) {
                const sessionElapsed = Math.floor((new Date().getTime() - taskStartTimes[taskId].getTime()) / 1000);
                currentElapsed += Math.max(sessionElapsed, 0);
            }
            const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', taskId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                status: 'paused',
                timeSpent: currentElapsed,
                lastPauseTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            setActiveTaskId(null);
            setTaskStartTimes((prev)=>{
                const updated = {
                    ...prev
                };
                delete updated[taskId];
                return updated;
            });
            setPausedTaskData({
                taskId,
                pauseTime: new Date(),
                elapsedAtPause: currentElapsed
            });
            setSelectedTask(task);
            setShowPauseConfirmation(true);
        } catch (error) {
            console.error('Error pausing task:', error);
        }
    };
    const handlePauseConfirm = ()=>{
        setShowPauseConfirmation(false);
        setShowProgressModal(true);
    };
    const handlePauseCancel = async ()=>{
        if (pausedTaskData && selectedTask) {
            try {
                const taskRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'tasks', pausedTaskData.taskId);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(taskRef, {
                    status: 'in-progress',
                    startTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                });
                setActiveTaskId(pausedTaskData.taskId);
                setTaskStartTimes((prev)=>({
                        ...prev,
                        [pausedTaskData.taskId]: new Date()
                    }));
            } catch (error) {
                console.error('Error resuming task:', error);
            }
        }
        setShowPauseConfirmation(false);
        setSelectedTask(null);
        setPausedTaskData(null);
    };
    const handleProgressSubmit = ()=>{
        setActiveTaskId(null);
        setSelectedTask(null);
        setShowProgressModal(false);
        setPausedTaskData(null);
    };
    const handleTaskScheduled = ()=>{
        setSelectedTask(null);
        setShowStartModal(false);
    };
    // Calculate time until next scheduled task
    const getNextScheduledTask = ()=>{
        const now = new Date();
        const scheduledWithTimes = scheduledTasksList.filter((task)=>task.scheduledTime).map((task)=>({
                task,
                scheduledTime: task.scheduledTime.toDate ? task.scheduledTime.toDate() : new Date(task.scheduledTime)
            })).filter(({ scheduledTime })=>scheduledTime > now).sort((a, b)=>a.scheduledTime.getTime() - b.scheduledTime.getTime());
        return scheduledWithTimes[0] || null;
    };
    const nextScheduled = getNextScheduledTask();
    // Determine which tasks to display based on active tab
    const displayedTasks = activeTab === 'open' ? allOpenTasks : activeTab === 'in-progress' ? inProgressTasks : completedTasks;
    const handleCreateCustomTask = ()=>{
        router.push('/tasks/create');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg p-6 mb-6 shadow-sm border border-green-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row lg:items-center lg:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 lg:mb-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-green-800 mb-2",
                                        children: "Weekly Volunteer Challenge"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 369,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-green-700 mb-3",
                                        children: [
                                            "Complete all ",
                                            weeklyProgress.total,
                                            " tasks to earn ",
                                            weeklyTarget,
                                            " seeds!",
                                            weeklyProgress.percentage === 100 && " 🎉 Congratulations!"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 372,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 flex-grow bg-gray-200 rounded-full overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `h-full transition-all duration-500 ease-out ${weeklyProgress.percentage === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-green-400 to-green-500'}`,
                                                    style: {
                                                        width: `${weeklyProgress.percentage}%`
                                                    },
                                                    children: weeklyProgress.percentage === 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 379,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-semibold text-gray-700",
                                                        children: [
                                                            weeklyProgress.completed,
                                                            "/",
                                                            weeklyProgress.total,
                                                            " tasks"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-medium text-green-600",
                                                        children: [
                                                            weeklyProgress.percentage,
                                                            "% complete"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 393,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white px-3 py-2 rounded-full shadow-sm border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-600",
                                                children: "In Progress"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 font-bold text-blue-600",
                                                children: weeklyProgress.inProgress
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 408,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white px-3 py-2 rounded-full shadow-sm border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-600",
                                                children: "Scheduled"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 411,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 font-bold text-purple-600",
                                                children: weeklyProgress.scheduled
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 412,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white px-3 py-2 rounded-full shadow-sm border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-600",
                                                children: "Completed"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 415,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 font-bold text-green-600",
                                                children: weeklyProgress.completed
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 416,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 414,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 405,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this),
                    activeTaskId && activeTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border-l-4 border-blue-500",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col lg:flex-row lg:items-center lg:justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-4 mb-4 lg:mb-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskTimeDisplay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                task: activeTask,
                                                isActive: true,
                                                size: "medium"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 426,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-gray-800 mb-1",
                                                    children: activeTask.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-4 text-sm text-gray-600",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Started: ",
                                                                activeTaskStartTime?.toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit'
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono font-semibold text-blue-600",
                                                            children: [
                                                                "Live: ",
                                                                formatTime(getLiveElapsedTime())
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                            lineNumber: 446,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 19
                                                }, this),
                                                getRemainingTime() > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-orange-600 font-medium",
                                                            children: [
                                                                formatTime(getRemainingTime()),
                                                                " remaining"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                            lineNumber: 453,
                                                            columnNumber: 23
                                                        }, this),
                                                        getEstimatedCompletion() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-500 ml-2",
                                                            children: [
                                                                "(Est. done: ",
                                                                getEstimatedCompletion(),
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 21
                                                }, this),
                                                getRemainingTime() <= 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 text-sm text-red-600 font-medium animate-pulse",
                                                    children: [
                                                        "⚠️ Task is ",
                                                        formatTime(Math.abs(getRemainingTime())),
                                                        " overtime"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 434,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center bg-blue-100 px-3 py-1 rounded-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-medium text-blue-800",
                                                    children: "Timer Active"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 473,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleTaskPause(activeTaskId),
                                            className: "px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-4 w-4 mr-1",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                        lineNumber: 483,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 19
                                                }, this),
                                                "Pause"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                    lineNumber: 472,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                            lineNumber: 424,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this),
                    !activeTaskId && nextScheduled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 bg-purple-50 p-3 rounded-lg border border-purple-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                            className: "font-medium text-purple-800",
                                            children: "Next Scheduled Task"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 497,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-purple-700",
                                            children: nextScheduled.task.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 498,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                    lineNumber: 496,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-medium text-purple-800",
                                            children: nextScheduled.scheduledTime.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-purple-600",
                                            children: [
                                                "in ",
                                                Math.ceil((nextScheduled.scheduledTime.getTime() - currentTime.getTime()) / 60000),
                                                " min"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 507,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                            lineNumber: 495,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 366,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('open'),
                                className: `px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'open' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                children: [
                                    "Open Tasks (",
                                    allOpenTasks.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 519,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('in-progress'),
                                className: `px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'in-progress' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                children: [
                                    "In-Progress (",
                                    inProgressTasks.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('completed'),
                                className: `px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'completed' ? 'bg-gray-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                children: [
                                    "Completed (",
                                    completedTasks.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 539,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 518,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            weeklyProgress.percentage === 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium",
                                children: "🎉 Week Complete!"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 553,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCreateCustomTask,
                                className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-4 w-4 mr-2",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 4v16m8-8H4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                            lineNumber: 563,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                        lineNumber: 562,
                                        columnNumber: 13
                                    }, this),
                                    "Create Task"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 551,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 517,
                columnNumber: 7
            }, this),
            displayedTasks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-50 rounded-lg p-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: activeTab === 'open' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-12 w-12 text-gray-400 mx-auto mb-2",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 576,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                            lineNumber: 575,
                            columnNumber: 15
                        }, this) : activeTab === 'in-progress' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-12 w-12 text-gray-400 mx-auto mb-2",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 580,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                            lineNumber: 579,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-12 w-12 text-gray-400 mx-auto mb-2",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                                lineNumber: 584,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/TasksList.tsx",
                            lineNumber: 583,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 573,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 mb-2",
                        children: activeTab === 'open' ? "No open tasks available right now." : activeTab === 'in-progress' ? "No tasks currently in progress." : "No completed tasks yet."
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 589,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-sm",
                        children: activeTab === 'open' ? "New tasks are assigned weekly. Check back soon or create a custom task." : activeTab === 'in-progress' ? "Start a task to begin tracking your progress." : "Complete tasks to earn seeds and build your volunteering history."
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 596,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 572,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: displayedTasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        task: task,
                        isCompleted: task.completedBy?.includes(userId) || task.status === 'completed',
                        onComplete: ()=>handleTaskCardClick(task),
                        userId: userId,
                        isDisabled: activeTaskId !== null && activeTaskId !== task.id,
                        onTaskStart: handleTaskStart,
                        onTaskPause: handleTaskPause,
                        activeTaskId: activeTaskId
                    }, task.id, false, {
                        fileName: "[project]/app/components/dashboard/TasksList.tsx",
                        lineNumber: 607,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 605,
                columnNumber: 9
            }, this),
            showPauseConfirmation && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$PauseConfirmationModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: selectedTask,
                onConfirm: handlePauseConfirm,
                onCancel: handlePauseCancel
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 624,
                columnNumber: 9
            }, this),
            showStartModal && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TaskStartModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: selectedTask,
                onClose: closeAllModals,
                onStartTimer: handleTaskStart,
                onScheduled: handleTaskScheduled
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 633,
                columnNumber: 9
            }, this),
            showCompletionModal && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedTaskCompletionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: selectedTask,
                userId: userId,
                onClose: closeAllModals,
                onComplete: ()=>handleCompleteTask(selectedTask),
                onTaskStart: handleTaskStart,
                onTaskPause: handleTaskPause
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 643,
                columnNumber: 9
            }, this),
            showProgressModal && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$ProgressRecordingModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: selectedTask,
                userId: userId,
                onClose: ()=>setShowProgressModal(false),
                onSubmit: handleProgressSubmit
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 655,
                columnNumber: 9
            }, this),
            showCompletionAnimation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$CompletionAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                mysteryReward: mysteryRewardReceived
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/TasksList.tsx",
                lineNumber: 665,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/TasksList.tsx",
        lineNumber: 364,
        columnNumber: 5
    }, this);
};
_s(TasksList, "rwEUmA1CYTY7fHTlXEMQtZ1X3Uk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TasksList;
const __TURBOPACK__default__export__ = TasksList;
var _c;
__turbopack_context__.k.register(_c, "TasksList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/ProgressStats.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/ProgressStats.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const ProgressStats = ({ total, completed, level })=>{
    // Calculate percentage completed
    const percentage = total > 0 ? Math.round(completed / total * 100) : 0;
    // Get level-specific text and colors
    const getLevelInfo = (level)=>{
        switch(level){
            case 'Sprout':
                return {
                    title: 'Growing Your Impact',
                    description: 'Complete your assigned tasks to earn seeds and make a difference!',
                    color: 'bg-green-400'
                };
            case 'Bud':
                return {
                    title: 'Expanding Your Reach',
                    description: 'Connect with others locally and choose tasks that interest you.',
                    color: 'bg-green-600'
                };
            case 'Bloom':
                return {
                    title: 'Leading the Way',
                    description: 'Create opportunities and mentor others in your community.',
                    color: 'bg-green-800'
                };
            default:
                return {
                    title: 'Tracking Progress',
                    description: 'Complete tasks to earn seeds and make a difference.',
                    color: 'bg-green-500'
                };
        }
    };
    const levelInfo = getLevelInfo(level);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-lg",
                                children: levelInfo.title
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 text-sm",
                                children: levelInfo.description
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold",
                                children: [
                                    completed,
                                    " / ",
                                    total
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: "Tasks Completed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-4 bg-gray-200 rounded-full mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full rounded-full ${levelInfo.color}`,
                    style: {
                        width: `${percentage}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-2 text-sm text-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            percentage,
                            "% Complete"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    percentage === 100 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-green-600 font-medium",
                        children: "All tasks completed this week!"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            total - completed,
                            " task",
                            total - completed !== 1 ? 's' : '',
                            " remaining"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 bg-green-50 p-3 rounded-md border border-green-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-5 w-5 text-green-600 mr-2",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M13 10V3L4 14h7v7l9-11h-7z"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-green-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Weekly Reward:"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                " Complete all tasks to earn 5 seeds!"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/ProgressStats.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
};
_c = ProgressStats;
const __TURBOPACK__default__export__ = ProgressStats;
var _c;
__turbopack_context__.k.register(_c, "ProgressStats");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/SeedCounter.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/SeedCounter.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const SeedCounter = ({ seeds })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-green-50 border border-green-100 rounded-full px-4 py-2 flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/seed-icon.png",
                        alt: "Seeds",
                        className: "w-5 h-5 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-bold text-green-800",
                        children: seeds
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        onClick: ()=>router.push('/store'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-green-200 hover:bg-green-300 border border-green-300 hover:cursor-pointer rounded-full ml-4 px-4 py-2 flex items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-green-800",
                                children: "Buy Seeds"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                                lineNumber: 28,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 mt-1",
                children: "Total Seeds"
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/SeedCounter.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
};
_s(SeedCounter, "OeGW3YQfIEwiDdtbkZtE38+y0P4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SeedCounter;
const __TURBOPACK__default__export__ = SeedCounter;
var _c;
__turbopack_context__.k.register(_c, "SeedCounter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/map/OpportunityMarker.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/map/OpportunityMarker.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
'use client';
;
;
;
const OpportunityMarker = ({ task, position })=>{
    // Create category-specific icons
    const getCategoryIcon = (category)=>{
        let color;
        switch(category){
            case 'communityService':
                color = 'purple';
                break;
            case 'environmentalAction':
                color = 'green';
                break;
            case 'educationYouthSupport':
                color = 'yellow';
                break;
            case 'healthWellness':
                color = 'blue';
                break;
            default:
                color = 'gray';
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"]({
            iconUrl: `/images/markers/${color}-marker.png`,
            iconSize: [
                25,
                41
            ],
            iconAnchor: [
                12,
                41
            ],
            popupAnchor: [
                1,
                -34
            ]
        });
    };
    // Format category for display
    const formatCategory = (category)=>{
        switch(category){
            case 'communityService':
                return 'Community Service';
            case 'environmentalAction':
                return 'Environmental Action';
            case 'educationYouthSupport':
                return 'Education & Youth';
            case 'healthWellness':
                return 'Health & Wellness';
            default:
                return category;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
        position: position,
        icon: getCategoryIcon(task.category),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-md",
                        children: task.title
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mt-1",
                        children: task.description
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex flex-wrap gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs px-2 py-1 rounded-full 
              ${task.category === 'communityService' ? 'bg-purple-100 text-purple-800' : task.category === 'environmentalAction' ? 'bg-green-100 text-green-800' : task.category === 'educationYouthSupport' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`,
                                children: formatCategory(task.category)
                            }, void 0, false, {
                                fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full",
                                children: [
                                    task.estimatedTime,
                                    " min"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full",
                                children: task.locationType === 'remote' ? 'Do from home' : task.locationType === 'inPerson' ? 'In-person' : 'Virtual meeting'
                            }, void 0, false, {
                                fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 pt-2 border-t border-gray-200",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "w-full text-sm py-1 bg-green-600 hover:bg-green-700 text-white rounded-md",
                            children: "View Details"
                        }, void 0, false, {
                            fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/map/OpportunityMarker.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/map/OpportunityMarker.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/map/OpportunityMarker.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
};
_c = OpportunityMarker;
const __TURBOPACK__default__export__ = OpportunityMarker;
var _c;
__turbopack_context__.k.register(_c, "OpportunityMarker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/map/Greenhouse.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/map/Greenhouse.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Marker.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/Popup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const Greenhouse = ({ position, userId })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Greenhouse.useEffect": ()=>{
            const fetchUserData = {
                "Greenhouse.useEffect.fetchUserData": async ()=>{
                    try {
                        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', userId));
                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["Greenhouse.useEffect.fetchUserData"];
            fetchUserData();
        }
    }["Greenhouse.useEffect"], [
        userId
    ]);
    // Create greenhouse icon
    const greenhouseIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"]({
        iconUrl: '/images/greenhouse.png',
        iconSize: [
            40,
            40
        ],
        iconAnchor: [
            20,
            40
        ],
        popupAnchor: [
            0,
            -40
        ]
    });
    // Calculate tree count based on seeds
    const getTreeCount = (seeds)=>{
        // Every 10 seeds = 1 tree
        return Math.floor(seeds / 10);
    };
    // Handle button click to navigate to greenhouse page
    const handleViewGreenhouse = ()=>{
        router.push('/greenhouse');
    };
    if (loading) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Marker$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
        position: position,
        icon: greenhouseIcon,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$Popup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popup"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-md",
                        children: [
                            userData?.displayName,
                            "'s Greenhouse"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/map/Greenhouse.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 bg-green-50 p-3 rounded-md border border-green-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-green-800",
                                                    children: userData?.seeds || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/map/Greenhouse.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 19
                                                }, this),
                                                " seeds collected"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/map/Greenhouse.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this),
                                        userData && userData.seeds >= 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-green-800",
                                                    children: getTreeCount(userData.seeds)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/map/Greenhouse.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 21
                                                }, this),
                                                " trees planted"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/map/Greenhouse.tsx",
                                            lineNumber: 78,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/map/Greenhouse.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/images/seed-icon.png",
                                        alt: "Seeds",
                                        className: "w-6 h-6"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/map/Greenhouse.tsx",
                                        lineNumber: 84,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/map/Greenhouse.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/map/Greenhouse.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/Greenhouse.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    userData && userData.seeds < 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 mt-2",
                        children: "Collect 10 seeds to plant your first virtual tree!"
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/Greenhouse.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleViewGreenhouse,
                            className: "w-full text-sm py-1 bg-green-600 hover:bg-green-700 text-white rounded-md",
                            children: "View Greenhouse"
                        }, void 0, false, {
                            fileName: "[project]/app/components/map/Greenhouse.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/Greenhouse.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/map/Greenhouse.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/map/Greenhouse.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/map/Greenhouse.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
};
_s(Greenhouse, "0gUu1XQBY7cSWjYPhWGCWyf293g=", false, function() {
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
"[project]/app/components/map/VolunteerMap.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/map/VolunteerMap.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/MapContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/TileLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-leaflet/lib/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$OpportunityMarker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/map/OpportunityMarker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$Greenhouse$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/map/Greenhouse.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
const DynamicMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c = ()=>__turbopack_context__.r("[project]/app/components/map/VolunteerMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/app/components/map/VolunteerMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"
            }, void 0, false, {
                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/map/VolunteerMap.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
});
_c1 = DynamicMap;
// Workaround for Leaflet marker icons in Next.js
// This needs to be done because Next.js server-side rendering doesn't include the Leaflet CSS
// Define icons here to avoid issues with server/client rendering
const defaultIcon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"]({
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [
        25,
        41
    ],
    iconAnchor: [
        12,
        41
    ],
    popupAnchor: [
        1,
        -34
    ],
    shadowSize: [
        41,
        41
    ]
});
// Set the default icon for all markers
// @ts-ignore
delete __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"].Default.prototype._getIconUrl;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"].Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png'
});
// Map center update component
const MapCenterUpdater = ({ location })=>{
    _s();
    const map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapCenterUpdater.useEffect": ()=>{
            if (location) {
                map.setView([
                    location.latitude,
                    location.longitude
                ], 12);
            }
        }
    }["MapCenterUpdater.useEffect"], [
        location,
        map
    ]);
    return null;
};
_s(MapCenterUpdater, "IoceErwr5KVGS9kN4RQ1bOkYMAg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMap"]
    ];
});
_c2 = MapCenterUpdater;
const VolunteerMap = ({ userLocation, userLevel, userId })=>{
    _s1();
    const [opportunities, setOpportunities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Default location (New York City) if user location is not available
    const defaultLocation = {
        latitude: 40.7128,
        longitude: -74.0060
    };
    const location = userLocation && userLocation.latitude !== 0 ? userLocation : defaultLocation;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VolunteerMap.useEffect": ()=>{
            const fetchOpportunities = {
                "VolunteerMap.useEffect.fetchOpportunities": async ()=>{
                    if (!userLocation || userLocation.latitude === 0) {
                        setLoading(false);
                        return;
                    }
                    try {
                        const nearbyOpps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNearbyOpportunities"])(userLocation.latitude, userLocation.longitude, 10, userLevel);
                        setOpportunities(nearbyOpps);
                    } catch (err) {
                        setError(err.message);
                    } finally{
                        setLoading(false);
                    }
                }
            }["VolunteerMap.useEffect.fetchOpportunities"];
            fetchOpportunities();
        }
    }["VolunteerMap.useEffect"], [
        userLocation,
        userLevel
    ]);
    // Prompt user to share location if not already set
    const requestLocationPermission = ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                // Here you would normally update the user's location in the database
                // For demo purposes, we'll just log it
                console.log('Location updated:', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (err)=>{
                setError('Unable to retrieve your location. ' + err.message);
            });
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"
            }, void 0, false, {
                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                lineNumber: 130,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/map/VolunteerMap.tsx",
            lineNumber: 129,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-full map-container relative",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 left-2 right-2 z-10 bg-red-100 text-red-700 p-2 rounded-md text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$MapContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapContainer"], {
                center: [
                    location.latitude,
                    location.longitude
                ],
                zoom: 12,
                style: {
                    height: '100%',
                    width: '100%',
                    borderRadius: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$leaflet$2f$lib$2f$TileLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TileLayer"], {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/VolunteerMap.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapCenterUpdater, {
                        location: location
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/VolunteerMap.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$Greenhouse$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        position: [
                            location.latitude,
                            location.longitude
                        ],
                        userId: userId
                    }, void 0, false, {
                        fileName: "[project]/app/components/map/VolunteerMap.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    opportunities.map((opportunity)=>opportunity.location?.coordinates?.latitude && opportunity.location?.coordinates?.longitude ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$OpportunityMarker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            task: opportunity,
                            position: [
                                opportunity.location.coordinates.latitude,
                                opportunity.location.coordinates.longitude
                            ]
                        }, opportunity.id, false, {
                            fileName: "[project]/app/components/map/VolunteerMap.tsx",
                            lineNumber: 166,
                            columnNumber: 13
                        }, this) : null),
                    opportunities.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-4 left-4 right-4 bg-white p-3 rounded-md shadow-md z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-700",
                                children: "No volunteer opportunities found nearby. Try expanding your search area or check back later."
                            }, void 0, false, {
                                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this),
                            (!userLocation || userLocation.latitude === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: requestLocationPermission,
                                className: "mt-2 text-sm text-green-600 font-medium hover:text-green-800",
                                children: "Share your location to see nearby opportunities"
                            }, void 0, false, {
                                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/map/VolunteerMap.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/map/VolunteerMap.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/map/VolunteerMap.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
};
_s1(VolunteerMap, "OPz44s6XUqQRs3NSROIQDSkICt0=");
_c3 = VolunteerMap;
const __TURBOPACK__default__export__ = VolunteerMap;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "DynamicMap$dynamic");
__turbopack_context__.k.register(_c1, "DynamicMap");
__turbopack_context__.k.register(_c2, "MapCenterUpdater");
__turbopack_context__.k.register(_c3, "VolunteerMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/auth/LocationPermission.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/auth/LocationPermission.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$location$2f$locationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/location/locationService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const LocationPermission = ({ userLevel, userId, onLocationUpdated })=>{
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [permissionGranted, setPermissionGranted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Only ask for location if user is Bud or Bloom level
    const shouldRequestLocation = userLevel === 'Bud' || userLevel === 'Bloom';
    const handleRequestLocation = async ()=>{
        if (!shouldRequestLocation) return;
        setLoading(true);
        setError(null);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$location$2f$locationService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestLocationPermission"])(userId);
            if (result.success) {
                setPermissionGranted(true);
                onLocationUpdated(result.location);
            } else {
                setError(result.error || 'Failed to get location');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally{
            setLoading(false);
        }
    };
    const handleSkip = ()=>{
        // Skip location permission, but still inform parent component
        onLocationUpdated();
    };
    if (!shouldRequestLocation) {
        return null;
    }
    if (permissionGranted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-green-50 border border-green-200 rounded-lg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-6 w-6 text-green-600",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M5 13l4 4L19 7"
                            }, void 0, false, {
                                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/auth/LocationPermission.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/auth/LocationPermission.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-green-800",
                            children: "Location permission granted! We'll use this to find volunteer opportunities near you."
                        }, void 0, false, {
                            fileName: "[project]/app/components/auth/LocationPermission.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/auth/LocationPermission.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/auth/LocationPermission.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 bg-white border rounded-lg shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-2",
                children: "Enable Location Services"
            }, void 0, false, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600 mb-4",
                children: userLevel === 'Bud' ? 'As a Bud level volunteer, enabling location allows you to see volunteering opportunities near you and connect with local volunteers.' : 'As a Bloom level volunteer, enabling location allows you to create and find local opportunities and mentor others in your area.'
            }, void 0, false, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-3 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleRequestLocation,
                        disabled: loading,
                        className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/auth/LocationPermission.tsx",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this),
                                "Getting Location..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-5 w-5 mr-1",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/auth/LocationPermission.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/auth/LocationPermission.tsx",
                                            lineNumber: 108,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/auth/LocationPermission.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this),
                                "Enable Location"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/components/auth/LocationPermission.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSkip,
                        disabled: loading,
                        className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md",
                        children: "Skip for Now"
                    }, void 0, false, {
                        fileName: "[project]/app/components/auth/LocationPermission.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 mt-3",
                children: "Your location will only be used to find volunteer opportunities near you. You can update your location permissions at any time in your profile settings."
            }, void 0, false, {
                fileName: "[project]/app/components/auth/LocationPermission.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/auth/LocationPermission.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
};
_s(LocationPermission, "I0y20dZCUEUPMYOi0lvL/OzugC0=");
_c = LocationPermission;
const __TURBOPACK__default__export__ = LocationPermission;
var _c;
__turbopack_context__.k.register(_c, "LocationPermission");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/dashboard/EnhancedDashboard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/components/dashboard/EnhancedDashboard.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$tasksService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase/tasksService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TasksList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/TasksList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$ProgressStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/ProgressStats.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$SeedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/SeedCounter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$VolunteerMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/map/VolunteerMap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$auth$2f$LocationPermission$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/auth/LocationPermission.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedTaskCompletionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/EnhancedTaskCompletionModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$CompletionAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/CompletionAnimation.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
const EnhancedDashboard = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [locationPromptShown, setLocationPromptShown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [assigningTasks, setAssigningTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTask, setSelectedTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCompletionModal, setShowCompletionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCompletionAnimation, setShowCompletionAnimation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTaskId, setActiveTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mysteryRewardReceived, setMysteryRewardReceived] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Profile image state
    const [profileImage, setProfileImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHovering, setIsHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadError, setUploadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnhancedDashboard.useEffect": ()=>{
            // Check if user is authenticated
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].onAuthStateChanged({
                "EnhancedDashboard.useEffect.unsubscribe": async (user)=>{
                    if (user) {
                        setUser(user);
                        try {
                            // Get user profile
                            const userProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserProfile"])(user.uid);
                            if (userProfile) {
                                setProfile(userProfile);
                                setProfileImage(userProfile.photoURL || null);
                                // Get user's tasks
                                const userTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserTasks"])(user.uid);
                                setTasks(userTasks);
                                // Check if we need to request location
                                if (!locationPromptShown && (userProfile.level === 'Bud' || userProfile.level === 'Bloom') && (!userProfile.location || userProfile.location.latitude === 0)) {
                                    setLocationPromptShown(true);
                                }
                            } else {
                                // Profile not found, redirect to onboarding
                                router.push('/auth/onboarding');
                            }
                        } catch (err) {
                            setError(err.message);
                        } finally{
                            setLoading(false);
                        }
                    } else {
                        // Not authenticated, redirect to login
                        router.push('/auth/sign-in');
                    }
                }
            }["EnhancedDashboard.useEffect.unsubscribe"]);
            return ({
                "EnhancedDashboard.useEffect": ()=>unsubscribe()
            })["EnhancedDashboard.useEffect"];
        }
    }["EnhancedDashboard.useEffect"], [
        router
    ]);
    // Handle location update
    const handleLocationUpdated = (location)=>{
        if (profile && location) {
            setProfile({
                ...profile,
                location
            });
        }
    };
    // Assign weekly tasks if user doesn't have any
    const handleAssignTasks = async ()=>{
        if (!user || !profile) return;
        try {
            setAssigningTasks(true);
            const assignedTasks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$tasksService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignWeeklyTasks"])(user.uid);
            setTasks(assignedTasks);
        } catch (err) {
            setError(`Failed to assign tasks: ${err.message}`);
        } finally{
            setAssigningTasks(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnhancedDashboard.useEffect": ()=>{
            // Auto-assign tasks if user has none
            if (user && profile && tasks.length === 0 && !loading && !assigningTasks) {
                handleAssignTasks();
            }
        }
    }["EnhancedDashboard.useEffect"], [
        user,
        profile,
        tasks,
        loading
    ]);
    // Handle complete task action
    const handleCompleteTask = (task)=>{
        setSelectedTask(task);
        setShowCompletionModal(true);
    };
    // Handle task start
    const handleTaskStart = (taskId)=>{
        setActiveTaskId(taskId);
    };
    // Handle task pause
    const handleTaskPause = ()=>{
        setActiveTaskId(null);
    };
    // Handle task completion
    const handleTaskCompleted = ()=>{
        // Show completion animation
        setShowCompletionAnimation(true);
        // After animation finishes, close it
        setTimeout(()=>{
            setShowCompletionAnimation(false);
            setMysteryRewardReceived(null);
            // Refresh tasks
            if (user) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserTasks"])(user.uid).then((updatedTasks)=>{
                    setTasks(updatedTasks);
                });
            }
        }, 3000);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 153,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
            lineNumber: 152,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-red-100 text-red-700 rounded-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Error: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/auth/sign-in'),
                        className: "mt-4 px-4 py-2 bg-red-600 text-white rounded-md",
                        children: "Return to Sign In"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 161,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
            lineNumber: 160,
            columnNumber: 7
        }, this);
    }
    if (!profile) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4 max-w-6xl",
        children: [
            locationPromptShown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$auth$2f$LocationPermission$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    userLevel: profile.level,
                    userId: user.uid,
                    onLocationUpdated: handleLocationUpdated
                }, void 0, false, {
                    fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                    lineNumber: 183,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 182,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center md:col-span-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        onMouseEnter: ()=>setIsHovering(true),
                                        onMouseLeave: ()=>setIsHovering(false),
                                        children: [
                                            profileImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: profileImage,
                                                alt: profile.displayName,
                                                className: "w-24 h-24 rounded-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white ${profile.level === 'Sprout' ? 'bg-green-400' : profile.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'}`,
                                                children: profile.displayName.charAt(0)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                lineNumber: 207,
                                                columnNumber: 17
                                            }, this),
                                            isHovering && !isUploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center cursor-pointer",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-8 w-8 text-white mb-1",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                            lineNumber: 221,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                            lineNumber: 222,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: `/images/${profile.level.toLowerCase()}-badge.png`,
                                            alt: `${profile.level} Badge`,
                                            className: "w-8 h-8"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this),
                            uploadError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-red-500 text-xs mt-1 mb-2 text-center",
                                children: uploadError
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 240,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-1",
                                children: profile.displayName
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4",
                                children: [
                                    profile.level,
                                    " Level"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$SeedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                seeds: profile.seeds
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-md p-6 md:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-4",
                                children: "Your Progress"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$ProgressStats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                total: tasks.length,
                                completed: tasks.filter((task)=>task.completedBy?.includes(user.uid)).length,
                                level: profile.level
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold",
                                children: "Your Weekly Volunteering Tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this),
                            tasks.length === 0 && !assigningTasks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAssignTasks,
                                className: "px-4 py-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white text-sm font-medium rounded-md",
                                children: "Get New Tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    assigningTasks ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8 flex flex-col items-center justify-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Finding the perfect volunteering opportunities for you..."
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$TasksList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        tasks: tasks,
                        userId: user.uid,
                        onTaskClick: handleCompleteTask,
                        activeTaskId: activeTaskId,
                        onTaskStart: handleTaskStart,
                        onTaskPause: handleTaskPause
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            profile.level !== 'Sprout' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow-md p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold mb-4",
                        children: "Volunteering Opportunities Near You"
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this),
                    profile.location && profile.location.latitude !== 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-96",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$map$2f$VolunteerMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            userLocation: profile.location,
                            userLevel: profile.level,
                            userId: user.uid
                        }, void 0, false, {
                            fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                            lineNumber: 299,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 298,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50 rounded-lg p-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-2",
                                children: "Enable location services to see volunteering opportunities near you."
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 307,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setLocationPromptShown(true),
                                className: "px-4 py-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white text-sm font-medium rounded-md",
                                children: "Enable Location"
                            }, void 0, false, {
                                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                                lineNumber: 308,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                        lineNumber: 306,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 295,
                columnNumber: 9
            }, this),
            showCompletionModal && selectedTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedTaskCompletionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                task: selectedTask,
                userId: user.uid,
                onClose: ()=>setShowCompletionModal(false),
                onComplete: handleTaskCompleted,
                onTaskStart: handleTaskStart,
                onTaskPause: handleTaskPause
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 321,
                columnNumber: 9
            }, this),
            showCompletionAnimation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$CompletionAnimation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                mysteryReward: mysteryRewardReceived
            }, void 0, false, {
                fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
                lineNumber: 333,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/dashboard/EnhancedDashboard.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
};
_s(EnhancedDashboard, "RYPAU4j2sFYyuQ5j0S4atOWxnew=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EnhancedDashboard;
const __TURBOPACK__default__export__ = EnhancedDashboard;
var _c;
__turbopack_context__.k.register(_c, "EnhancedDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/dashboard/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/dashboard/page.tsx
__turbopack_context__.s({
    "default": (()=>DashboardPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dashboard/EnhancedDashboard.tsx [app-client] (ecmascript)");
'use client';
;
;
function DashboardPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dashboard$2f$EnhancedDashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_b4117bcc._.js.map