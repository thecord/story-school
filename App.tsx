
import React, { useState, useEffect, useCallback } from 'react';
import { STORY_DATA } from './constants';
import { StoryStep } from './types';
import { generateImage } from './services/geminiService';
import StoryNavigator from './components/StoryNavigator';
import StoryScene from './components/StoryScene';
import FeelingsChart from './components/FeelingsChart';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [storySteps, setStorySteps] = useState<StoryStep[]>(STORY_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);

  const generateAllImages = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const imagePromises = STORY_DATA.map(step => generateImage(step.imagePrompt));
      const imageUrls = await Promise.all(imagePromises);
      
      const updatedSteps = STORY_DATA.map((step, index) => ({
        ...step,
        imageUrl: imageUrls[index],
      }));
      
      setStorySteps(updatedSteps);
    } catch (error) {
      console.error("Failed to generate one or more images:", error);
      // Even if it fails, we can proceed with the app, images will be missing.
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    generateAllImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 text-amber-900 leading-relaxed">
      <header className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-amber-800">🐰💖 مغامرة كوكو والقلب الهادي 💖🐰</h1>
        <p className="text-lg md:text-xl text-amber-700 mt-2">قصة تفاعلية عن الهدوء والتسامح</p>
      </header>

      <div className="md:grid md:grid-cols-3 md:gap-8">
        <aside className="md:col-span-1 space-y-6 mb-8 md:mb-0">
          <StoryNavigator
            steps={storySteps}
            currentStepIndex={currentStepIndex}
            onSelectStep={setCurrentStepIndex}
          />
        </aside>

        <section className="md:col-span-2 space-y-8">
          <StoryScene
            step={storySteps[currentStepIndex]}
            isLoading={isLoadingImages && !storySteps[currentStepIndex].imageUrl}
          />
          <FeelingsChart
            storyData={storySteps}
            currentStepIndex={currentStepIndex}
          />
        </section>
      </div>
      
      <Chatbot />

      <footer className="text-center mt-12 md:mt-16 py-6 border-t border-amber-200">
        <p className="text-xl font-bold text-amber-800">تذكر يا بطل: 🌟</p>
        <p className="text-lg text-amber-700 mt-2">لما تزعل... خذ نفس 😮‍💨، ابتعد شوي 🚶‍♂️، وتكلم بهدوء 🗣️... التسامح يخليك أقوى وأسعد! 😊</p>
      </footer>
    </main>
  );
};

export default App;
