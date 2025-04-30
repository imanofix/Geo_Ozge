import { useState, useEffect, useContext, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Globe, MapPin, RefreshCw } from "lucide-react";
import { countryData } from "@/data/countries";
import { UserContext } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

type FlashcardType = {
  country: string;
  capital: string;
};

export default function Flashcards() {
  const [region, setRegion] = useState<string>("world");
  const [currentCards, setCurrentCards] = useState<FlashcardType[]>(countryData.world);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cardTheme, setCardTheme] = useState<number>(0);
  const { user, updateStudiedCards } = useContext(UserContext);
  const { language, t } = useLanguage();
  
  // Card themes for different regions with unique designs for each continent
  const cardThemes = [
    // World - Blue/Green with globe pattern
    { 
      front: "bg-gradient-to-br from-primary to-blue-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/jM0T4lH.png')] before:bg-no-repeat before:bg-center before:bg-contain before:opacity-5 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-secondary to-green-600 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/jM0T4lH.png')] before:bg-no-repeat before:bg-center before:bg-contain before:opacity-5 before:mix-blend-overlay" 
    },
    // Africa - Purple with tribal pattern
    { 
      front: "bg-gradient-to-br from-purple-600 to-purple-800 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/XJ1QEuy.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-violet-500 to-violet-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/XJ1QEuy.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
    // Asia - Red/Orange with cherry blossom pattern
    { 
      front: "bg-gradient-to-br from-rose-500 to-red-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/MKMZfKL.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-orange-500 to-orange-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/MKMZfKL.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
    // Europe - Teal/Cyan with classical column pattern
    { 
      front: "bg-gradient-to-br from-emerald-500 to-teal-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/U3A9Erb.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-cyan-500 to-cyan-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/U3A9Erb.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
    // North America - Amber/Yellow with eagle pattern
    { 
      front: "bg-gradient-to-br from-amber-500 to-yellow-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/rRGgpK2.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-lime-500 to-lime-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/rRGgpK2.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
    // South America - Fuchsia/Pink with Inca pattern
    { 
      front: "bg-gradient-to-br from-fuchsia-500 to-pink-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/V9Vgv5s.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-pink-400 to-pink-600 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/V9Vgv5s.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
    // Oceania - Blue/Indigo with wave pattern
    { 
      front: "bg-gradient-to-br from-indigo-500 to-blue-900 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/HVpMTXJ.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay", 
      back: "bg-gradient-to-br from-blue-400 to-blue-700 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://i.imgur.com/HVpMTXJ.png')] before:bg-repeat before:opacity-10 before:mix-blend-overlay" 
    },
  ];

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setCurrentCards(countryData[value as keyof typeof countryData]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCountdownActive(false);
    
    // Reset progress for new region
    setProgress(0);
    
    // Set card theme based on region
    switch(value) {
      case "world":
        setCardTheme(0);
        break;
      case "africa":
        setCardTheme(1);
        break;
      case "asia":
        setCardTheme(2);
        break;
      case "europe":
        setCardTheme(3);
        break;
      case "namerica":
        setCardTheme(4);
        break;
      case "samerica":
        setCardTheme(5);
        break;
      case "oceania":
        setCardTheme(6);
        break;
      default:
        setCardTheme(0);
    }
  };

  const revealAnswer = () => {
    setIsFlipped(true);
    setCountdownActive(true);
    setCountdown(3);
    updateStudiedCards();
    
    // Update progress when viewing answer
    const newProgress = ((currentIndex + 1) / currentCards.length) * 100;
    setProgress(newProgress);
  };

  const nextCard = useCallback(() => {
    setCountdownActive(false);
    setCurrentIndex((prev) => (prev + 1) % currentCards.length);
    setIsFlipped(false);
  }, [currentCards.length]);

  const prevCard = () => {
    setCountdownActive(false);
    setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
    setIsFlipped(false);
  };

  // Use smaller time intervals for smoother countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => Math.max(0, prev - 0.1));
      }, 100);
    } else if (countdownActive && countdown <= 0) {
      nextCard();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, countdownActive, nextCard]);

  // Calculate the percentage of cards studied in the current region
  const regionProgress = Math.round(progress);

  return (
    <section id="flashcards" className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100/30">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("Флэш-карточки", "Flashcards")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("Изучайте страны и столицы", "Learn countries and capitals")}
            </p>
          </div>
          <div className="relative">
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-40 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Globe className="h-4 w-4 mr-2 text-primary/70" />
                <SelectValue placeholder={t("Выберите регион", "Select region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="world">{t("Весь мир", "World")}</SelectItem>
                <SelectItem value="africa">{t("Африка", "Africa")}</SelectItem>
                <SelectItem value="asia">{t("Азия", "Asia")}</SelectItem>
                <SelectItem value="europe">{t("Европа", "Europe")}</SelectItem>
                <SelectItem value="namerica">{t("Северная Америка", "North America")}</SelectItem>
                <SelectItem value="samerica">{t("Южная Америка", "South America")}</SelectItem>
                <SelectItem value="oceania">{t("Океания", "Oceania")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{t("Прогресс региона", "Region progress")}</span>
            <span className="font-medium text-primary">{regionProgress}%</span>
          </div>
          <Progress 
            value={regionProgress} 
            className="h-2 bg-gray-100" 
            indicatorClassName="bg-gradient-to-r from-primary to-secondary" 
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{t("Всего изучено карточек", "Total cards studied")}</span>
            <span className="font-medium text-primary">{user?.cardsStudied || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Flashcard */}
      <div 
        className={`flip-card mb-6 ${isFlipped ? 'flipped' : ''}`}
        style={{ perspective: "1000px", height: "260px" }}
      >
        <div className="flip-card-inner shadow-lg">
          {/* Front of card */}
          <div 
            className={`flip-card-front ${cardThemes[cardTheme].front} text-white rounded-2xl p-8 cursor-pointer`}
            onClick={revealAnswer}
          >
            <div className="absolute top-4 right-4 opacity-10">
              <Globe size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wider font-semibold">
                  {t("Страна", "Country")}
                </p>
                <h3 className="text-3xl font-heading font-bold mt-1 mb-2">
                  {currentCards[currentIndex]?.country}
                </h3>
              </div>
              
              <div className="text-center mt-auto">
                <p className="text-lg mb-4">
                  {t("Нажмите, чтобы увидеть столицу", "Click to see the capital")}
                </p>
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div className={`flip-card-back ${cardThemes[cardTheme].back} text-white rounded-2xl p-8`}>
            <div className="absolute top-4 right-4 opacity-10">
              <MapPin size={100} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm uppercase tracking-wider font-semibold">
                      {t("Страна", "Country")}
                    </p>
                    <h3 className="text-2xl font-heading font-bold mt-1">
                      {currentCards[currentIndex]?.country}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="relative h-14 w-14">
                      <svg className="progress-ring" viewBox="0 0 48 48" width="56" height="56">
                        <circle
                          className="opacity-30"
                          stroke="#ffffff"
                          strokeWidth="4"
                          fill="transparent"
                          r="20"
                          cx="24"
                          cy="24"
                        />
                        <circle
                          className="progress-ring-circle transition-all duration-100 ease-linear"
                          stroke="#ffffff"
                          strokeWidth="4"
                          fill="transparent"
                          r="20"
                          cx="24"
                          cy="24"
                          strokeDasharray="125.6"
                          strokeDashoffset={(3 - countdown) / 3 * 125.6}
                          strokeLinecap="round"
                          transform="rotate(-90, 24, 24)"
                        />
                        <text x="24" y="28" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">
                          {Math.ceil(countdown)}
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/80 text-sm uppercase tracking-wider font-semibold">
                  {t("Столица", "Capital")}
                </p>
                <p className="text-3xl font-heading font-bold mt-1">
                  {currentCards[currentIndex]?.capital}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={prevCard} 
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {t("Предыдущая", "Previous")}
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setIsFlipped(false);
              setCountdownActive(false);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-500 hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="text-gray-600 font-medium">
            <span>{currentIndex + 1}</span> / 
            <span>{currentCards.length}</span>
          </div>
        </div>
        
        <Button 
          onClick={nextCard}
          className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white shadow-md"
        >
          {t("Следующая", "Next")} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
