
import React from 'react';
import { StoryStep } from '../types';

interface StoryNavigatorProps {
  steps: StoryStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

const StoryNavigator: React.FC<StoryNavigatorProps> = ({ steps, currentStepIndex, onSelectStep }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md sticky top-6">
      <h3 className="text-xl font-bold text-teal-800 mb-4">خطوات القصة</h3>
      <p className="text-sm text-gray-600 mb-4">اضغط على أي خطوة لترى ماذا حدث لكوكو وكيف تغيرت مشاعره!</p>
      <nav className="space-y-2">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => onSelectStep(index)}
            className={`nav-button w-full text-right p-3 rounded-lg shadow-sm bg-white hover:bg-teal-50 border border-gray-200 transition-all duration-300 ease-in-out ${
              currentStepIndex === index
                ? 'bg-teal-600 text-white transform scale-103 shadow-lg'
                : 'hover:bg-teal-50'
            }`}
          >
            <span className="font-bold">{step.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StoryNavigator;
