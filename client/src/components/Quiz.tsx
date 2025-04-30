import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/data/quiz";
import { UserContext } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Award, CheckCircle, XCircle, SkipForward, HelpCircle } from "lucide-react";

type AnswerState = {
  answered: boolean;
  selectedIndex: number | null;
  correct: boolean;
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    answered: false,
    selectedIndex: null,
    correct: false,
  });
  const [animateIn, setAnimateIn] = useState(true);
  const { updatePoints } = useContext(UserContext);
  const { t, language } = useLanguage();
  
  const question = quizQuestions[currentQuestion];
  const questionText = language === "ru" && question.questionRu ? question.questionRu : question.question;
  const optionsText = language === "ru" && question.optionsRu ? question.optionsRu : question.options;
  const explanationText = language === "ru" && question.explanationRu ? question.explanationRu : question.explanation;
  
  useEffect(() => {
    setAnimateIn(true);
    const timeout = setTimeout(() => {
      setAnimateIn(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [currentQuestion]);
  
  const handleOptionClick = (index: number) => {
    if (answerState.answered) return;
    
    const correct = index === question.correctIndex;
    const newPoints = correct ? points + 10 : points;
    
    setAnswerState({
      answered: true,
      selectedIndex: index,
      correct,
    });
    
    setPoints(newPoints);
    updatePoints(correct ? 10 : 0);
  };
  
  const handleSkip = () => {
    setAnswerState({
      answered: true,
      selectedIndex: null,
      correct: false,
    });
  };
  
  const handleNext = () => {
    setCurrentQuestion((prev) => (prev + 1) % quizQuestions.length);
    setAnswerState({
      answered: false,
      selectedIndex: null,
      correct: false,
    });
  };
  
  return (
    <section id="quiz" className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 mb-12 overflow-hidden border border-gray-100">
      <div className="relative mb-8">
        {/* Quiz header with decorative elements */}
        <div className="absolute -right-4 -top-6">
          <div className="text-primary/10 animate-pulse">
            <BookOpen size={100} />
          </div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">
              {t("Географическая Викторина", "Geography Quiz")}
            </h2>
            <p className="text-gray-500 text-sm">
              {t("Проверьте свои знания с помощью интересных вопросов", "Test your knowledge with fun questions")}
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary to-secondary rounded-full px-4 py-2 text-white font-heading font-semibold flex items-center shadow-md">
            <Award className="h-5 w-5 mr-2 text-white" />
            <span className="mr-1">{t("Очки:", "Points:")}</span>
            <span className="text-white font-bold">{points}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question content with animation */}
      <div className={`mb-8 ${animateIn ? 'animate-fade-in' : ''}`}>
        <div className="text-xl font-heading font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded mr-2">Q{currentQuestion + 1}:</span>
          {questionText}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionsText.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`text-left px-6 py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow
                ${answerState.answered
                  ? index === question.correctIndex
                    ? "bg-gradient-to-r from-success to-success/80 text-white"
                    : index === answerState.selectedIndex
                    ? "bg-gradient-to-r from-error to-error/80 text-white"
                    : "bg-white border border-gray-100 text-gray-500"
                  : "bg-white border border-gray-100 hover:border-primary/30"
                }`}
              disabled={answerState.answered}
            >
              <div className="flex items-center">
                <div className={`h-6 w-6 mr-3 rounded-full flex items-center justify-center 
                  ${answerState.answered && index === question.correctIndex 
                    ? "bg-white text-success" 
                    : answerState.answered && index === answerState.selectedIndex 
                    ? "bg-white text-error" 
                    : "bg-primary/10 text-primary"}`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
                
                {/* Show icons for correct/incorrect answers */}
                {answerState.answered && (
                  <div className="ml-auto">
                    {index === question.correctIndex ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : index === answerState.selectedIndex ? (
                      <XCircle className="h-5 w-5 text-white" />
                    ) : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Feedback area */}
      {answerState.answered && (
        <div className={`mb-6 p-5 rounded-lg border animate-slide-in ${
          answerState.selectedIndex !== null && answerState.correct
            ? "bg-success/5 border-success/20 text-success"
            : answerState.selectedIndex !== null
            ? "bg-error/5 border-error/20 text-error"
            : "bg-gray-50 border-gray-200 text-gray-700"
        }`}>
          <div className="flex items-start">
            <div className="mt-0.5 mr-3">
              {answerState.selectedIndex !== null ? (
                answerState.correct ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )
              ) : (
                <HelpCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-1">
                {answerState.selectedIndex !== null 
                  ? answerState.correct 
                    ? t("Правильно!", "Correct!") 
                    : t("Неправильно!", "Incorrect!")
                  : t("Вопрос пропущен", "Question Skipped")
                }
              </h4>
              <p className="text-gray-700">{explanationText}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions area */}
      <div className="flex justify-between items-center">
        <div className="text-gray-500 text-sm">
          {t("Вопрос", "Question")} {currentQuestion + 1} {t("из", "of")} {quizQuestions.length}
        </div>
        
        {!answerState.answered ? (
          <Button
            onClick={handleSkip}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          >
            <SkipForward className="mr-2 h-4 w-4" /> {t("Пропустить", "Skip")}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {currentQuestion + 1 < quizQuestions.length 
              ? t("Следующий вопрос", "Next Question") 
              : t("Начать заново", "Restart Quiz")
            }
          </Button>
        )}
      </div>
    </section>
  );
}
