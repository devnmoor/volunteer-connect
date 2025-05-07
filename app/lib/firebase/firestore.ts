// app/lib/firebase/firestore.ts
import { db } from './config';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  GeoPoint,
  Timestamp
} from 'firebase/firestore';
import { UserLevel } from './auth';

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  category: 'communityService' | 'environmentalAction' | 'educationYouthSupport' | 'healthWellness';
  estimatedTime: number;
  locationType: 'remote' | 'inPerson' | 'virtual';
  location?: {
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  completedBy?: string[];
  completionDate?: any; // Firestore timestamp
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
  createdBy?: string;
  isCustom?: boolean;
  
  // Add the missing properties that are causing TypeScript errors
  status?: 'open' | 'scheduled' | 'in-progress' | 'paused' | 'completed';
  scheduledTime?: any; // Firestore timestamp
  timeSpent?: number;
  impact?: string;
  requirements?: string;
  pauseData?: Array<{
    pauseTime: Date;
    resumeTime?: Date;
    reason: string;
    description: string;
  }>;
  assignedTo?: string;
  isAssigned?: boolean;
  images?: string[];
  achievements?: string;
  feedback?: string;
  contact?: {
    name: string;
    type: string;
    value: string;
  };
}

export interface TaskCompletion {
  id?: string;
  taskId: string;
  userId: string;
  completionDate: any;
  imageUrl: string;
  rating: number; // 1-5 stars
  feedback?: string;
  createdAt: any;
}

// Create a new volunteer task (for Bloom users)
// Create a new volunteer task (for Bloom users)
export const createTask = async (taskData: Omit<VolunteerTask, 'id' | 'createdAt' | 'updatedAt' | 'completedBy'>, userId: string) => {
  try {
    // Define the task data without isAssigned (since it doesn't exist in the interface)
    const task = {
      ...taskData,
      createdBy: userId,
      completedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // If you need isAssigned for functionality, add it to the firestore document
    // but not to the typed object
    const firestoreData = {
      ...task,
      // Add any additional fields needed for Firestore but not in the interface
      assignedTo: null, // If needed
    };

    const docRef = await addDoc(collection(db, 'tasks'), firestoreData);
    return { id: docRef.id, ...task };
  } catch (error) {
    throw error;
  }
};
// Add this to app/lib/firebase/firestore.ts
export const resetWeeklyTasks = async (userId: string) => {
  try {
    // Get user's current tasks
    const userTasks = await getUserTasks(userId);

    // For each task, unassign it
    for (const task of userTasks) {
      if (task.id) {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, {
          assignedTo: null,
          isAssigned: false,
          updatedAt: serverTimestamp()
        });
      }
    }

    // Get new tasks to assign based on user's preferences
    // You can modify this based on your application's requirement
    // For example, you can get 3 new tasks per week
    const availableTasksQuery = query(
      collection(db, 'tasks'),
      where('isAssigned', '==', false),
      where('requiredLevel', '==', 'Sapling') // Adjust as needed for the user's level
    );

    const availableTasksSnapshot = await getDocs(availableTasksQuery);
    const availableTasks: VolunteerTask[] = [];

    availableTasksSnapshot.forEach((doc) => {
      availableTasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
    });

    // Assign up to 3 new tasks
    const tasksToAssign = availableTasks.slice(0, 3);

    for (const task of tasksToAssign) {
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

// Get tasks based on filters
export const getTasks = async (filters: {
  category?: VolunteerTask['category'];
  locationType?: VolunteerTask['locationType'];
  requiredLevel?: UserLevel;
  isAssigned?: boolean;
}) => {
  try {
    const tasksCollection = collection(db, 'tasks');
    let q = query(tasksCollection);

    // Build query based on filters
    const constraints = [];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.locationType) {
      constraints.push(where('locationType', '==', filters.locationType));
    }

    if (filters.requiredLevel) {
      constraints.push(where('requiredLevel', '==', filters.requiredLevel));
    }

    if (filters.isAssigned !== undefined) {
      constraints.push(where('isAssigned', '==', filters.isAssigned));
    }

    if (constraints.length > 0) {
      q = query(tasksCollection, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const tasks: VolunteerTask[] = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
    });

    return tasks;
  } catch (error) {
    throw error;
  }
};

// Get tasks assigned to a specific user
export const getUserTasks = async (userId: string) => {
  try {
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', userId));
    const querySnapshot = await getDocs(q);
    const tasks: VolunteerTask[] = [];

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
    });

    return tasks;
  } catch (error) {
    throw error;
  }
};

