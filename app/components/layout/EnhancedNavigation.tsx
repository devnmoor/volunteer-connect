// app/components/layout/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { getUserProfile, UserProfile } from '@/app/lib/firebase/auth';

const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
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
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-green-600">Volunteer Connect</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/dashboard"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              
              <Link
                href="/history"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/history') 
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                History
              </Link>
              
              <Link
                href="/greenhouse"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/greenhouse') 
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Greenhouse
              </Link>
              
              <Link
                href="/store"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/store') 
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Store
              </Link>
              
              <Link
                href="/profile"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-green-100 text-green-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Profile
              </Link>
            </div>
          )}
          
          {/* Right side - User account or Sign In/Up */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Seeds Counter */}
                <div className="bg-green-50 rounded-full px-3 py-1 flex items-center">
                  <img 
                    src="/images/seed-icon.png" 
                    alt="Seeds" 
                    className="w-4 h-4 mr-1"
                  />
                  <span className="font-medium text-green-700">{profile?.seeds || 0}</span>
                </div>
                
                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center rounded-full bg-gray-100 p-1 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                      {profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  </button>
                  
                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Your Profile
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => {
                          auth.signOut();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/auth/sign-in"
                  className="rounded-full px-4 py-2 text-sm font-medium text-green-600 border border-green-600 hover:bg-green-50"
                >
                  Sign In
                </Link>
                
                <Link
                  href="/auth/sign-up"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-white border-t border-gray-100">
          {user ? (
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/dashboard"
                className={`block rounded-full px-4 py-2 text-sm font-medium ${
                  isActive('/dashboard') ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              
              <Link
                href="/history"
                className={`block rounded-full px-4 py-2 text-sm font-medium ${
                  isActive('/history') ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                History
              </Link>
              
              <Link
                href="/greenhouse"
                className={`block rounded-full px-4 py-2 text-sm font-medium ${
                  isActive('/greenhouse') ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Greenhouse
              </Link>
              
              <Link
                href="/store"
                className={`block rounded-full px-4 py-2 text-sm font-medium ${
                  isActive('/store') ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Store
              </Link>
              
              <Link
                href="/profile"
                className={`block rounded-full px-4 py-2 text-sm font-medium ${
                  isActive('/profile') ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              
              <div className="pt-2 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left rounded-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 flex flex-col space-y-2">
              <Link
                href="/auth/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-center text-green-600 border border-green-600 hover:bg-green-50"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/sign-up"
                className="rounded-full px-4 py-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-green-700"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;