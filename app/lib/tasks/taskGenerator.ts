// app/lib/tasks/taskGenerator.ts
import { UserLevel } from '../firebase/auth';
import { VolunteerTask } from '../firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

// Sample locations to use when precise location isn't available
const fallbackLocations = [
  { name: 'Local Community Center', latitude: 0, longitude: 0 },
  { name: 'Neighborhood Park', latitude: 0, longitude: 0 },
  { name: 'Public Library', latitude: 0, longitude: 0 },
  { name: 'Elementary School', latitude: 0, longitude: 0 },
  { name: 'Senior Center', latitude: 0, longitude: 0 },
  { name: 'Food Bank', latitude: 0, longitude: 0 },
  { name: 'Animal Shelter', latitude: 0, longitude: 0 },
  { name: 'Community Garden', latitude: 0, longitude: 0 },
];

// Task templates by category
const taskTemplates = {
  communityService: [
    {
      title: 'Help at a Local Food Bank',
      description: 'sort and package food donations to support families in need.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'Neighborhood Cleanup',
      description: 'join a team to pick up litter and beautify public spaces in your community.',
      estimatedTime: 90,
      locationType: 'inPerson',
    },
    {
      title: 'Senior Companion',
      description: 'spend time with senior citizens who may be experiencing isolation. Chat, play games, or help with simple tasks.',
      estimatedTime: 60,
      locationType: 'inPerson',
    },
    {
      title: 'Donation Drive Coordinator',
      description: 'organize a collection drive for clothes, books, or toys to donate to those in need.',
      estimatedTime: 180,
      locationType: 'remote',
    },
    {
      title: 'Community Event Volunteer',
      description: 'help set up, run, or clean up at a local community event or festival.',
      estimatedTime: 240,
      locationType: 'inPerson',
    },
  ],
  environmentalAction: [
    {
      title: 'Tree Planting Initiative',
      description: 'join a team to plant trees and improve the local ecosystem.',
      estimatedTime: 180,
      locationType: 'inPerson',
    },
    {
      title: 'Beach or Waterway Cleanup',
      description: 'help remove trash and plastic from beaches, rivers, or lakes to protect wildlife.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'Recycling Education Campaign',
      description: 'create and share information about proper recycling practices in your community.',
      estimatedTime: 90,
      locationType: 'remote',
    },
    {
      title: 'Community Garden Helper',
      description: 'assist with planting, weeding, and harvesting at a local community garden.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'Wildlife Habitat Improvement',
      description: 'help build or improve habitats for local wildlife, such as bird houses or butterfly gardens.',
      estimatedTime: 150,
      locationType: 'inPerson',
    },
  ],
  educationYouthSupport: [
    {
      title: 'Virtual Tutoring Session',
      description: 'provide one-on-one tutoring help for a student who needs assistance with schoolwork.',
      estimatedTime: 60,
      locationType: 'virtual',
    },
    {
      title: 'Reading Buddy',
      description: 'read with young children to help improve their literacy skills and foster a love of reading.',
      estimatedTime: 45,
      locationType: 'virtual',
    },
    {
      title: 'STEM Workshop Assistant',
      description: 'help run a workshop teaching science, technology, engineering, or math concepts to youth.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'After-School Program Helper',
      description: 'assist with activities, homework help, or supervision at an after-school program.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'College Application Mentor',
      description: 'help high school students navigate the college application process, essays, and scholarships.',
      estimatedTime: 90,
      locationType: 'virtual',
    },
  ],
  healthWellness: [
    {
      title: 'Wellness Check Caller',
      description: 'make phone calls to check on elderly or vulnerable community members.',
      estimatedTime: 60,
      locationType: 'remote',
    },
    {
      title: 'Health Fair Volunteer',
      description: 'assist with organization or activities at a community health fair.',
      estimatedTime: 180,
      locationType: 'inPerson',
    },
    {
      title: 'Meal Preparation Helper',
      description: 'prepare meals for those who are ill, elderly, or unable to cook for themselves.',
      estimatedTime: 120,
      locationType: 'inPerson',
    },
    {
      title: 'Mental Health Awareness Campaign',
      description: 'create and share resources about mental health awareness and support options.',
      estimatedTime: 90,
      locationType: 'remote',
    },
    {
      title: 'Fitness Buddy',
      description: 'accompany someone who needs motivation or assistance with physical activity.',
      estimatedTime: 60,
      locationType: 'inPerson',
    },
  ],
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
        locationType: 'inPerson',
      },
      {
        title: 'Coffee Grounds Recycling Program',
        description: 'coordinate with a local coffee shop to collect used coffee grounds for community garden composting.',
        category: 'environmentalAction',
        estimatedTime: 90,
        locationType: 'inPerson',
      },
    ],
  },
  {
    businessType: 'restaurant',
    tasks: [
      {
        title: 'Restaurant Food Donation Coordination',
        description: 'help coordinate the donation of unused food from restaurants to local shelters or food banks.',
        category: 'communityService',
        estimatedTime: 120,
        locationType: 'inPerson',
      },
      {
        title: 'Sustainable Restaurant Practices',
        description: 'work with local restaurants to implement more environmentally friendly practices like reducing single-use plastics.',
        category: 'environmentalAction',
        estimatedTime: 150,
        locationType: 'inPerson',
      },
    ],
  },
  {
    businessType: 'library',
    tasks: [
      {
        title: 'Library Reading Program',
        description: 'help organize or run reading programs for children at the local library.',
        category: 'educationYouthSupport',
        estimatedTime: 120,
        locationType: 'inPerson',
      },
      {
        title: 'Digital Literacy Workshops',
        description: 'assist seniors or other community members with technology skills at the local library.',
        category: 'educationYouthSupport',
        estimatedTime: 90,
        locationType: 'inPerson',
      },
    ],
  },
  {
    businessType: 'park',
    tasks: [
      {
        title: 'Park Cleanup Initiative',
        description: 'organize or participate in a cleanup day at a local park.',
        category: 'environmentalAction',
        estimatedTime: 120,
        locationType: 'inPerson',
      },
      {
        title: 'Nature Walk Guide',
        description: 'lead educational nature walks for community members at a local park.',
        category: 'educationYouthSupport',
        estimatedTime: 90,
        locationType: 'inPerson',
      },
    ],
  },
  {
    businessType: 'school',
    tasks: [
      {
        title: 'School Garden Project',
        description: 'help maintain or establish a garden at a local school to teach children about growing food.',
        category: 'environmentalAction',
        estimatedTime: 120,
        locationType: 'inPerson',
      },
      {
        title: 'After-School Tutoring',
        description: 'provide tutoring support to students after school hours.',
        category: 'educationYouthSupport',
        estimatedTime: 90,
        locationType: 'inPerson',
      },
    ],
  },
  {
    businessType: 'grocery store',
    tasks: [
      {
        title: 'Grocery Delivery for Seniors',
        description: 'coordinate with a local grocery store to help deliver groceries to elderly or disabled community members.',
        category: 'healthWellness',
        estimatedTime: 120,
        locationType: 'inPerson',
      },
      {
        title: 'Food Waste Reduction Program',
        description: 'work with a local grocery store to implement or improve food waste reduction and donation programs.',
        category: 'environmentalAction',
        estimatedTime: 150,
        locationType: 'inPerson',
      },
    ],
  },
];

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random task template by category
const getRandomTaskTemplate = (category: keyof typeof taskTemplates) => {
  return getRandomElement(taskTemplates[category]);
};

