// app/api/admin/reset-user-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { forceResetUserTasks } from '@/app/lib/firebase/tasksService';

// API route to manually reset tasks for a specific user (admin function)
export async function POST(request: NextRequest) {
  try {
    const { userId, adminKey } = await request.json();
    
    // Verify admin access (you should implement proper admin authentication)
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`Admin resetting tasks for user: ${userId}`);
    
    // Reset tasks for the specific user
    const newTasks = await forceResetUserTasks(userId);
    
    return NextResponse.json({
      message: 'User tasks reset successfully',
      userId,
      newTasksCount: newTasks.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error in admin task reset:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to reset user tasks',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
