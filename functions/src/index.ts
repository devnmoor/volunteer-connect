// functions/src/index.ts - Firebase Cloud Functions
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { generateWeeklyTasks } from './taskGenerator';

admin.initializeApp();

// Scheduled function to run every Monday at 6 AM UTC
export const weeklyTaskAssignment = functions.pubsub
  .schedule('0 6 * * 1') // Cron: Every Monday at 6 AM UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting weekly task assignment...');

    try {
      const db = admin.firestore();
      const currentWeekStart = getWeekStart(new Date());
      
      // Get all users
      const usersSnapshot = await db.collection('users').get();
      const batch = db.batch();
      
      let successCount = 0;
      let errorCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        try {
          const userId = userDoc.id;
          const userData = userDoc.data();

          // Skip if user doesn't have required data
          if (!userData.weeklyCommitment || !userData.level) {
            console.log(`Skipping user ${userId}: missing commitment or level`);
            continue;
          }

          // Check if user already has tasks for this week
          const existingTasksQuery = await db.collection('tasks')
            .where('assignedTo', '==', userId)
            .where('weekAssigned', '==', currentWeekStart)
            .limit(1)
            .get();

          if (!existingTasksQuery.empty) {
            console.log(`User ${userId} already has tasks for this week`);
            continue;
          }

          // Archive previous week's tasks
          const oldTasksQuery = await db.collection('tasks')
            .where('assignedTo', '==', userId)
            .where('isAssigned', '==', true)
            .where('weekAssigned', '<', currentWeekStart)
            .get();

          oldTasksQuery.forEach(taskDoc => {
            batch.update(taskDoc.ref, {
              isAssigned: false,
              isArchived: true,
              archivedAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          });

          // Generate new tasks
          const newTasks = generateWeeklyTasks(
            userData.weeklyCommitment,
            userData.level,
            userData.location,
            userData.rankingPreferences
          );

          // Add new tasks to batch
          for (const task of newTasks) {
            const taskRef = db.collection('tasks').doc();
            batch.set(taskRef, {
              ...task,
              assignedTo: userId,
              isAssigned: true,
              weekAssigned: currentWeekStart,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
          }

          // Record the weekly assignment
          const assignmentRef = db.collection('weeklyAssignments').doc();
          batch.set(assignmentRef, {
            userId,
            weekStart: currentWeekStart,
            tasksAssigned: userData.weeklyCommitment,
            assignedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          successCount++;
          
        } catch (userError) {
          console.error(`Error processing user ${userDoc.id}:`, userError);
          errorCount++;
        }
      }

      // Commit all changes
      await batch.commit();

      console.log(`Weekly task assignment completed. Success: ${successCount}, Errors: ${errorCount}`);
      
      // Optional: Log to analytics or send notifications
      await db.collection('systemLogs').add({
        type: 'weeklyTaskAssignment',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        success: successCount,
        errors: errorCount,
        weekStart: currentWeekStart
      });

      return { success: successCount, errors: errorCount };
      
    } catch (error) {
      console.error('Weekly task assignment failed:', error);
      
      // Log the error
      await admin.firestore().collection('systemLogs').add({
        type: 'weeklyTaskAssignmentError',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        error: error.message
      });
      
      throw error;
    }
  });

// Manual trigger for testing (HTTP function)
export const triggerWeeklyTasks = functions.https.onCall(async (data, context) => {
  // Only allow authenticated admin users
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can trigger this function');
  }

  try {
    // Run the same logic as the scheduled function
    const result = await weeklyTaskAssignment.run(null);
    return { success: true, result };
  } catch (error) {
    console.error('Manual trigger failed:', error);
    throw new functions.https.HttpsError('internal', 'Task assignment failed');
  }
});

// Function to check and award weekly completion seeds
export const checkWeeklyCompletion = functions.pubsub
  .schedule('0 23 * * 0') // Every Sunday at 11 PM UTC (end of week)
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting weekly completion check...');

    try {
      const db = admin.firestore();
      const currentWeekStart = getWeekStart(new Date());
      
      // Get all weekly assignments for this week
      const assignmentsSnapshot = await db.collection('weeklyAssignments')
        .where('weekStart', '==', currentWeekStart)
        .get();

      const batch = db.batch();
      let awardCount = 0;

      for (const assignmentDoc of assignmentsSnapshot.docs) {
        const assignment = assignmentDoc.data();
        const userId = assignment.userId;

        try {
          // Get user's tasks for this week
          const tasksSnapshot = await db.collection('tasks')
            .where('assignedTo', '==', userId)
            .where('weekAssigned', '==', currentWeekStart)
            .get();

          if (tasksSnapshot.empty) continue;

          // Count completed tasks
          let completedCount = 0;
          tasksSnapshot.forEach(taskDoc => {
            const task = taskDoc.data();
            if (task.completedBy && task.completedBy.includes(userId)) {
              completedCount++;
            }
          });

          const totalTasks = tasksSnapshot.size;
          const completionRatio = completedCount / totalTasks;
          let seedsAwarded = 0;

          // Award seeds based on completion
          if (completionRatio === 1) {
            seedsAwarded = 5; // All tasks completed
          } else if (completionRatio >= 0.8) {
            seedsAwarded = 3; // 80%+ completion
          } else if (completionRatio >= 0.5) {
            seedsAwarded = 1; // 50%+ completion
          }

          if (seedsAwarded > 0) {
            // Get current user data
            const userDoc = await db.collection('users').doc(userId).get();
            const currentSeeds = userDoc.data()?.seeds || 0;

            // Award seeds
            batch.update(db.collection('users').doc(userId), {
              seeds: currentSeeds + seedsAwarded,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Log the completion
            const completionLogRef = db.collection('weeklyCompletions').doc();
            batch.set(completionLogRef, {
              userId,
              weekStart: currentWeekStart,
              tasksCompleted: completedCount,
              totalTasks: totalTasks,
              completionRatio,
              seedsAwarded,
              awardedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            awardCount++;
          }

        } catch (userError) {
          console.error(`Error checking completion for user ${userId}:`, userError);
        }
      }

      await batch.commit();
      console.log(`Weekly completion check completed. Awards given to ${awardCount} users.`);

      return { awarded: awardCount };
      
    } catch (error) {
      console.error('Weekly completion check failed:', error);
      throw error;
    }
  });

// Utility function
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Task generator function (simplified version)
function generateWeeklyTasks(
  weeklyCommitment: number,
  userLevel: string,
  location?: any,
  preferences?: any
): any[] {
  // This would import from your existing task generator
  // For now, returning a simple structure
  const tasks = [];
  
  for (let i = 0; i < weeklyCommitment; i++) {
    tasks.push({
      title: `Weekly Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      category: 'communityService',
      estimatedTime: 60,
      locationType: 'remote',
      requiredLevel: userLevel,
      completedBy: [],
      status: 'open'
    });
  }
  
  return tasks;
}