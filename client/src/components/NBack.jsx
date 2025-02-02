import React, { useState, useEffect, useCallback } from "react";
import ProgressDisplay from "./ProgressDisplay";

const NBackGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [activePosition, setActivePosition] = useState(null);
  const [activeSound, setActiveSound] = useState(null);
  const [positionSequence, setPositionSequence] = useState([]);
  const [soundSequence, setSoundSequence] = useState([]);
  const [score, setScore] = useState({ position: 0, sound: 0 });
  const [currentRound, setCurrentRound] = useState(0);
  const [nBack, setNBack] = useState(2); // Start at n=1
  const [timeLeft, setTimeLeft] = useState(1);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const LEVEL_REQUIREMENTS = {
    1: {
      accuracy: 0.75,
      minTrials: 20,
      consecutiveNeeded: 5,
    },
    2: {
      accuracy: 0.7,
      minTrials: 25,
      consecutiveNeeded: 5,
    },
    3: {
      accuracy: 0.65,
      minTrials: 30,
      consecutiveNeeded: 6,
    },
    4: {
      accuracy: 0.6,
      minTrials: 35,
      consecutiveNeeded: 7,
    },
  };

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
    // Clear any running intervals
    clearAllIntervals();
  }, []);

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

  // Progress to next level
  const progressLevel = () => {
    setNBack((prev) => prev + 1);
    // Reset stats for new level
    setStats({
      position: { correct: 0, attempts: 0, consecutive: 0 },
      sound: { correct: 0, attempts: 0, consecutive: 0 },
    });
  };

  const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

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
        setGameStarted(false); // End game
      }
      return newFailures;
    });
  };

  const handleSuccess = () => {
    setConsecutiveFailures(0); // Reset consecutive failures on success
  };

  const nextRound = useCallback(() => {
    const { position, sound } = generateStimuli();

    if (currentRound >= nBack) {
      const positionMatch =
        positionSequence[currentRound - nBack] === activePosition;
      const soundMatch = soundSequence[currentRound - nBack] === activeSound;

      // Check for missed matches (failures to click when there was a match)
      if (positionMatch) {
        handleFailure(); // Failed to click on a position match
      }
      if (soundMatch) {
        handleFailure(); // Failed to click on a sound match
      }
    }

    setPositionSequence((prev) => [...prev, activePosition]);
    setSoundSequence((prev) => [...prev, activeSound]);
    setActivePosition(position);
    setActiveSound(sound);
    setCurrentRound((prev) => prev + 1);
    setTimeLeft(1);
    playSound(sound);
  }, [
    currentRound,
    nBack,
    positionSequence,
    soundSequence,
    activePosition,
    activeSound,
  ]);

  const startGame = () => {
    setGameStarted(true);
    setScore({ position: 0, sound: 0 });
    setCurrentRound(0);
    setPositionSequence([]);
    setSoundSequence([]);
    setConsecutiveFailures(0);
    const { position, sound } = generateStimuli();
    setActivePosition(position);
    setActiveSound(sound);
    playSound(sound);
    setTimeLeft(1);
  };

  const handleMatch = (type) => {
    if (currentRound < nBack) return;

    // Use the correct sequence variables
    const isPosition = type === "position";
    const matchSequence = isPosition ? positionSequence : soundSequence;
    const currentValue = isPosition ? activePosition : activeSound;
    const actualMatch = matchSequence[currentRound - nBack] === currentValue;

    // Update stats
    setStats((prev) => {
      const typeStats = prev[type];
      const newConsecutive = actualMatch ? typeStats.consecutive + 1 : 0;

      return {
        ...prev,
        [type]: {
          correct: actualMatch ? typeStats.correct + 1 : typeStats.correct,
          attempts: typeStats.attempts + 1,
          consecutive: newConsecutive,
        },
      };
    });

    // Update score and check for success/failure
    if (actualMatch) {
      setScore((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }));
      handleSuccess();
    } else {
      handleFailure();
    }
    checkProgression();
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
          <p className="text-sm text-gray-600">Current Letter</p>
          <p className="text-3xl font-bold">{activeSound || "-"}</p>
          <p className="text-sm text-gray-600 mt-2">Round: {currentRound}</p>
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
                  ${
                    activePosition === index
                      ? "bg-blue-500 shadow-lg"
                      : "bg-gray-200"
                  }
                  transition-all duration-200
                `}
              />
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
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleMatch("position")}
                className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-colors"
              >
                Position Match
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
