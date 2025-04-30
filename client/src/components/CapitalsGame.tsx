import { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Flag, SkipForward, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { UserContext } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

type GameState = "playing" | "feedback" | "completed";
type Coordinates = { x: number; y: number };

interface CapitalPoint {
  country: string;
  capital: string;
  coordinates: { x: number; y: number };
  hint: string;
}

// Sample data for the capitals game
const capitalPoints: CapitalPoint[] = [
  {
    country: "Франция",
    capital: "Париж",
    coordinates: { x: 47.2, y: 42.5 },
    hint: "Расположен на реке Сена в северной Франции"
  },
  {
    country: "Великобритания",
    capital: "Лондон", 
    coordinates: { x: 44.5, y: 38.5 },
    hint: "Находится на реке Темза в юго-восточной Англии"
  },
  {
    country: "Испания",
    capital: "Мадрид",
    coordinates: { x: 41.8, y: 55.3 },
    hint: "Находится в центре Пиренейского полуострова"
  },
  {
    country: "Италия",
    capital: "Рим",
    coordinates: { x: 53.5, y: 58.2 },
    hint: "Расположен в центрально-западной части Апеннинского полуострова"
  },
  {
    country: "Германия",
    capital: "Берлин",
    coordinates: { x: 52.8, y: 41.5 },
    hint: "Расположен в северо-восточной Германии"
  },
  {
    country: "Россия",
    capital: "Москва",
    coordinates: { x: 65, y: 39 },
    hint: "Расположен на реке Москва в западной России"
  },
  {
    country: "Япония",
    capital: "Токио",
    coordinates: { x: 88, y: 49 },
    hint: "Расположен на юго-восточной стороне главного острова Хонсю"
  },
  {
    country: "Китай",
    capital: "Пекин",
    coordinates: { x: 83, y: 45 },
    hint: "Расположен в северной части Великой Китайской равнины"
  },
  {
    country: "Бразилия",
    capital: "Бразилиа",
    coordinates: { x: 28, y: 67 },
    hint: "Расположен в центрально-западном регионе страны"
  },
  {
    country: "Египет",
    capital: "Каир",
    coordinates: { x: 59, y: 55 },
    hint: "Расположен недалеко от дельты Нила в северном Египте"
  }
];

// English translations of capital data
const capitalPointsEn: CapitalPoint[] = [
  {
    country: "France",
    capital: "Paris",
    coordinates: { x: 47.2, y: 42.5 },
    hint: "Located on the Seine River in northern France"
  },
  {
    country: "United Kingdom",
    capital: "London", 
    coordinates: { x: 44.5, y: 38.5 },
    hint: "Located on the Thames River in southeastern England"
  },
  {
    country: "Spain",
    capital: "Madrid",
    coordinates: { x: 41.8, y: 55.3 },
    hint: "Located in the center of the Iberian Peninsula"
  },
  {
    country: "Italy",
    capital: "Rome",
    coordinates: { x: 53.5, y: 58.2 },
    hint: "Located in the central-western portion of the Italian Peninsula"
  },
  {
    country: "Germany",
    capital: "Berlin",
    coordinates: { x: 52.8, y: 41.5 },
    hint: "Located in northeastern Germany"
  },
  {
    country: "Russia",
    capital: "Moscow",
    coordinates: { x: 65, y: 39 },
    hint: "Located on the Moscow River in western Russia"
  },
  {
    country: "Japan",
    capital: "Tokyo",
    coordinates: { x: 88, y: 49 },
    hint: "Located on the southeastern side of the main island of Honshu"
  },
  {
    country: "China",
    capital: "Beijing",
    coordinates: { x: 83, y: 45 },
    hint: "Located in the northern part of the North China Plain"
  },
  {
    country: "Brazil",
    capital: "Brasilia",
    coordinates: { x: 28, y: 67 },
    hint: "Located in the central-western region of the country"
  },
  {
    country: "Egypt",
    capital: "Cairo",
    coordinates: { x: 59, y: 55 },
    hint: "Located near the Nile delta in northern Egypt"
  }
];

export default function CapitalsGame() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { updatePoints } = useContext(UserContext);
  const { language, t } = useLanguage();
  const [currentCapitalIndex, setCurrentCapitalIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showAllMarkers, setShowAllMarkers] = useState(false);
  
  // Choose the appropriate data based on the language
  const activeCapitalPoints = language === 'ru' ? capitalPoints : capitalPointsEn;
  const currentCapital = activeCapitalPoints[currentCapitalIndex];
  
  // Calculate distance between two points on the map (simplified for demonstration)
  const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle map click to set marker position
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing" || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSelectedCoordinates({ x, y });
  };

  // Submit the selected coordinates for evaluation
  const submitGuess = () => {
    if (!selectedCoordinates || gameState !== "playing") return;
    
    const distanceVal = calculateDistance(selectedCoordinates, currentCapital.coordinates);
    setDistance(distanceVal);
    
    // Determine if the guess is correct (within a certain radius)
    const isGuessCorrect = distanceVal < 10; // 10% of the map width/height as accuracy threshold
    setIsCorrect(isGuessCorrect);
    
    // Update score
    if (isGuessCorrect) {
      const newPoints = Math.max(20 - attempts * 5, 5); // Decrease points with more attempts
      setScore(prevScore => prevScore + newPoints);
      updatePoints(newPoints);
    }
    
    setAttempts(prev => prev + 1);
    setGameState("feedback");
  };

  // Move to the next capital
  const nextCapital = () => {
    if (currentCapitalIndex < activeCapitalPoints.length - 1) {
      setCurrentCapitalIndex(prev => prev + 1);
      setGameState("playing");
      setSelectedCoordinates(null);
      setDistance(null);
      setIsCorrect(false);
      setAttempts(0);
      setShowHint(false);
      setShowAllMarkers(false);
    } else {
      setGameState("completed");
      setShowAllMarkers(true);
    }
  };

  // Restart the game
  const restartGame = () => {
    setCurrentCapitalIndex(0);
    setGameState("playing");
    setSelectedCoordinates(null);
    setDistance(null);
    setIsCorrect(false);
    setAttempts(0);
    setShowHint(false);
    setShowAllMarkers(false);
    setScore(0);
  };

  // Show a hint after waiting a bit
  useEffect(() => {
    if (gameState === "playing" && attempts >= 1) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, attempts]);

  return (
    <section id="capitals-game" className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 mb-12 border border-blue-100/30">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("Найди столицу", "Find the Capital")}
          </h2>
          <p className="text-sm text-gray-500">
            {gameState === "completed" 
              ? t("Игра завершена! Смотрите расположение всех столиц ниже.", "Game completed! See all capitals locations below.") 
              : t("Нажмите на карту, чтобы найти столицу", "Click on the map to find the capital")}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full px-4 py-2 text-white font-medium shadow-md">
          <span className="mr-1">{t("Счет:", "Score:")}</span>
          <span className="font-bold">{score}</span>
        </div>
      </div>
      
      {/* Game progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">{t("Прогресс", "Progress")}</span>
          <span className="font-medium text-primary">{currentCapitalIndex + 1} / {activeCapitalPoints.length}</span>
        </div>
        <Progress 
          value={((currentCapitalIndex + 1) / activeCapitalPoints.length) * 100} 
          className="h-2 bg-gray-100" 
          indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-600" 
        />
      </div>
      
      {/* Current task */}
      {gameState !== "completed" && (
        <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center">
            <Flag className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium text-gray-800">
              {t("Найдите столицу", "Find the capital")} <span className="font-semibold text-primary">{currentCapital.country}</span>: {currentCapital.capital}
            </span>
          </div>
          
          {showHint && (
            <div className="mt-2 text-sm text-gray-600 pl-7">
              <span className="font-medium">{t("Подсказка:", "Hint:")}</span> {currentCapital.hint}
            </div>
          )}
        </div>
      )}
      
      {/* Map */}
      <div 
        ref={mapRef}
        className="relative h-96 bg-blue-50 rounded-lg shadow-inner mb-4 overflow-hidden cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* Real World Map Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1200px-World_map_-_low_resolution.svg.png"
            alt="World Map"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to another world map if the first one fails to load
              e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/World_map_blue.svg/1280px-World_map_blue.svg.png";
            }}
          />
          {/* Grid overlay to help with positioning */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-5 opacity-20 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="border-r border-white h-full" style={{ left: `${i * 10}%` }}></div>
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`h-${i}`} className="border-b border-white w-full" style={{ top: `${i * 20}%` }}></div>
            ))}
          </div>
        </div>
        
        {/* Map overlay for better contrast */}
        <div className="absolute inset-0 bg-blue-900/5"></div>
        
        {/* Selected marker */}
        {selectedCoordinates && (
          <div 
            className="absolute w-6 h-6 transform -translate-x-3 -translate-y-6 animate-bounce"
            style={{ 
              left: `${selectedCoordinates.x}%`, 
              top: `${selectedCoordinates.y}%` 
            }}
          >
            <MapPin 
              className={`h-6 w-6 ${gameState === "feedback" 
                ? isCorrect 
                  ? "text-green-500 drop-shadow-glow-green" 
                  : "text-red-500 drop-shadow-glow-red" 
                : "text-white drop-shadow-glow-white"}`} 
            />
          </div>
        )}
        
        {/* Actual location (only shown during feedback or when game is completed) */}
        {(gameState === "feedback" || showAllMarkers) && (
          <div 
            className="absolute w-6 h-6 transform -translate-x-3 -translate-y-6 animate-pulse"
            style={{ 
              left: `${currentCapital.coordinates.x}%`, 
              top: `${currentCapital.coordinates.y}%` 
            }}
          >
            <div className="relative">
              <MapPin className="h-6 w-6 text-emerald-500 drop-shadow-glow-green" />
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-xs px-2 py-1 rounded">
                {currentCapital.capital}
              </div>
            </div>
          </div>
        )}
        
        {/* Show all markers when game is completed */}
        {showAllMarkers && activeCapitalPoints.map((point, index) => (
          index !== currentCapitalIndex && (
            <div 
              key={index}
              className="absolute w-6 h-6 transform -translate-x-3 -translate-y-6"
              style={{ 
                left: `${point.coordinates.x}%`, 
                top: `${point.coordinates.y}%` 
              }}
            >
              <div className="relative">
                <MapPin className="h-5 w-5 text-blue-500 drop-shadow-glow-blue" />
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {point.capital}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Feedback area */}
      {gameState === "feedback" && (
        <div className={`mb-4 p-4 rounded-lg animate-fade-in ${
          isCorrect ? "bg-success/10 border border-success/30" : "bg-error/10 border border-error/30"
        }`}>
          <div className="flex items-start">
            <div className="mt-0.5 mr-3">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-error" />
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-gray-800">
                {isCorrect 
                  ? t("Отличная работа!", "Great job!") 
                  : t("Не совсем так", "Not quite right")}
              </h4>
              <p className="text-sm text-gray-700">
                {isCorrect 
                  ? t(`Вы нашли ${currentCapital.capital} на карте! ${attempts === 1 ? "С первой попытки!" : ""}`,
                      `You found ${currentCapital.capital} on the map! ${attempts === 1 ? "On your first try!" : ""}`)
                  : t(`Столица ${currentCapital.country} (${currentCapital.capital}) находится в другом месте. Постарайтесь запомнить на будущее!`,
                      `The capital of ${currentCapital.country} (${currentCapital.capital}) is in a different location. Try to remember for next time!`)
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Game completed summary */}
      {gameState === "completed" && (
        <div className="mb-4 p-5 bg-primary/10 rounded-lg border border-primary/30">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t("Игра завершена!", "Game completed!")}
          </h3>
          <p className="text-gray-700">
            {t(`Вы набрали ${score} очков. На карте выше показаны все местоположения столиц.`,
               `You scored ${score} points. The map above shows the locations of all capitals.`)}
          </p>
          <div className="mt-4">
            <Button 
              onClick={restartGame}
              className="bg-gradient-to-r from-primary to-primary/80 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> {t("Играть снова", "Play again")}
            </Button>
          </div>
        </div>
      )}
      
      {/* Actions */}
      {gameState === "playing" && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => {
              setSelectedCoordinates(null);
              setAttempts(0);
              setShowHint(false);
            }}
            disabled={!selectedCoordinates}
          >
            {t("Очистить выбор", "Clear selection")}
          </Button>
          
          <div className="space-x-3">
            <Button
              variant="outline"
              className="bg-white text-gray-700 border-gray-200"
              onClick={() => {
                setGameState("feedback");
                setIsCorrect(false);
                setShowAllMarkers(false);
              }}
            >
              <SkipForward className="mr-2 h-4 w-4" /> {t("Пропустить", "Skip")}
            </Button>
            
            <Button
              className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
              onClick={submitGuess}
              disabled={!selectedCoordinates}
            >
              {t("Отправить ответ", "Submit answer")}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "feedback" && (
        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-md"
            onClick={nextCapital}
          >
            {currentCapitalIndex < activeCapitalPoints.length - 1 ? t("Следующая столица", "Next capital") : t("Завершить игру", "Finish game")}
          </Button>
        </div>
      )}
    </section>
  );
}