// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, storage, db } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile, UserLevel, updateUserProfile } from '@/app/lib/firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import ShareProfile from '@/app/components/profile/ShareProfile';
import UserLevelSettings from '@/app/components/profile/UserLevelSettings';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'stats', 'settings'
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        totalHours: 0,
        favCategory: '',
        seeds: 0
    });

    // Profile form state
    const [displayName, setDisplayName] = useState('');
    const [volunteeringGoal, setVolunteeringGoal] = useState('');
    const [weeklyCommitment, setWeeklyCommitment] = useState(1);
    const [interests, setInterests] = useState<string[]>([]);
    const [editingInterests, setEditingInterests] = useState<string[]>([]);

    // Profile image state
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Interest options
    const interestOptions = ['STEM', 'Art', 'Environment', 'Animals', 'Education', 'Sports', 'Technology', 'Music', 'Health', 'Community'];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    // Get user profile
                    const userProfile = await getUserProfile(user.uid);
                    if (userProfile) {
                        setProfile(userProfile);

                        // Set form state
                        setDisplayName(userProfile.displayName || '');
                        setVolunteeringGoal(userProfile.volunteeringGoal || '');
                        setWeeklyCommitment(userProfile.weeklyCommitment || 1);
                        setInterests(userProfile.interests || []);
                        setEditingInterests(userProfile.interests || []);
                        setProfileImage(userProfile.photoURL || null);

                        // Fetch stats
                        await fetchUserStats(user.uid);
                    } else {
                        router.push('/auth/onboarding');
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push('/auth/sign-in');
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Fetch user's volunteering statistics
    const fetchUserStats = async (userId: string) => {
        try {
            // Get completed tasks
            const tasksQuery = query(
                collection(db, 'tasks'),
                where('completedBy', 'array-contains', userId)
            );

            const tasksSnapshot = await getDocs(tasksQuery);
            const completedTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Calculate total time spent (in hours)
            const totalMinutes = completedTasks.reduce((total, task) => {
                return total + (task.timeSpent || 0);
            }, 0);

            const totalHours = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal

            // Find favorite category
            const categories: { [key: string]: number } = {};
            completedTasks.forEach(task => {
                const category = task.category;
                if (category) {
                    categories[category] = (categories[category] || 0) + 1;
                }
            });

            let favCategory = '';
            let maxCount = 0;

            Object.entries(categories).forEach(([category, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    favCategory = category;
                }
            });

            // Format favorite category for display
            const formatCategory = (category: string) => {
                switch (category) {
                    case 'communityService': return 'Community Service';
                    case 'environmentalAction': return 'Environmental Action';
                    case 'educationYouthSupport': return 'Education & Youth';
                    case 'healthWellness': return 'Health & Wellness';
                    default: return category;
                }
            };

            // Get all assigned tasks
            const allTasksQuery = query(
                collection(db, 'tasks'),
                where('assignedTo', '==', userId)
            );

            const allTasksSnapshot = await getDocs(allTasksQuery);

            setStats({
                totalTasks: allTasksSnapshot.size,
                completedTasks: completedTasks.length,
                totalHours: totalHours,
                favCategory: formatCategory(favCategory),
                seeds: profile?.seeds || 0
            });

        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    // Handle profile image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            setIsUploading(true);
            setUploadError(null);

            try {
                // Show preview immediately for better UX
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProfileImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);

                // Upload to Firebase
                const storageRef = ref(storage, `profile-pictures/${user.uid}`);
                await uploadBytes(storageRef, file);

                // Get the download URL
                const downloadURL = await getDownloadURL(storageRef);

                // Update user profile in Firestore
                await updateDoc(doc(db, 'users', user.uid), {
                    photoURL: downloadURL
                });

                // Update local profile state
                if (profile) {
                    setProfile({
                        ...profile,
                        photoURL: downloadURL
                    });
                }
            } catch (error: any) {
                console.error('Error in upload process:', error);
                setUploadError('Failed to upload image. Please try again.');
                // Revert to previous state
                setProfileImage(profile?.photoURL || null);
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Handle profile image removal
    const handleRemoveImage = async () => {
        if (!user) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            // Delete image from storage
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            try {
                await deleteObject(storageRef);
            } catch (error) {
                // Ignore if file doesn't exist
                console.log('No existing profile image to delete');
            }

            // Update user profile in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                photoURL: null
            });

            setProfileImage(null);

            // Update local profile state
            if (profile) {
                setProfile({
                    ...profile,
                    photoURL: null
                });
            }
        } catch (error: any) {
            console.error('Error removing image:', error);
            setUploadError('Failed to remove image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle interest toggle
    const toggleInterest = (interest: string) => {
        setEditingInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    // Save profile changes
    const handleSaveProfile = async () => {
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            // Update profile in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                displayName,
                volunteeringGoal,
                weeklyCommitment,
                interests: editingInterests,
                updatedAt: new Date()
            });

            // Update local state
            if (profile) {
                setProfile({
                    ...profile,
                    displayName,
                    volunteeringGoal,
                    weeklyCommitment,
                    interests: editingInterests
                });
            }

            // Update form state
            setInterests(editingInterests);

            setSuccess('Profile updated successfully');
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    // Handle level change
    const handleLevelChange = (newLevel: UserLevel) => {
        if (profile) {
            setProfile({
                ...profile,
                level: newLevel
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Profile Picture */}
                    <div className="relative">
                        <div
                            className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                            onMouseEnter={() => !isUploading && document.getElementById('profileImageActions')?.classList.remove('opacity-0')}
                            onMouseLeave={() => !isUploading && document.getElementById('profileImageActions')?.classList.add('opacity-0')}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={profile?.displayName || 'Profile'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className={`h-full w-full flex items-center justify-center font-bold text-4xl text-white ${profile?.level === 'Sprout' ? 'bg-green-400' :
                                        profile?.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'
                                    }`}>
                                    {profile?.displayName.charAt(0) || 'U'}
                                </div>
                            )}

                            {/* Profile Picture Actions Overlay */}
                            {!isUploading && (
                                <div
                                    id="profileImageActions"
                                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 transition-opacity duration-200"
                                >
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-white hover:text-green-300 mb-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>

                                    {profileImage && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="text-white hover:text-red-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Loading overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                            <img
                                src={`/images/${profile?.level.toLowerCase()}-badge.png`}
                                alt={`${profile?.level} Badge`}
                                className="h-10 w-10"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{profile?.displayName}</h1>
                                <p className="text-gray-600">{profile?.level} Level Volunteer</p>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2">
                                <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                                    <img
                                        src="/images/seed-icon.png"
                                        alt="Seeds"
                                        className="h-5 w-5 mr-1"
                                    />
                                    <span className="font-medium text-green-800">{profile?.seeds || 0} seeds</span>
                                </div>

                                <ShareProfile profile={profile!} userId={user.uid} />
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                                {uploadError}
                            </div>
                        )}

                        {error && (
                            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                                {success}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'profile'
                                ? 'text-green-700 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'stats'
                                ? 'text-green-700 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Stats
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'settings'
                                ? 'text-green-700 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Settings
                    </button>
                </div>

                <div className="p-6">
                    {/* Profile Content */}
                    {activeTab === 'profile' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>

                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setDisplayName(profile?.displayName || '');
                                                setVolunteeringGoal(profile?.volunteeringGoal || '');
                                                setWeeklyCommitment(profile?.weeklyCommitment || 1);
                                                setEditingInterests(profile?.interests || []);
                                            }}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Display Name</h3>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{profile?.displayName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                                        <p className="text-gray-900">{profile?.email}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Age</h3>
                                        <p className="text-gray-900">{profile?.age}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Country</h3>
                                        <p className="text-gray-900">{profile?.country} {profile?.state && `(${profile.state})`}</p>
                                    </div>
                                </div>

                                {/* Volunteering Details */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Volunteering Goal</h3>
                                    {isEditing ? (
                                        <textarea
                                            value={volunteeringGoal}
                                            onChange={(e) => setVolunteeringGoal(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md h-24"
                                            placeholder="What are your volunteering goals?"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile?.volunteeringGoal}</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Weekly Commitment</h3>
                                    {isEditing ? (
                                        <div className="flex items-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setWeeklyCommitment(num)}
                                                    className={`w-10 h-10 rounded-full ${weeklyCommitment === num
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">{profile?.weeklyCommitment} tasks per week</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Interests</h3>
                                    {isEditing ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                            {interestOptions.map((interest) => (
                                                <button
                                                    key={interest}
                                                    type="button"
                                                    onClick={() => toggleInterest(interest)}
                                                    className={`p-3 rounded-md ${editingInterests.includes(interest)
                                                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                                                        : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {interest}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile?.interests && profile.interests.length > 0 ? (
                                                profile.interests.map((interest) => (
                                                    <span key={interest} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                        {interest}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No interests selected</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category Preferences</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                                                <h4 className="font-medium text-sm">Community Service</h4>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${100 - profile?.rankingPreferences?.communityService * 20}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                                <h4 className="font-medium text-sm">Environmental Action</h4>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${100 - profile?.rankingPreferences?.environmentalAction * 20}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                                <h4 className="font-medium text-sm">Education & Youth</h4>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${100 - profile?.rankingPreferences?.educationYouthSupport * 20}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                                <h4 className="font-medium text-sm">Health & Wellness</h4>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${100 - profile?.rankingPreferences?.healthWellness * 20}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Content */}
                    {activeTab === 'stats' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Stats</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Tasks Completed</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.completedTasks}</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Total Tasks</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.totalTasks}</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Hours Volunteered</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.totalHours}</p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">Seeds Earned</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.seeds}</p>
                                </div>
                            </div>

                            <div className="bg-white border rounded-lg p-6 mb-6">
                                <h3 className="font-medium text-lg mb-4">Your Volunteering Summary</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Completion Rate</h4>
                                        <div className="h-4 bg-gray-200 rounded-full mt-1">
                                            <div
                                                className="h-full bg-green-600 rounded-full"
                                                style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stats.totalTasks > 0
                                                ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% of assigned tasks completed`
                                                : 'No tasks assigned yet'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Favorite Category</h4>
                                        <p className="text-green-800 font-medium">{stats.favCategory || 'None yet'}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Level Progress</h4>
                                        <div className="h-4 bg-gray-200 rounded-full mt-1">
                                            <div
                                                className={`h-full rounded-full ${profile?.level === 'Sprout' ? 'bg-green-400 w-1/3' :
                                                        profile?.level === 'Bud' ? 'bg-green-600 w-2/3' : 'bg-green-800 w-full'
                                                    }`}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Sprout</span>
                                            <span>Bud</span>
                                            <span>Bloom</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Level Information</h3>
                                <p className="text-sm text-gray-700 mb-2">
                                    Your current level is <span className="font-medium">{profile?.level}</span>.
                                </p>
                                <p className="text-sm text-gray-700">
                                    {profile?.level === 'Sprout'
                                        ? 'As a Sprout, you receive weekly assigned tasks based on your interests. Complete tasks to earn seeds and advance to the Bud level.'
                                        : profile?.level === 'Bud'
                                            ? 'As a Bud, you can choose your own tasks and connect with other volunteers in your area. Keep volunteering to reach the Bloom level!'
                                            : 'As a Bloom, you can create and host volunteer opportunities, as well as mentor others. You\'ve reached the highest level!'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Settings Content */}
                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>

                            {/* Volunteering Level Settings */}
                            <UserLevelSettings
                                profile={profile!}
                                userId={user.uid}
                                onLevelChanged={handleLevelChange}
                            />

                            {/* Other settings sections could be added here */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-green-800 mb-4">Weekly Task Assignment</h2>

                                <div className="mb-4">
                                    <p className="text-gray-600 mb-2">
                                        You currently receive {profile?.weeklyCommitment} tasks per week.
                                    </p>

                                    <div className="bg-green-50 p-3 rounded-md">
                                        <p className="text-sm text-green-800">
                                            <span className="font-medium">Note:</span> Tasks are automatically assigned each week based on your preferences and level.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;