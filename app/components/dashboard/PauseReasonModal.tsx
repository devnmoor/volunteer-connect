// app/components/dashboard/PauseReasonModal.tsx - Enhanced version
'use client';

import { useState } from 'react';

interface PauseReasonModalProps {
  onSubmit: (reason: string, description: string) => void;
  onCancel: () => void;
}

const PauseReasonModal: React.FC<PauseReasonModalProps> = ({ onSubmit, onCancel }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const predefinedReasons = [
    'Taking a break',
    'Need to attend to something urgent',
    'Technical issues',
    'Meeting with someone',
    'Waiting for resources/information',
    'Personal emergency',
    'Need more time to plan',
    'Weather conditions'
  ];
  
  const handleReasonToggle = (reason: string) => {
    if (reason === 'Other') {
      setShowCustomInput(!showCustomInput);
      if (showCustomInput) {
        setSelectedReasons(prev => prev.filter(r => r !== 'Other' && r !== customReason));
        setCustomReason('');
      }
      return;
    }
    
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    } else {
      setSelectedReasons(prev => [...prev, reason]);
    }
  };
  
  const handleCustomReasonChange = (value: string) => {
    setCustomReason(value);
    if (value.trim()) {
      setSelectedReasons(prev => {
        const filtered = prev.filter(r => r !== 'Other' && !prev.includes(customReason));
        return [...filtered, 'Other', value.trim()];
      });
    } else {
      setSelectedReasons(prev => prev.filter(r => r !== 'Other' && r !== customReason));
    }
  };
  
  const handleSubmit = () => {
    if (selectedReasons.length === 0 || !description.trim()) return;
    
    const finalReasons = selectedReasons.filter(r => r !== 'Other' || customReason.trim());
    onSubmit(finalReasons.join(', '), description);
  };
  
  const isFormValid = selectedReasons.length > 0 && description.trim().length > 0;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pause Task</h3>
              <p className="text-sm text-gray-600">Tell us why you're pausing this task</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Reason Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why are you pausing? (Select all that apply)
            </label>
            
            <div className="space-y-2">
              {predefinedReasons.map(reason => (
                <label key={reason} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">{reason}</span>
                </label>
              ))}
              
              {/* Custom reason option */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCustomInput}
                  onChange={() => handleReasonToggle('Other')}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">Other</span>
              </label>
              
              {/* Custom reason input */}
              {showCustomInput && (
                <div className="ml-7 mt-2">
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => handleCustomReasonChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Please specify..."
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Note *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 text-sm"
              placeholder="Describe what you've accomplished so far and any important details about pausing..."
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                This note will be added to your task activity log
              </p>
              <span className={`text-xs ${description.length < 10 ? 'text-red-500' : 'text-green-600'}`}>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Templates (Click to use)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Made good progress, need to step away briefly",
                "Completed first phase, taking a planned break", 
                "Waiting for additional information to continue",
                "Need to handle an urgent matter, will resume soon"
              ].map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDescription(template)}
                  className="text-left text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded p-2 transition-colors"
                >
                  "{template}"
                </button>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Reminder</p>
                <p className="text-xs text-blue-700">
                  Your timer will be paused and your progress will be saved. You can resume this task anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Keep Working
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-md font-medium flex items-center ${
              isFormValid 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pause Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseReasonModal;