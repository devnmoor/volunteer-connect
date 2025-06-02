// app/components/dashboard/PauseConfirmationModal.tsx
'use client';

import { VolunteerTask } from '@/app/lib/firebase/firestore';

interface PauseConfirmationModalProps {
  task: VolunteerTask;
  onConfirm: () => void;
  onCancel: () => void;
}

const PauseConfirmationModal: React.FC<PauseConfirmationModalProps> = ({
  task,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pause Timer?</h2>
              <p className="text-sm text-gray-600 mt-1">{task.title}</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to pause your timer? You'll be asked to record your progress before the timer stops.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              No, Keep Working
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium"
            >
              Yes, Pause Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseConfirmationModal;