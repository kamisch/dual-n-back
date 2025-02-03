import React, { useState, useEffect, useCallback } from "react";
import ProgressDisplay from "./ProgressDisplay";
import { StimuliGenerator } from "../utils/StimuliGenerator";
import { LEVEL_REQUIREMENTS } from '../constants/levelRequirements';

const NBackGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [activePosition, setActivePosition] = useState(null);
  const [activeSound, setActiveSound] = useState(null);
  const [score, setScore] = useState({ position: 0, sound: 0 });
  const [currentRound, setCurrentRound] = useState(0);
  const [nBack, setNBack] = useState(2); // Start at n=1
  const [timeLeft, setTimeLeft] = useState(1);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stimuliGenerator, setStimuliGenerator] = useState(null);
  const [currentMatches, setCurrentMatches] = useState({
    position: false,
    sound: false,
    checked: false, // Flag to track if we've checked this round's matches
  });

  const [stats, setStats] = useState({
    position: {
      correct: 0,
      attempts: 0,
      consecutive: 0,
    },
    sound: {
      correct: 0,
      attempts: 0,
      consecutive: 0,
    },
  });
  const INTERVAL = 3000;
  const MAX_FAILURES = 3;


  const checkRequirementsMet = () => {
    const currentReq = LEVEL_REQUIREMENTS[nBack];
    if (!currentReq) return false;

    const posAccuracy = calculateAccuracy("position");
    const soundAccuracy = calculateAccuracy("sound");
    const posTrials = stats.position.attempts;
    const soundTrials = stats.sound.attempts;

    return (
      posAccuracy >= currentReq.accuracy &&
      soundAccuracy >= currentReq.accuracy &&
      posTrials >= currentReq.minTrials &&
      soundTrials >= currentReq.minTrials &&
      stats.position.consecutive >= currentReq.consecutiveNeeded &&
      stats.sound.consecutive >= currentReq.consecutiveNeeded
    );
  };

  const handleGameEnd = useCallback((success) => {
    setGameStarted(false);
    setIsSuccess(success);
    setShowProgressModal(true);
    clearAllIntervals();
  }, []);

  const clearAllIntervals = () => {
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= highestId; i++) {
      clearInterval(i);
      clearTimeout(i);
    }
  };

  const handleNextLevel = () => {
    setNBack((prev) => prev + 1);
    setStats({
      position: { correct: 0, attempts: 0, consecutive: 0 },
      sound: { correct: 0, attempts: 0, consecutive: 0 },
    });
    setShowProgressModal(false);
    startGame();
  };

  const handleRetry = () => {
    setStats({
      position: { correct: 0, attempts: 0, consecutive: 0 },
      sound: { correct: 0, attempts: 0, consecutive: 0 },
    });
    setShowProgressModal(false);
    startGame();
  };

  const handleExit = () => {
    // Save current level progress to localStorage or your backend
    localStorage.setItem("nBackLevel", nBack.toString());
    setShowProgressModal(false);
    // Navigate to home or handle exit logic
  };

  // Calculate accuracy for position or sound
  const calculateAccuracy = (type) => {
    const { correct, attempts } = stats[type];
    return attempts > 0 ? correct / attempts : 0;
  };

  const checkProgression = () => {
    if (checkRequirementsMet()) {
      handleGameEnd(true);
    }
  };

  const generateStimuli = () => {
    const position = Math.floor(Math.random() * 9);
    const sound = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    return { position, sound };
  };

  const playSound = (letter) => {
    const utterance = new SpeechSynthesisUtterance(letter.toLowerCase());
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleFailure = () => {
    setConsecutiveFailures((prev) => {
      const newFailures = prev + 1;
      if (newFailures >= MAX_FAILURES) {
        handleGameEnd(false); // This will show the progress display with failure state
      }
      return newFailures;
    });
  };

  const handleSuccess = () => {
    setConsecutiveFailures(0); // Reset consecutive failures on success
  };

  const nextRound = useCallback(() => {
    if (!stimuliGenerator) return;

    // Check for missed matches from PREVIOUS round before generating new stimuli
    if (!currentMatches.checked && currentRound >= nBack) {
      // Only count as failure if there was a match and user didn't respond
      if (currentMatches.position) {
        handleFailure(); // Failed to click on a position match
      }
      if (currentMatches.sound) {
        handleFailure(); // Failed to click on a sound match
      }
    }

    // Generate new stimuli
    const newStimuli = stimuliGenerator.generateStimuli();

    // Get matches for the new stimuli
    const matches = stimuliGenerator.getCurrentMatches();

    // Set new matches and reset checked flag
    setCurrentMatches({
      position: matches.position,
      sound: matches.sound,
      checked: false,
    });

    // Update game state
    setActivePosition(newStimuli.position);
    setActiveSound(newStimuli.sound);
    setCurrentRound((prev) => prev + 1);
    setTimeLeft(1);
    playSound(newStimuli.sound);
  }, [stimuliGenerator, currentRound, nBack, currentMatches, handleFailure]);

  const resetGameState = () => {
    setStats({
      position: { correct: 0, attempts: 0, consecutive: 0 },
      sound: { correct: 0, attempts: 0, consecutive: 0 },
    });
    setScore({ position: 0, sound: 0 });
    setCurrentRound(0);
    setConsecutiveFailures(0);
    setCurrentMatches({ position: false, sound: false, checked: false });
  };

  const startGame = () => {
    resetGameState();
    setGameStarted(true);
    const generator = new StimuliGenerator(nBack);

    setStimuliGenerator(generator);
    const { position, sound } = generator.generateStimuli();
    setActivePosition(position);
    setActiveSound(sound);
    playSound(sound);
    setTimeLeft(1);
  };

  const handleMatch = (type) => {
    if (currentRound < nBack || !stimuliGenerator) return;

    // Allow for both position and sound matches
    if (type === "both") {
      const positionIsMatch = currentMatches.position;
      const soundIsMatch = currentMatches.sound;

      if (positionIsMatch && soundIsMatch) {
        // Handle successful dual match
        updateStats("position", true);
        updateStats("sound", true);
        handleSuccess();
        checkProgression();
      } else {
        handleFailure(); // Wrong dual match guess
      }
      return;
    }

    // Single match handling
    const isMatch = currentMatches[type];
    updateStats(type, isMatch);

    if (isMatch) {
      handleSuccess();
      checkProgression();
    } else {
      handleFailure();
    }
  };

  const updateStats = (type, isMatch) => {
    setStats((prev) => {
      const typeStats = prev[type];
      return {
        ...prev,
        [type]: {
          correct: isMatch ? typeStats.correct + 1 : typeStats.correct,
          attempts: typeStats.attempts + 1,
          consecutive: isMatch ? typeStats.consecutive + 1 : 0,
        },
      };
    });

    if (isMatch) {
      setScore((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
    }

    // Mark match as handled
    setCurrentMatches((prev) => ({
      ...prev,
      [type]: false,
      checked: true,
    }));
  };

  useEffect(() => {
    let intervalId;
    let timerId;

    if (gameStarted) {
      intervalId = setInterval(nextRound, INTERVAL);
      timerId = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, [gameStarted, nextRound]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8">
      <ProgressDisplay
        isOpen={showProgressModal}
        stats={stats}
        nBack={nBack}
        isSuccess={isSuccess}
        onNextLevel={handleNextLevel}
        onRetry={handleRetry}
        onExit={handleExit}
        requirementsMet={checkRequirementsMet()}
      />
      <div className="w-full max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Dual N-Back Memory Game
        </h1>

        {/* Current Letter */}
        <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
          <p className="text-sm text-gray-600 mt-2">
            Round: {currentRound}, level: {nBack}
          </p>
        </div>
        {/* Failures Counter */}
        <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
          <p className="text-sm text-gray-600">Consecutive Failures</p>
          <div className="flex justify-center gap-2 mt-2">
            {[...Array(MAX_FAILURES)].map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index < consecutiveFailures ? "bg-red-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-3 gap-3 aspect-square">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className={`
        aspect-square rounded-lg
        flex items-center justify-center
        ${
          activePosition === index
            ? "bg-blue-500 shadow-lg text-white text-2xl font-bold"
            : "bg-gray-200"
        }
        transition-all duration-200
      `}
              ></div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="space-y-4">
          {!gameStarted ? (
            <div className="space-y-4">
              <div className="text-center text-lg font-semibold text-gray-700">
                {consecutiveFailures >= MAX_FAILURES
                  ? "Game Over!"
                  : "Ready to Start?"}
              </div>
              <button
                onClick={startGame}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors"
              >
                {consecutiveFailures >= MAX_FAILURES
                  ? "Try Again"
                  : "Start Game"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleMatch("position")}
                className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors"
              >
                Position Match
              </button>
              <button
                onClick={() => handleMatch("both")}
                className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-colors"
              >
                Both Match
              </button>
              <button
                onClick={() => handleMatch("sound")}
                className="py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition-colors"
              >
                Sound Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NBackGame;
