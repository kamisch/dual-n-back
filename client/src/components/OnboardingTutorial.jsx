import React, { useState } from 'react';

const OnboardingTutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderVisualExample = (step) => {
    switch (step) {
      case 0: // Welcome
        return (
          <div className="grid grid-cols-3 gap-2 w-48 h-48">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg transition-colors duration-300" />
            ))}
          </div>
        );

      case 1: // How it works
        return (
          <div className="grid grid-cols-3 gap-2 w-48 h-48">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`rounded-lg transition-colors duration-300 ${
                  i === 4 ? 'bg-blue-500 flex items-center justify-center text-white text-xl font-bold' : 'bg-gray-200'
                }`}
              >
              </div>
            ))}
          </div>
        );

      case 2: // Position matching
        return (
          <div className="space-y-4">
            <div className="flex gap-8 items-center">
              <div className="grid grid-cols-3 gap-2 w-32 h-32">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-lg ${i === 4 ? 'bg-blue-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <div className="text-4xl">→</div>
              <div className="grid grid-cols-3 gap-2 w-32 h-32">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-lg ${i === 4 ? 'bg-blue-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Position Match
              </button>
            </div>
          </div>
        );

      case 3: // Sound matching
        return (
          <div className="space-y-4">
            <div className="flex gap-8 items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold">
                A
              </div>
              <div className="text-4xl">→</div>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold">
                A
              </div>
            </div>
            <div className="flex justify-center">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
                Sound Match
              </button>
            </div>
          </div>
        );

      case 4: // Double matching
        return (
          <div className="space-y-4">
            <div className="flex gap-8 items-center">
              <div className="grid grid-cols-3 gap-2 w-32 h-32">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-lg ${i === 4 ? 'bg-blue-500 flex items-center justify-center text-white font-bold' : 'bg-gray-200'}`}
                  >
                  </div>
                ))}
              </div>
              <div className="text-4xl">→</div>
              <div className="grid grid-cols-3 gap-2 w-32 h-32">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-lg ${i === 4 ? 'bg-blue-500 flex items-center justify-center text-white font-bold' : 'bg-gray-200'}`}
                  >
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Position Match
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">
                Sound Match
              </button>
            </div>
          </div>
        );

      case 5: // Leveling up
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-xl font-bold">1-Back</div>
                <div className="text-sm text-gray-500">Previous Step</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <div className="text-xl font-bold">2-Back</div>
                <div className="text-sm text-gray-500">Two Steps Back</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <div className="text-xl font-bold">3-Back</div>
                <div className="text-sm text-gray-500">Three Steps Back</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    {
      title: "Welcome to Dual N-Back",
      content: "Train your working memory with this scientifically-proven cognitive exercise.",
    },
    {
      title: "How It Works",
      content: "You'll see a grid where squares light up and hear letters. Your task is to remember both the positions and sounds from N steps ago.",
    },
    {
      title: "Position Matching",
      content: "If the current position matches the position from N steps ago, click 'Position Match'.",
    },
    {
      title: "Sound Matching",
      content: "If the current letter matches the letter from N steps ago, click 'Sound Match'.",
    },
    {
      title: "Double Matching",
      content: "Sometimes both position and sound match! Click both buttons when this happens.",
    },
    {
      title: "Leveling Up",
      content: "Start with 1-Back and progress to higher levels as you improve. Each level increases the number of steps to remember.",
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
        
        <div className="bg-gray-50 rounded-lg p-8 mb-4 flex items-center justify-center min-h-[250px]">
          {renderVisualExample(currentStep)}
        </div>

        <p className="text-gray-600 text-lg mb-8">{steps[currentStep].content}</p>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className={`px-4 py-2 rounded ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start Playing
            </button>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;