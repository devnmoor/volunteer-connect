// app/lib/firebase/tasksService.ts
import {
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase/config';
import { UserProfile } from '@/app/lib/firebase/auth';
import { VolunteerTask } from '@/app/lib/firebase/firestore';
import { generateWeeklyTasks, generateNearbyBusinessTask } from '@/app/lib/tasks/taskGenerator';
import { getNearbyPlaces } from '@/app/lib/location/locationService';

// Assign weekly tasks to a user based on their profile
export const assignWeeklyTasks = async (userId: string): Promise<VolunteerTask[]> => {
    try {
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            throw new Error('User not found');
        }

        const userProfile = userDoc.data() as UserProfile;
        const {
            weeklyCommitment,
            level: userLevel,
            rankingPreferences,
            location
        } = userProfile;

        // Check if user already has active tasks for this week
        const existingTasksQuery = query(
            collection(db, 'tasks'),
            where('assignedTo', '==', userId),
            where('isAssigned', '==', true)
        );

        const existingTasksSnapshot = await getDocs(existingTasksQuery);

        // If user already has tasks, return them
        if (!existingTasksSnapshot.empty) {
            const existingTasks: VolunteerTask[] = [];
            existingTasksSnapshot.forEach(doc => {
                existingTasks.push({ id: doc.id, ...doc.data() } as VolunteerTask);
            });
            return existingTasks;
        }

        // Create tasks based on user preferences
        let tasksToAssign: VolunteerTask[] = [];

        // First, try to generate location-based tasks if the user has location data
        if (userLevel !== 'Sprout' && location && location.latitude !== 0) {
            // Get nearby places
            const nearbyPlaces = await getNearbyPlaces(location, 2000, 10);

            // Generate tasks for some of the nearby places
            for (const place of nearbyPlaces.slice(0, 2)) { // Just use 2 places for now
                const businessTask = generateNearbyBusinessTask(
                    place.name,
                    place.type,
                    place.location,
                    userLevel
                );

                if (businessTask) {
                    tasksToAssign.push(businessTask);
                }
            }
        }

        // Generate additional random tasks to fulfill the user's weekly commitment
        const additionalTasksNeeded = weeklyCommitment - tasksToAssign.length;

        if (additionalTasksNeeded > 0) {
            const randomTasks = generateWeeklyTasks(
                additionalTasksNeeded,
                userLevel,
                location,
                rankingPreferences
            );

            tasksToAssign = [...tasksToAssign, ...randomTasks];
        }

        // Save tasks to Firestore and assign to user
        const batch = writeBatch(db);
        const assignedTasks: VolunteerTask[] = [];

        for (const task of tasksToAssign) {
            // Add the task to Firestore
            const taskRef = await addDoc(collection(db, 'tasks'), {
                ...task,
                assignedTo: userId,
                isAssigned: true,
                updatedAt: serverTimestamp()
            });

            // Add the id to the task object
            assignedTasks.push({
                id: taskRef.id,
                ...task,
                assignedTo: userId,
                isAssigned: true
            });
        }

        // Commit all the changes
        await batch.commit();

        return assignedTasks;
    } catch (error) {
        console.error('Error assigning weekly tasks:', error);
        throw error;
    }
};

// Reset weekly tasks for all users
export const resetWeeklyTasks = async (): Promise<void> => {
    try {
        // This would typically be called by a scheduled function
        // Get all assigned tasks
        const tasksQuery = query(
            collection(db, 'tasks'),
            where('isAssigned', '==', true)
        );

        const tasksSnapshot = await getDocs(tasksQuery);

        // Batch delete/update the tasks
        const batch = writeBatch(db);

        tasksSnapshot.forEach(taskDoc => {
            // Option 1: Delete the task
            // batch.delete(taskDoc.ref);

            // Option 2: Archive the task
            batch.update(taskDoc.ref, {
                isAssigned: false,
                isArchived: true,
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error resetting weekly tasks:', error);
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
        const categories = Object.entries(rankingPreferences)
            .sort(([, rankA], [, rankB]) => (rankA as number) - (rankB as number))
            .map(([category]) => {
                // Convert from camelCase to the category format in the database
                switch (category) {
                    case 'communityService': return 'communityService';
                    case 'environmentalAction': return 'environmentalAction';
                    case 'educationYouthSupport': return 'educationYouthSupport';
                    case 'healthWellness': return 'healthWellness';
                    default: return category;
                }
            });

        // Query for unassigned tasks suitable for the user's level
        // Prioritize the user's preferred categories
        let suggestedTasks: VolunteerTask[] = [];

        // Try to get tasks from each category in order of preference
        for (const category of categories) {
            if (suggestedTasks.length >= limit) break;

            const categoryQuery = query(
                collection(db, 'tasks'),
                where('category', '==', category),
                where('isAssigned', '==', false),
                where('requiredLevel', '==', userLevel)
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