// app/lib/firebase/auth.ts
import { auth, db } from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

// Define user level types
export enum UserLevel {
  Sprout = 'Sprout',
  Bud = 'Bud',
  Bloom = 'Bloom'
}

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  age: number;
  country: string;
  state?: string;
  weeklyCommitment: number;
  volunteeringGoal: string;
  interests: string[];
  rankingPreferences: {
    communityService: number; // 1-4 ranking
    environmentalAction: number;
    educationYouthSupport: number;
    healthWellness: number;
  };
  level: UserLevel;
  seeds: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  completedTasks: number;
  createdAt: any;
  updatedAt: any;
  photoURL?: string;

  // Add ownedItems property
  ownedItems?: {
    plants: string[];
    accessories: string[];
    specials: string[];
  };

  // Add itemPlacements property for greenhouse locations
  itemPlacements?: {
    [itemId: string]: {
      room: string;
      position: {
        x: number;
        y: number;
      };
    };
  };
}

// Create a new user with email and password
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

// Create a user profile in Firestore
export const createUserProfile = async (user: User, profileData: Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt' | 'seeds' | 'completedTasks'>) => {
  try {
    // Create a base user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      seeds: 0,
      completedTasks: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...profileData
    };

    // Remove undefined fields (like state if it's not provided)
    const cleanedProfile = Object.fromEntries(
      Object.entries(userProfile).filter(([_, value]) => value !== undefined)
    );

    await setDoc(doc(db, 'users', user.uid), cleanedProfile);
    return userProfile;
  } catch (error) {
    throw error;
  }
};


// Get a user's profile from Firestore
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update a user's profile
export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Determine user level based on age
export const determineUserLevel = (age: number, hasGuardian: boolean = false): UserLevel => {
  if (age < 16) {
    return UserLevel.Sprout;
  } else if (age >= 16 && age < 21) {
    return hasGuardian ? UserLevel.Bloom : UserLevel.Bud;
  } else {
    return UserLevel.Bloom;
  }
};

// Add seeds to a user's account
export const addSeeds = async (uid: string, seeds: number) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProfile;
      await updateDoc(userRef, {
        seeds: userData.seeds + seeds,
        updatedAt: serverTimestamp()
      });
      return userData.seeds + seeds;
    }
    return null;
  } catch (error) {
    throw error;
  }
};