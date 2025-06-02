// app/lib/firebase/tasksService.ts - SAFER VERSION with better error handling
import {
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    writeBatch,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import { UserProfile } from '@/app/lib/firebase/auth';
import { VolunteerTask, getCurrentWeekKey } from '@/app/lib/firebase/firestore';
import { generateWeeklyTasks, generateNearbyBusinessTask } from '@/app/lib/tasks/taskGenerator';
import { getNearbyPlaces } from '@/app/lib/location/locationService';

// Helper function to clean task data before saving to Firestore
const cleanTaskData = (task: any): any => {
  const cleanedTask: any = {
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
  if (task.location && 
      task.location.address && 
      task.location.coordinates &&
      typeof task.location.coordinates.latitude === 'number' &&
      typeof task.location.coordinates.longitude === 'number' &&
      !isNaN(task.location.coordinates.latitude) &&
      !isNaN(task.location.coordinates.longitude)) {
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

// Check if user needs new weekly tasks and assign them
export const checkAndAssignWeeklyTasks = async (userId: string): Promise<VolunteerTask[]> => {
    try {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid user ID provided');
        }

        const currentWeek = getCurrentWeekKey();
        
        // Check if user already has tasks for this week
        const existingTasksQuery = query(
            collection(db, 'tasks'),
            where('assignedTo', '==', userId),
            where('weekAssigned', '==', currentWeek)
        );

        const existingTasksSnapshot = await getDocs(existingTasksQuery);

        // If user already has tasks for this week, return them
        if (!existingTasksSnapshot.empty) {
            const existingTasks: VolunteerTask[] = [];
            existingTasksSnapshot.forEach(doc => {
                existingTasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
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

// Assign weekly tasks to a user based on their profile
export const assignWeeklyTasks = async (userId: string): Promise<VolunteerTask[]> => {
    try {
        console.log(`Starting task assignment for user: ${userId}`);
        
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const userProfile = userDoc.data() as UserProfile;
        const {
            weeklyCommitment = 1, // Default to 1 if not set
            level: userLevel = 'Sprout', // Default level
            rankingPreferences = {}, // Default empty preferences
            location
        } = userProfile;

        const currentWeek = getCurrentWeekKey();
        console.log(`Assigning ${weeklyCommitment} tasks for user level ${userLevel} for week ${currentWeek}`);

        // Create tasks based on user preferences
        let tasksToAssign: VolunteerTask[] = [];

        // First, try to generate location-based tasks if the user has location data
        if (userLevel !== 'Sprout' && 
            location && 
            typeof location.latitude === 'number' && 
            typeof location.longitude === 'number' &&
            !isNaN(location.latitude) && 
            !isNaN(location.longitude) &&
            location.latitude !== 0) {
            
            try {
                console.log(`Generating location-based tasks for coordinates: ${location.latitude}, ${location.longitude}`);
                
                // Get nearby places
                const nearbyPlaces = await getNearbyPlaces(location, 2000, 10);
                console.log(`Found ${nearbyPlaces.length} nearby places`);

                // Generate tasks for some of the nearby places
                for (const place of nearbyPlaces.slice(0, Math.min(2, weeklyCommitment))) {
                    const businessTask = generateNearbyBusinessTask(
                        place.name,
                        place.type,
                        place.location,
                        userLevel
                    );

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
            const randomTasks = generateWeeklyTasks(
                additionalTasksNeeded,
                userLevel,
                location,
                rankingPreferences
            );

            tasksToAssign = [...tasksToAssign, ...randomTasks];
            console.log(`Generated ${randomTasks.length} random tasks`);
        }

        console.log(`Total tasks to assign: ${tasksToAssign.length}`);

        // Save tasks to Firestore using individual addDoc calls instead of batch
        // This avoids potential batch write issues
        const assignedTasks: VolunteerTask[] = [];

        for (let i = 0; i < tasksToAssign.length; i++) {
            const task = tasksToAssign[i];
            
            try {
                // Clean the task data to remove any undefined values
                const cleanedTask = cleanTaskData({
                    ...task,
                    assignedTo: userId,
                    isAssigned: true,
                    weekAssigned: currentWeek,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                console.log(`Saving task ${i + 1}: ${cleanedTask.title}`);

                // Use addDoc for individual task creation
                const taskRef = await addDoc(collection(db, 'tasks'), cleanedTask);

                // Add the id to the task object for return
                assignedTasks.push({
                    id: taskRef.id,
                    ...cleanedTask
                } as VolunteerTask);

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

// Reset weekly tasks for all users (called by weekly cron job)
export const resetWeeklyTasksForAllUsers = async (): Promise<void> => {
    try {
        console.log('Starting weekly task reset for all users...');
        
        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        console.log(`Found ${usersSnapshot.docs.length} users to process`);
        
        // Process users in smaller batches to avoid timeout
        const batchSize = 10;
        const userBatches = [];
        
        for (let i = 0; i < usersSnapshot.docs.length; i += batchSize) {
            userBatches.push(usersSnapshot.docs.slice(i, i + batchSize));
        }
        
        let totalUsersProcessed = 0;
        
        for (const userBatch of userBatches) {
            console.log(`Processing batch of ${userBatch.length} users...`);
            
            // Archive old tasks for this batch
            for (const userDoc of userBatch) {
                const userId = userDoc.id;
                
                try {
                    // Archive old tasks for this user
                    const oldTasksQuery = query(
                        collection(db, 'tasks'),
                        where('assignedTo', '==', userId),
                        where('isAssigned', '==', true)
                    );
                    
                    const oldTasksSnapshot = await getDocs(oldTasksQuery);
                    
                    // Update old tasks individually
                    for (const taskDoc of oldTasksSnapshot.docs) {
                        try {
                            await updateDoc(taskDoc.ref, {
                                isAssigned: false,
                                isArchived: true,
                                updatedAt: serverTimestamp()
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
            for (const userDoc of userBatch) {
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

// Get tasks that are suitable for a user based on their level and preferences
export const getSuggestedTasks = async (
    userId: string,
    limit: number = 10
): Promise<VolunteerTask[]> => {
    try {
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const userProfile = userDoc.data() as UserProfile;
        const { level: userLevel, rankingPreferences } = userProfile;

        // Convert ranking preferences to categories sorted by preference
        const categories = Object.entries(rankingPreferences || {})
            .sort(([, rankA], [, rankB]) => (rankA as number) - (rankB as number))
            .map(([category]) => {
                switch (category) {
                    case 'communityService': return 'communityService';
                    case 'environmentalAction': return 'environmentalAction';
                    case 'educationYouthSupport': return 'educationYouthSupport';
                    case 'healthWellness': return 'healthWellness';
                    default: return category;
                }
            });

        // Query for unassigned tasks suitable for the user's level
        let suggestedTasks: VolunteerTask[] = [];

        // Try to get tasks from each category in order of preference
        for (const category of categories) {
            if (suggestedTasks.length >= limit) break;

            const categoryQuery = query(
                collection(db, 'tasks'),
                where('category', '==', category),
                where('isAssigned', '==', false)
            );

            const categorySnapshot = await getDocs(categoryQuery);

            categorySnapshot.forEach(doc => {
                if (suggestedTasks.length < limit) {
                    suggestedTasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
                }
            });
        }

        // If we still don't have enough tasks, generate some on the fly
        if (suggestedTasks.length < limit) {
            const additionalTasksNeeded = limit - suggestedTasks.length;

            // Get user location if available
            const location = userProfile.location;

            // Generate random tasks
            const randomTasks = generateWeeklyTasks(
                additionalTasksNeeded,
                userLevel,
                location,
                rankingPreferences
            );

            // We don't save these to Firestore yet - they're just suggestions
            suggestedTasks = [...suggestedTasks, ...randomTasks];
        }

        return suggestedTasks;
    } catch (error) {
        console.error('Error getting suggested tasks:', error);
        throw error;
    }
};

// Force reset tasks for a specific user (admin function)
export const forceResetUserTasks = async (userId: string): Promise<VolunteerTask[]> => {
    try {
        console.log(`Force resetting tasks for user: ${userId}`);
        
        // Archive current tasks
        const currentTasksQuery = query(
            collection(db, 'tasks'),
            where('assignedTo', '==', userId),
            where('isAssigned', '==', true)
        );
        
        const currentTasksSnapshot = await getDocs(currentTasksQuery);
        
        // Update tasks individually instead of using batch
        for (const taskDoc of currentTasksSnapshot.docs) {
            try {
                await updateDoc(taskDoc.ref, {
                    isAssigned: false,
                    isArchived: true,
                    updatedAt: serverTimestamp()
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