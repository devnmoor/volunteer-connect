// app/components/dashboard/TaskCompletionCongratulationsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { VolunteerTask } from '@/app/lib/firebase/firestore';

interface TaskCompletionCongratulationsModalProps {
  task: VolunteerTask;
  onNext: () => void;
}

const TaskCompletionCongratulationsModal: React.FC<TaskCompletionCongratulationsModalProps> = ({
  task,
  onNext
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti animation on mount
  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden">
        
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Falling confetti seeds */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                <img
                  src="/images/seed-icon.png"
                  alt="Confetti seed"
                  className="w-4 h-4"
                  style={{
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              </div>
            ))}
            
            {/* Sparkle effects */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-8 text-center relative z-10">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Congratulations Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-pulse">
              🎉 Congratulations! 🎉
            </h1>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              You completed "{task.title}"
            </h2>
            <p className="text-gray-600">
              Amazing work! Your dedication to volunteering is making a real difference in the community.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor((task.timeSpent || 0) / 60)}
                </div>
                <div className="text-xs text-gray-600">Minutes Volunteered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+1</div>
                <div className="text-xs text-gray-600">Seed Earned</div>
              </div>
            </div>
          </div>

          {/* Task Category Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              task.category === 'communityService' ? 'bg-purple-100 text-purple-800' :
              task.category === 'environmentalAction' ? 'bg-green-100 text-green-800' :
              task.category === 'educationYouthSupport' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {task.category === 'communityService' ? '🤝 Community Service' :
               task.category === 'environmentalAction' ? '🌱 Environmental Action' :
               task.category === 'educationYouthSupport' ? '📚 Education & Youth' :
               '❤️ Health & Wellness'}
            </span>
          </div>

          {/* Motivational Message */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 italic">
              "The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Next: Complete Your Submission
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Small note */}
          <p className="text-xs text-gray-500 mt-4">
            Complete your final submission to officially log this volunteering activity
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TaskCompletionCongratulationsModal;