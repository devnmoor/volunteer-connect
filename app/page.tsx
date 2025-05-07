// app/page.tsx - Landing Page
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
            Volunteer Connect
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Join our community of volunteers making a difference. Track your impact, connect locally, and grow your volunteering journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/sign-up">
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-lg">
                Get Started
              </button>
            </Link>
            <Link href="/auth/sign-in">
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-green-600 font-medium rounded-md border border-green-600 text-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sprout */}
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/images/sprout-badge.png" alt="Sprout" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sprout</h3>
              <p className="text-gray-700">
                Perfect for beginners. Get assigned volunteering tasks based on your interests and commitment level.
              </p>
            </div>
            
            {/* Bud */}
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/images/bud-badge.png" alt="Bud" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bud</h3>
              <p className="text-gray-700">
                For those 16 and up. Choose your own tasks and connect with other volunteers in your area.
              </p>
            </div>
            
            {/* Bloom */}
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/images/bloom-badge.png" alt="Bloom" className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bloom</h3>
              <p className="text-gray-700">
                For those 21 and up (or 16+ with guardian). Create and host volunteer opportunities, mentor others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Volunteer Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Community Service */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-purple-800">Community Service</h3>
              <p className="text-gray-700">
                Help local communities through food banks, homeless shelters, and neighborhood clean-ups.
              </p>
            </div>
            
            {/* Environmental Action */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-800">Environmental Action</h3>
              <p className="text-gray-700">
                Protect our planet through conservation projects, tree planting, and sustainability initiatives.
              </p>
            </div>
            
            {/* Education & Youth Support */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-yellow-800">Education & Youth</h3>
              <p className="text-gray-700">
                Support the next generation through tutoring, mentoring, and educational programs.
              </p>
            </div>
            
            {/* Health & Wellness */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Health & Wellness</h3>
              <p className="text-gray-700">
                Promote physical and mental wellbeing through health initiatives, elderly care, and wellness programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">
            Join our community of volunteers and start your journey toward positive change today.
          </p>
          <Link href="/auth/sign-up">
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-green-600 font-medium rounded-md text-lg">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Volunteer Connect</h3>
              <p className="text-gray-400">Coding for a better world</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">About</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Volunteer Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
