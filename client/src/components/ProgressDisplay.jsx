import React from 'react';

const GameProgressModal = ({ 
  isOpen, 
  stats, 
  nBack, 
  isSuccess, 
  onNextLevel, 
  onRetry, 
  onExit,
  requirementsMet
}) => {
  if (!isOpen) return null;

  const calculateAccuracy = (type) => {
    const { correct, attempts } = stats[type];
    return attempts > 0 ? (correct / attempts * 100).toFixed(1) : '0';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {isSuccess ? 'Level Complete!' : 'Game Over'}
          </h2>
          <p className="text-gray-600">
            {isSuccess 
              ? 'Congratulations! You\'ve mastered this level.' 
              : 'Keep practicing to improve your performance.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 mb-1">Position Accuracy</h3>
            <p className="text-2xl font-bold">{calculateAccuracy('position')}%</p>
            <p className="text-xs text-gray-500">
              {stats.position.correct} / {stats.position.attempts} correct
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600 mb-1">Sound Accuracy</h3>
            <p className="text-2xl font-bold">{calculateAccuracy('sound')}%</p>
            <p className="text-xs text-gray-500">
              {stats.sound.correct} / {stats.sound.attempts} correct
            </p>
          </div>
        </div>

        {/* Current Level */}
        <div className="text-center mb-6">
          <p className="text-gray-600">Current Level: {nBack}-Back</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isSuccess && requirementsMet && (
            <button
              onClick={onNextLevel}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Continue to {nBack + 1}-Back
            </button>
          )}
          <button
            onClick={onRetry}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry {nBack}-Back
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

export default GameProgressModal;