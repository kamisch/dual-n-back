import React from 'react';
import { LEVEL_REQUIREMENTS } from '../constants/levelRequirements';
const ProgressDisplay = ({
    isOpen,
    stats,
    nBack,
    isSuccess,
    onNextLevel,
    onRetry,
    onExit,
    requirementsMet,
  }) => {
    if (!isOpen) return null;
  
    const calculateAccuracy = (type) => {
      const { correct, attempts } = stats[type];
      return attempts > 0 ? (correct / attempts * 100).toFixed(1) : '0';
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isSuccess ? 'Level Complete!' : 'Game Over'}
            </h2>
            <p className="text-gray-600">
              {isSuccess 
                ? 'Congratulations! You\'ve mastered this level.' 
                : `You reached ${calculateAccuracy('position')}% position accuracy and ${calculateAccuracy('sound')}% sound accuracy.`
              }
            </p>
          </div>
  
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Position Performance</h3>
              <p className="text-2xl font-bold">{calculateAccuracy('position')}%</p>
              <p className="text-xs text-gray-500">
                {stats.position.correct} / {stats.position.attempts} correct
              </p>
              <p className="text-xs text-gray-500">
                Best streak: {stats.position.consecutive}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Sound Performance</h3>
              <p className="text-2xl font-bold">{calculateAccuracy('sound')}%</p>
              <p className="text-xs text-gray-500">
                {stats.sound.correct} / {stats.sound.attempts} correct
              </p>
              <p className="text-xs text-gray-500">
                Best streak: {stats.sound.consecutive}
              </p>
            </div>
          </div>
  
          {/* Level Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-600">Level {nBack}-Back</p>
            {!isSuccess && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Need {LEVEL_REQUIREMENTS[nBack].accuracy * 100}% accuracy to advance
              </p>
            )}
          </div>
  
          {/* Actions */}
          <div className="space-y-2">
            {isSuccess && requirementsMet && (
              <button
                onClick={onNextLevel}
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Continue to Level {nBack + 1}
              </button>
            )}
            <button
              onClick={onRetry}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Retry Level {nBack}
            </button>
            <button
              onClick={onExit}
              className="w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ProgressDisplay;