const GameControls = ({ gameStarted, onStart, onMatch }) => {
    // Track button active states
    const [activeButtons, setActiveButtons] = useState({
      position: false,
      sound: false
    });
  
    // Handle button press
    const handleButtonPress = (type) => {
      // Show active state
      setActiveButtons(prev => ({
        ...prev,
        [type]: true
      }));
  
      // Call match handler
      onMatch(type);
  
      // Reset active state after short delay
      setTimeout(() => {
        setActiveButtons(prev => ({
          ...prev,
          [type]: false
        }));
      }, 200); // Reset after 200ms
    };
  
    if (!gameStarted) {
      return (
        <div className="space-y-4">
          <div className="text-center text-lg font-semibold text-gray-700">
            Ready to Start?
          </div>
          <button
            onClick={onStart}
            className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 
                     text-white rounded-lg shadow transition-all transform 
                     active:scale-95 text-lg font-semibold"
          >
            Start Game
          </button>
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleButtonPress('position')}
          className={`tap-highlight-none touch-manipulation py-6 rounded-lg shadow transition-all transform 
                     text-white text-lg font-semibold
                     ${activeButtons.position 
                       ? 'bg-blue-700 scale-95' 
                       : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95'
                     }`}
        >
          Position Match
        </button>
        <button
          onClick={() => handleButtonPress('sound')}
          className={`tap-highlight-none touch-manipulation py-6 rounded-lg shadow transition-all transform 
                     text-white text-lg font-semibold
                     ${activeButtons.sound 
                       ? 'bg-purple-700 scale-95' 
                       : 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 active:scale-95'
                     }`}
        >
          Sound Match
        </button>
      </div>
    );
  };