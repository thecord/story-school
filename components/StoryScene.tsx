
import React from 'react';
import { StoryStep } from '../types';
import Spinner from './Spinner';

interface StorySceneProps {
  step: StoryStep | null;
  isLoading: boolean;
}

const StoryScene: React.FC<StorySceneProps> = ({ step, isLoading }) => {
  if (!step) {
    return null;
  }

  return (
    <article className="bg-white rounded-lg shadow-xl p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-5">{step.title}</h2>
      
      <div className="bg-amber-100 rounded-lg border-2 border-dashed border-amber-300 min-h-[256px] flex items-center justify-center overflow-hidden relative">
        {isLoading || !step.imageUrl ? (
          <div className="text-center p-4">
            <Spinner className="w-12 h-12 mx-auto mb-4" />
            <p className="text-amber-700 italic">...جاري رسم المشهد</p>
            <p className="text-amber-600 text-sm mt-2">{step.imagePrompt}</p>
          </div>
        ) : (
          <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
        )}
      </div>
      
      <p className="text-lg md:text-xl text-amber-900 leading-relaxed mt-6">{step.text}</p>
    </article>
  );
};

export default StoryScene;
