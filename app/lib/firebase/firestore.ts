// app/lib/firebase/firestore.ts - UPDATED VERSION
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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { UserLevel } from './auth';

export interface VolunteerTask {
  id?: string;
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
  completionDate?: any;
  createdAt?: any;
  updatedAt?: any;
  createdBy?: string;
  isCustom?: boolean;
  status?: 'open' | 'scheduled' | 'in-progress' | 'paused' | 'completed';
  scheduledTime?: any;
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
  weekAssigned?: string; // Format: "YYYY-WW" (year-week)
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
  rating: number;
  feedback?: string;
  createdAt: any;
}

// Create a new volunteer task
export const createTask = async (taskData: Omit<VolunteerTask, 'id' | 'createdAt' | 'updatedAt' | 'completedBy'>, userId: string) => {
  try {
    const task = {
      ...taskData,
      createdBy: userId,
      completedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'tasks'), task);
    return { id: docRef.id, ...task };
  } catch (error) {
    throw error;
  }
};

// Get tasks based on filters
export const getTasks = async (filters: {
  category?: VolunteerTask['category'];
  locationType?: VolunteerTask['locationType'];
  requiredLevel?: UserLevel;
  isAssigned?: boolean;
  weekAssigned?: string;
}) => {
  try {
    const tasksCollection = collection(db, 'tasks');
    let q = query(tasksCollection);

    const constraints = [];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.locationType) {
      constraints.push(where('locationType', '==', filters.locationType));
    }

    if (filters.isAssigned !== undefined) {
      constraints.push(where('isAssigned', '==', filters.isAssigned));
    }

    if (filters.weekAssigned) {
      constraints.push(where('weekAssigned', '==', filters.weekAssigned));
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

// Get tasks assigned to a specific user for current week
export const getUserTasks = async (userId: string, weekKey?: string) => {
  try {
    const currentWeek = weekKey || getCurrentWeekKey();
    
    const q = query(
      collection(db, 'tasks'), 
      where('assignedTo', '==', userId),
      where('weekAssigned', '==', currentWeek)
    );
    
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
export const assignTaskToUser = async (taskId: string, userId: string, weekKey: string) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      assignedTo: userId,
      isAssigned: true,
      weekAssigned: weekKey,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Mark a task as completed
export const completeTask = async (taskId: string, userId: string, completionData: {
  imageUrl: string;
  summary: string;
  contactInfo: string;
  rating: number;
  feedback?: string;
  timeSpent: number;
}) => {
  try {
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
      status: 'completed',
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

// Get nearby volunteer opportunities
export const getNearbyOpportunities = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10,
  userLevel: UserLevel
) => {
  try {
    const tasks = await getTasks({
      isAssigned: false
    });

    const nearbyTasks = tasks.filter(task => {
      if (!task.location?.coordinates?.latitude || !task.location?.coordinates?.longitude) {
        return false;
      }

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
  const R = 6371;
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

// Helper function to get current week key (YYYY-WW format)
export const getCurrentWeekKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Get week number (simple calculation)
  const startOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
};

// Add seeds to user account
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
    const userTasks = await getUserTasks(userId);
    const completedTasks = userTasks.filter(task =>
      task.completedBy && task.completedBy.includes(userId)
    );

    const completionRatio = userTasks.length > 0 ? completedTasks.length / userTasks.length : 0;
    let seedsEarned = 0;

    if (completionRatio === 1) {
      seedsEarned = 5;
    } else if (completionRatio > 0) {
      seedsEarned = Math.floor(completionRatio * 5);
    }

    if (seedsEarned > 0) {
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