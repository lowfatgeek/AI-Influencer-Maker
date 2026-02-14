import React, { useState } from 'react';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import ThemeToggle from './components/ThemeToggle';
import { FormData, GenerationResult } from './types';
import { buildPrompts, generateImageUrl } from './services/promptService';
import { ETHNICITY_OPTIONS, AGE_RANGE_OPTIONS, HAIR_COLOR_OPTIONS, HAIR_MODEL_OPTIONS, OUTFIT_OPTIONS, BACKGROUND_OPTIONS } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    gender: 'Female',
    mode: 'No Hijab',
    ethnicity: 'Chinese',
    ageRange: AGE_RANGE_OPTIONS[1].value, // Mid 20s as default
    hairColor: HAIR_COLOR_OPTIONS[1].value, // Dark Brown
    hairModel: HAIR_MODEL_OPTIONS.find(o => o.type === 'f')?.value || '', // Default female hair
    outfit: OUTFIT_OPTIONS[0].value,
    background: BACKGROUND_OPTIONS[0].value,
    aspectRatio: '9:16',
    modelAI: 'zimage',
    shotType: 'Half-body',
    details: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      // 1. Build Prompts
      const { promptEn, promptId, promptLong } = buildPrompts(formData);

      // Determine which Pollinations model to use
      // Directly use the selected value from dropdown (zimage or imagen-4)
      const pollinationModel = formData.modelAI;
      const displayModelName = formData.modelAI === 'imagen-4' ? 'Google Imagen 4' : 'Z-Image Turbo';

      // 2. Generate Seeds
      const seedA = Math.floor(Math.random() * 1000000);
      const seedB = seedA + 1; // Distinct seed

      // 3. Construct URLs using Pollinations
      const urlA = generateImageUrl(promptEn, pollinationModel, formData.aspectRatio, seedA);
      const urlB = generateImageUrl(promptEn, pollinationModel, formData.aspectRatio, seedB);

      // 4. Update State
      setResult({
        images: [
          { url: urlA, seed: seedA, model: displayModelName },
          { url: urlB, seed: seedB, model: displayModelName },
        ],
        promptEn,
        promptId,
        promptLong,
      });

      // Simulate delay for UI polish (since URL generation is instant)
      setTimeout(() => {
          setIsLoading(false);
      }, 1500);

    } catch (error: any) {
      console.error("Error generating images:", error);
      
      const errorMessage = error.message || "Unknown error occurred";
      
      const errorDiv = document.createElement('div');
      errorDiv.className = "fixed bottom-5 right-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 max-w-md animate-bounce-in";
      errorDiv.innerHTML = `
        <p class="font-bold">Generation Failed</p>
        <p class="text-sm">${errorMessage}</p>
        <button class="absolute top-2 right-2 text-red-700 font-bold" onclick="this.parentElement.remove()">×</button>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 8000);

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              AI Influencer Maker
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
          
          {/* Left Column: Input Form */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
            <InputForm 
              formData={formData} 
              onChange={setFormData} 
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Output */}
          <div className="w-full lg:w-2/3 min-h-[500px]">
            <OutputDisplay 
                result={result} 
                isLoading={isLoading} 
                aspectRatio={formData.aspectRatio}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Powered by Pollinations API • Built with React & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;