// Assign a task to a user
export const assignTaskToUser = async (taskId: string, userId: string) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      completionDate: serverTimestamp(),
      assignedTo: userId,
      isAssigned: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Mark a task as completed
// Update the completeTask function in firestore.ts
export const completeTask = async (taskId: string, userId: string, completionData: {
  imageUrl: string;
  summary: string;
  contactInfo: string;
  rating: number;
  feedback?: string;
  timeSpent: number;
}) => {
  try {
    // Update the task document
    const taskRef = doc(db, 'tasks', taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data() as VolunteerTask;
    const completedBy = taskData.completedBy || [];

    if (!completedBy.includes(userId)) {
      completedBy.push(userId);
    }

    await updateDoc(taskRef, {
      completedBy,
      updatedAt: serverTimestamp()
    });

    // Create a completion record
    const completion = {
      taskId,
      userId,
      completionDate: serverTimestamp(),
      imageUrl: completionData.imageUrl,
      summary: completionData.summary,
      contactInfo: completionData.contactInfo,
      rating: completionData.rating,
      feedback: completionData.feedback,
      timeSpent: completionData.timeSpent,
      createdAt: serverTimestamp()
    };

    const completionRef = await addDoc(collection(db, 'taskCompletions'), completion);
    return { id: completionRef.id, ...completion };
  } catch (error) {
    throw error;
  }
};

// Get nearby volunteer opportunities (for Bud and Bloom users)
// Get nearby volunteer opportunities (for Bud and Bloom users)
export const getNearbyOpportunities = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  userLevel: UserLevel
) => {
  try {
    // In a real implementation, we would use a spatial query
    // For simplicity, we'll get all tasks and filter them manually
    const tasks = await getTasks({
      isAssigned: false,
      requiredLevel: userLevel === 'Bloom' ? undefined : userLevel // Bloom users can see all opportunities
    });

    // Filter tasks by distance
    const nearbyTasks = tasks.filter(task => {
      // Check if task has coordinates
      if (!task.location?.coordinates?.latitude || !task.location?.coordinates?.longitude) {
        return false;
      }

      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        latitude,
        longitude,
        task.location.coordinates.latitude,
        task.location.coordinates.longitude
      );

      return distance <= radiusInKm;
    });

    return nearbyTasks;
  } catch (error) {
    throw error;
  }
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Get weekly tasks for a user based on their commitment level
export const getWeeklyTasks = async (userId: string, weeklyCommitment: number) => {
  try {
    // Get user profile to determine level and preferences
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const userLevel = userData.level as UserLevel;
    const preferences = userData.rankingPreferences;

    // Sort categories by user preference
    const sortedCategories = [
      { category: 'communityService', rank: preferences.communityService },
      { category: 'environmentalAction', rank: preferences.environmentalAction },
      { category: 'educationYouthSupport', rank: preferences.educationYouthSupport },
      { category: 'healthWellness', rank: preferences.healthWellness }
    ].sort((a, b) => a.rank - b.rank)
      .map(item => item.category);

    // Get unassigned tasks suitable for user's level
    const availableTasks = await getTasks({
      isAssigned: false,
      requiredLevel: userLevel
    });

    // Prioritize tasks based on user preferences
    const prioritizedTasks = availableTasks.sort((a, b) => {
      const categoryIndexA = sortedCategories.indexOf(a.category);
      const categoryIndexB = sortedCategories.indexOf(b.category);
      return categoryIndexA - categoryIndexB;
    });

    // Limit to weekly commitment number
    const tasksToAssign = prioritizedTasks.slice(0, weeklyCommitment);

    // Assign tasks to user
    for (const task of tasksToAssign) {
      if (task.id) {
        await assignTaskToUser(task.id, userId);
      }
    }

    return tasksToAssign;
  } catch (error) {
    throw error;
  }
};
// Add this function to app/lib/firebase/firestore.ts
export const addSeeds = async (userId: string, amount: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentSeeds = userData.seeds || 0;

    await updateDoc(userRef, {
      seeds: currentSeeds + amount,
      updatedAt: serverTimestamp()
    });

    return currentSeeds + amount;
  } catch (error) {
    console.error('Error adding seeds:', error);
    throw error;
  }
};
// Check weekly task completion and award seeds
export const checkWeeklyCompletion = async (userId: string) => {
  try {
    // Get user's assigned tasks
    const userTasks = await getUserTasks(userId);

    // Get user's completed tasks
    const completedTasks = userTasks.filter(task =>
      task.completedBy && task.completedBy.includes(userId)
    );

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
