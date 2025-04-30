import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button 
      onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
      className="flex items-center justify-center space-x-2 bg-white/90 text-gray-700 py-1.5 px-4 rounded-full shadow-sm hover:bg-white transition-colors duration-200 border border-gray-200"
      aria-label="Switch language"
    >
      <span className="i-lucide-languages w-4 h-4"></span>
      <span className="font-medium">{language.toUpperCase()}</span>
    </button>
  );
}