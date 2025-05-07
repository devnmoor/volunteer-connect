// app/lib/tasks/taskResources.ts
import { VolunteerTask } from '@/app/lib/firebase/firestore';

// Reference resource suggestions for tasks
export interface TaskResource {
  title: string;
  url: string;
  description: string;
}

// Generate resources based on task type and category
export const generateTaskResources = (task: VolunteerTask): TaskResource[] => {
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
  const categoryBasedResources: {[key: string]: TaskResource[]} = {
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
  const taskSpecificResources: {[key: string]: TaskResource[]} = {
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
    ],
    // Add more task-specific resources here
  };

  // Combine resources based on task properties
  let resources: TaskResource[] = [];

  // Add location-based resources
  if (task.locationType && locationBasedResources[task.locationType]) {
    resources = [...resources, ...locationBasedResources[task.locationType]];
  }

  // Add category-based resources
  if (task.category && categoryBasedResources[task.category]) {
    resources = [...resources, ...categoryBasedResources[task.category]];
  }

  // Add task-specific resources
  if (taskSpecificResources[task.title]) {
    resources = [...resources, ...taskSpecificResources[task.title]];
  }

  return resources;
};
