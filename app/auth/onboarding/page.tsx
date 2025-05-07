// app/auth/onboarding/page.tsx
'use client';

import OnboardingFlow from '@/app/components/auth/OnboardingFlow';

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">Welcome to Volunteer Connect</h2>
        <OnboardingFlow />
      </div>
    </div>
  );
}