// Helper function to generate a variation of a task description
const generateTaskVariation = (description: string): string => {
  // Simple variations to make tasks feel more unique
  const introductions = [
    '',
    'We need your help to ',
    'An exciting opportunity to ',
    'Your community needs you to ',
    'Make a difference by helping to ',
    'Join others to ',
  ];

  const conclusion = [
    '',
    ' This is a great way to make a positive impact!',
    ' Your contribution will make a real difference.',
    ' This is perfect for someone with your interests!',
    ' This opportunity matches your volunteering goals.',
    ' Help create positive change through this activity.',
  ];

  return `${getRandomElement(introductions)}${description.replace(/\.$/, '')}${getRandomElement(conclusion)}`;
};

// Generate nearby business tasks based on location and business type
export const generateNearbyBusinessTask = (
  businessName: string,
  businessType: string,
  location: { latitude: number, longitude: number },
  userLevel: UserLevel
): VolunteerTask | null => {
  // Find matching business type or use default
  const businessTemplate = businessTaskTemplates.find(template =>
    businessType.toLowerCase().includes(template.businessType)
  ) || getRandomElement(businessTaskTemplates);

  if (!businessTemplate) return null;

  // Get a random task for this business type
  const taskTemplate = getRandomElement(businessTemplate.tasks);

  // Only include location for Bud and Bloom levels
  const taskLocation = (userLevel !== UserLevel.Sprout && location)
    ? {
      address: businessName,
      latitude: location.latitude,
      longitude: location.longitude,
    }
    : null; // Use null instead of undefined

  // Create the task with location null check
  return {
    title: taskTemplate.title.replace('a local', businessName),
    description: generateTaskVariation(taskTemplate.description.replace('a local', businessName)),
    category: taskTemplate.category as any,
    estimatedTime: taskTemplate.estimatedTime,
    locationType: taskTemplate.locationType as any,
    // Only include location if it exists
    ...(taskLocation ? { location: taskLocation } : {}),
    requiredLevel: userLevel,
    isAssigned: false,
    completedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};

// Generate a batch of random tasks based on user preferences
export const generateRandomTasks = (
  count: number,
  userLevel: UserLevel,
  userLocation?: { latitude: number, longitude: number },
  preferences?: { [key: string]: number } // Lower number = higher preference
): VolunteerTask[] => {
  const tasks: VolunteerTask[] = [];
  const categories = Object.keys(taskTemplates) as Array<keyof typeof taskTemplates>;

  // Sort categories by preference if provided
  let sortedCategories = [...categories];
  if (preferences) {
    sortedCategories.sort((a, b) =>
      (preferences[a] || 5) - (preferences[b] || 5)
    );
  }

  for (let i = 0; i < count; i++) {
    // Bias toward preferred categories, but still include some variety
    const usePreference = Math.random() < 0.7; // 70% chance to use preference
    const category = usePreference
      ? sortedCategories[i % sortedCategories.length]
      : getRandomElement(categories);

    // Get a random task template from the selected category
    const template = getRandomTaskTemplate(category);

    // Determine if this should be a location-based task
    const isLocationBased = template.locationType === 'inPerson' &&
      userLevel !== 'Bud' &&
      userLocation &&
      userLocation.latitude !== 0;

    // Create location data if applicable
    let location;
    if (isLocationBased) {
      // Add some randomness to the location to distribute tasks around the user
      const radiusKm = 5; // 5km radius
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * radiusKm;

      // Convert distance and angle to lat/lng offset
      // Rough approximation (1 degree latitude ≈ 111km)
      const latOffset = (randomDistance * Math.cos(randomAngle)) / 111;
      const lngOffset = (randomDistance * Math.sin(randomAngle)) /
        (111 * Math.cos(userLocation.latitude * Math.PI / 180));

      location = {
        address: getRandomElement(fallbackLocations).name,
        latitude: userLocation.latitude + latOffset,
        longitude: userLocation.longitude + lngOffset,
      };
    }

    // Create the task
    // Create the task
    // Create the task with null check for location
    tasks.push({
      title: template.title,
      description: generateTaskVariation(template.description),
      category: category as any,
      estimatedTime: template.estimatedTime,
      locationType: template.locationType as any,
      // If location is undefined, remove the field completely
      ...(location ? { location } : {}),
      requiredLevel: userLevel,
      isAssigned: false,
      completedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return tasks;
};

// Generate a weekly set of tasks for a user based on their preferences and commitment
export const generateWeeklyTasks = (
  weeklyCommitment: number,
  userLevel: UserLevel,
  userLocation?: { latitude: number, longitude: number },
  preferences?: { [key: string]: number }
): VolunteerTask[] => {
  return generateRandomTasks(
    weeklyCommitment,
    userLevel,
    userLocation,
    preferences
  );
};
