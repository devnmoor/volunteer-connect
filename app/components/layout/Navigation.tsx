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
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold text-green-600">Volunteer Connect</span>
              </Link>
            </div>
            
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-400'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  href="/history"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/history')
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-400'
                  }`}
                >
                  History
                </Link>
                
                <Link
                  href="/greenhouse"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/greenhouse')
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-400'
                  }`}
                >
                  Greenhouse
                </Link>
                
                <Link
                  href="/store"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/store')
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-400'
                  }`}
                >
                  Store
                </Link>
                
                <Link
                  href="/profile"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/profile')
                      ? 'text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-400'
                  }`}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="hidden sm:flex items-center">
                <div className="flex items-center">
                  <img 
                    src="/images/seed-icon.png" 
                    alt="Seeds" 
                    className="w-5 h-5 mr-1"
                  />
                  <span className="font-medium text-green-600 mr-4">{profile?.seeds || 0}</span>
                </div>
                
                <div className="relative">
                  <button
                    className="flex items-center"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      profile?.level === 'Sapling' ? 'bg-green-400' :
                      profile?.level === 'Sprout' ? 'bg-green-600' : 'bg-green-800'
                    } text-white font-bold`}>
                      {profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{profile?.displayName || user.email}</span>
                  </button>
                  
                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Your Profile
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => {
                          auth.signOut();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex space-x-4">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-600 bg-white hover:bg-gray-50"
                >
                  Sign In
                </Link>
                
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg 
                  className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`h-6 w-6 ${isOpen ? 'block' : 'hidden'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        {user ? (
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/dashboard')
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link
              href="/history"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/history')
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
            
            <Link
              href="/greenhouse"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/greenhouse')
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Greenhouse
            </Link>
            
            <Link
              href="/store"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/store')
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Store
            </Link>
            
            <Link
              href="/profile"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/profile')
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            
            <button
              onClick={() => {
                auth.signOut();
                setIsOpen(false);
              }}
              className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/auth/sign-in"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            
            <Link
              href="/auth/sign-up"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
