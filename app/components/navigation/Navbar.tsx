// app/components/navigation/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase/config';
import ProfilePictureModal from './ProfilePictureModal';

const Navbar = () => {
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center hover:cursor-pointer">
                <img 
                  src="/images/logo.png" 
                  alt="Volunteer Connect Logo" 
                  className="h-10 w-auto"
                />
                <span className="ml-2 text-xl font-semibold text-green-700">Volunteer Connect</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard">
              <div className="text-gray-700 hover:text-green-600 hover:cursor-pointer">Dashboard</div>
            </Link>
            <Link href="/greenhouse">
              <div className="text-gray-700 hover:text-green-600 hover:cursor-pointer">Greenhouse</div>
            </Link>
            <Link href="/community">
              <div className="text-gray-700 hover:text-green-600 hover:cursor-pointer">Community</div>
            </Link>
            <Link href="/rewards">
              <div className="text-gray-700 hover:text-green-600 hover:cursor-pointer">Rewards</div>
            </Link>
            
            <div className="border-l h-6 border-gray-300 mx-2"></div>
            
            <button
              onClick={() => setShowProfileModal(true)}
              className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none hover:cursor-pointer"
            >
              <img 
                src="/images/default-profile.png" 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-500 hover:text-gray-700 hover:cursor-pointer focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white px-4 py-2 shadow-inner">
          <div className="space-y-2">
            <Link href="/dashboard">
              <div className="block py-2 text-gray-700 hover:text-green-600 hover:cursor-pointer">Dashboard</div>
            </Link>
            <Link href="/greenhouse">
              <div className="block py-2 text-gray-700 hover:text-green-600 hover:cursor-pointer">Greenhouse</div>
            </Link>
            <Link href="/community">
              <div className="block py-2 text-gray-700 hover:text-green-600 hover:cursor-pointer">Community</div>
            </Link>
            <Link href="/rewards">
              <div className="block py-2 text-gray-700 hover:text-green-600 hover:cursor-pointer">Rewards</div>
            </Link>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div 
              className="flex items-center py-2 text-gray-700 hover:text-green-600 hover:cursor-pointer"
              onClick={() => setShowProfileModal(true)}
            >
              <div className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                <img 
                  src="/images/default-profile.png" 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span>Profile</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center py-2 text-red-600 w-full text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Profile Picture Modal */}
      {showProfileModal && (
        <ProfilePictureModal onClose={() => setShowProfileModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;