// app/components/dashboard/PauseReasonModal.tsx
'use client';

import { useState } from 'react';

interface PauseReasonModalProps {
  onSubmit: (reason: string, description: string) => void;
  onResume: () => void;
}

const PauseReasonModal: React.FC<PauseReasonModalProps> = ({ onSubmit, onResume }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  
  const reasons = [
    'Taking a break',
    'Need to attend to something urgent',
    'Technical issues',
    'Meeting with someone',
    'Waiting for resources/information',
    'Other'
  ];
  
  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    } else {
      setSelectedReasons(prev => [...prev, reason]);
    }
  };
  
  const handleSubmit = () => {
    if (selectedReasons.length === 0 || !description.trim()) return;
    
    onSubmit(selectedReasons.join(', '), description);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Why are you pausing this task?</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">Select all that apply:</p>
          
          <div className="space-y-2">
            {reasons.map(reason => (
              <label key={reason} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonToggle(reason)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Please provide more details:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md h-32"
            placeholder="Add more context about why you're pausing..."
            required
          />
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onResume}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Resume Instead
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0 || !description.trim()}
            className={`px-4 py-2 ${
              selectedReasons.length === 0 || !description.trim() 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            } rounded-md`}
          >
            Pause Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseReasonModal;