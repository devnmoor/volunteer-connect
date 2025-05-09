// app/components/layout/EnhancedNavigation.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';
import ProfilePictureModal from './ProfilePictureModal';

const EnhancedNavigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get user and profile data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        try {
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setProfile(userProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Check if current path is active
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // Handle hover effect for nav items
  const handleItemHover = (isHovered: boolean) => {
    setIsLarge(isHovered);
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className={`transition-all duration-300 overflow-hidden ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}`}>
                <img 
                  src="/images/logo.png" 
                  alt="Volunteer Connect Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-2">
                <span className={`font-semibold transition-all duration-300 ${
                  isLarge ? 'text-xl text-green-700' : 'text-lg text-green-600'
                }`}>Volunteer Connect</span>
                <div className={`h-0.5 bg-green-500 transition-all duration-300 ${
                  isLarge ? 'w-full' : 'w-0'
                }`}></div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {[
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/history', label: 'History' },
                { path: '/greenhouse', label: 'Greenhouse' },
                { path: '/store', label: 'Store' },
                { path: '/profile', label: 'Profile' }
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onMouseEnter={() => handleItemHover(true)}
                  onMouseLeave={() => handleItemHover(false)}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-white bg-green-600'
                      : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 right-0 mx-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center">
                {/* Seeds Counter */}
                <div className="flex items-center mr-4 px-3 py-1 bg-green-50 rounded-full">
                  <img 
                    src="/images/seed-icon.png" 
                    alt="Seeds" 
                    className="w-5 h-5 mr-1"
                  />
                  <span className="font-medium text-green-700">{profile?.seeds || 0}</span>
                </div>
                
                {/* User Profile */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                    profile?.photoURL ? '' : `${
                      profile?.level === 'Sprout' ? 'bg-green-400' :
                      profile?.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'
                    } text-white font-bold`
                  }`}>
                    {profile?.photoURL ? (
                      <img 
                        src={profile.photoURL} 
                        alt={profile.displayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'
                    )}
                  </div>
                  
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {profile?.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">{profile?.level || 'Volunteer'}</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                >
                  Sign In
                </Link>
                
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 md:hidden"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d={isOpen 
                    ? "M6 18L18 6M6 6l12 12" 
                    : "M4 6h16M4 12h16M4 18h16"
                  } 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white shadow-inner">
          {user ? (
            <>
              {/* User profile info for mobile */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden mr-3 ${
                  profile?.photoURL ? '' : `${
                    profile?.level === 'Sprout' ? 'bg-green-400' :
                    profile?.level === 'Bud' ? 'bg-green-600' : 'bg-green-800'
                  } text-white font-bold`
                }`}>
                  {profile?.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {profile?.displayName || user.email?.split('@')[0]}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">{profile?.level || 'Volunteer'}</span>
                    <div className="flex items-center">
                      <img 
                        src="/images/seed-icon.png" 
                        alt="Seeds" 
                        className="w-4 h-4 mr-1"
                      />
                      {profile?.seeds || 0}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setIsOpen(false);
                  }}
                  className="ml-auto p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Navigation links for mobile */}
              {[
                { path: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { path: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { path: '/greenhouse', label: 'Greenhouse', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                { path: '/store', label: 'Store', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                { path: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-md ${
                    isActive(item.path)
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
              
              {/* Sign out button for mobile */}
              <button
                onClick={() => {
                  auth.signOut();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-left text-red-600 rounded-md hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 pb-4 space-y-2">
              <Link
                href="/auth/sign-in"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50"
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/sign-up"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* ProfilePictureModal Component */}
      {showProfileModal && (
        <ProfilePictureModal onClose={() => setShowProfileModal(false)} />
      )}
    </nav>
  );
};

export default EnhancedNavigation;