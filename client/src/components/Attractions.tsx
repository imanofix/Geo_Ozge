import { useState, useEffect, useRef } from "react";
import { attractions } from "@/data/attractions";
import { Progress } from "@/components/ui/progress";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Attractions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(20);
  const [progress, setProgress] = useState(100);
  const [transitioning, setTransitioning] = useState(false);
  const { language, t } = useLanguage();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Navigate to next attraction
  const nextAttraction = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % attractions.length);
    setTimer(20);
    setProgress(100);
    
    setTimeout(() => {
      setTransitioning(false);
    }, 500);
  };

  // Navigate to previous attraction
  const prevAttraction = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + attractions.length) % attractions.length);
    setTimer(20);
    setProgress(100);
    
    setTimeout(() => {
      setTransitioning(false);
    }, 500);
  };

  // Smooth countdown with progress bar
  useEffect(() => {
    // Smoother countdown with shorter interval
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.1) {
          nextAttraction();
          return 20;
        }
        return prev - 0.1;
      });
      
      setProgress((timer / 20) * 100);
    }, 100); // Update 10 times per second for smoother animation

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer]);

  return (
    <section id="attractions" className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 relative overflow-hidden border border-blue-100/30 mb-12" style={{ minHeight: "400px" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("Знаменитые достопримечательности", "Famous Attractions")}
          </h2>
          <p className="text-sm text-gray-500">
            {t("Исследуйте известные места по всему миру", "Explore iconic landmarks around the world")}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border-gray-200"
            onClick={prevAttraction}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full border-gray-200"
            onClick={nextAttraction}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative h-[350px] overflow-hidden rounded-lg shadow-md">
        {attractions.map((attraction, index) => (
          <div 
            key={index} 
            className={`attraction-slide absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0"}`}
          >
            <div className="w-full h-full bg-gray-200 transition-all duration-500">
              <img 
                src={attraction.imageUrl} 
                alt={language === "ru" ? attraction.name : attraction.nameEn}
                className="w-full h-full object-cover transition-transform duration-700 transform scale-105"
                onError={(e) => {
                  // Fallback to a default image if loading fails
                  e.currentTarget.src = "https://images.unsplash.com/photo-1589519160732-576f165b9aad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 text-accent mt-1 mr-2" />
                  <div>
                    <h3 className="text-white font-heading font-bold text-2xl">
                      {language === "ru" 
                        ? (attraction.name || attraction.nameEn) 
                        : (attraction.nameEn || attraction.name)}
                    </h3>
                    <p className="text-white/90 text-sm font-medium">
                      {language === "ru" 
                        ? (attraction.location || attraction.locationEn) 
                        : (attraction.locationEn || attraction.location)}
                    </p>
                  </div>
                </div>
                <p className="text-white/80 pr-4 text-sm leading-relaxed">
                  {language === "ru" 
                    ? (attraction.description || attraction.descriptionEn) 
                    : (attraction.descriptionEn || attraction.description)}
                </p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">
                      {t("Следующая достопримечательность", "Next attraction")}
                    </span>
                    <span className="font-medium text-white">
                      {Math.ceil(timer)}{t("с", "s")}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-1 bg-white/20" 
                    indicatorClassName="bg-gradient-to-r from-accent to-accent/80" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {attractions.map((_, index) => (
          <button 
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-primary scale-125" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setTimer(20);
              setProgress(100);
            }}
          ></button>
        ))}
      </div>
    </section>
  );
}
