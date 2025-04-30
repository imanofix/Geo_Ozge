import { useState, useEffect, useRef } from "react";
import { funFacts, type FactType } from "@/data/funFacts";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FunFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Smoother countdown with shorter interval
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0.1) {
          setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
          setProgress(100);
          return 30;
        }
        return prev - 0.1;
      });
      
      setProgress((timer / 30) * 100);
    }, 100); // Update 10 times per second for smoother animation

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer]);

  return (
    <section className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-6 text-white relative overflow-hidden mb-12" style={{ minHeight: "200px" }}>
      <h2 className="text-2xl font-heading font-bold mb-6">
        {t("Интересные факты о географии", "Geography Fun Facts")}
      </h2>
      
      <div className="relative h-24">
        {funFacts.map((fact, index) => (
          <div 
            key={index} 
            className={`fact-slide ${index === currentFactIndex ? "active" : ""}`}
            style={{ 
              transition: "opacity 0.8s ease-in-out",
              opacity: index === currentFactIndex ? 1 : 0
            }}
          >
            <p className="text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {language === "ru" ? fact.ru : fact.en}
            </p>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-6 text-sm text-white/80 flex items-center">
        <div className="mr-3 w-20 bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-accent h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span>{t("Следующий", "Next")}: {Math.ceil(timer)}{t("с", "s")}</span>
      </div>
    </section>
  );
}
