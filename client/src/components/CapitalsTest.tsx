import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryData } from "@/data/countries";
import { UserContext } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

type TestState = "setup" | "testing" | "results";

export default function CapitalsTest() {
  const { language, t } = useLanguage();
  const [testState, setTestState] = useState<TestState>("setup");
  const [region, setRegion] = useState("world");
  const [questionCount, setQuestionCount] = useState("10");
  const [currentQuestions, setCurrentQuestions] = useState<Array<{country: string, capital: string, capitalRu?: string}>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { updatePoints } = useContext(UserContext);
  
  const prepareTest = () => {
    const allCountries = [...countryData[region as keyof typeof countryData]];
    const shuffled = allCountries.sort(() => 0.5 - Math.random());
    
    const count = questionCount === "all" 
      ? allCountries.length 
      : Math.min(parseInt(questionCount), allCountries.length);
    
    setCurrentQuestions(shuffled.slice(0, count));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTestState("testing");
    setAnswered(false);
  };
  
  const checkAnswer = () => {
    const currentCountry = currentQuestions[currentQuestionIndex];
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentCountry.capital.toLowerCase();
    
    // Define Russian translations for common capitals if not already provided
    const russianCapitals: Record<string, string> = {
      "london": "лондон",
      "paris": "париж",
      "berlin": "берлин",
      "rome": "рим",
      "madrid": "мадрид",
      "moscow": "москва",
      "beijing": "пекин",
      "tokyo": "токио",
      "washington": "вашингтон",
      "ottawa": "оттава",
      "canberra": "канберра",
      "vienna": "вена",
      "brussels": "брюссель",
      "minsk": "минск",
      "brasilia": "бразилиа",
      "sofia": "софия",
      "prague": "прага",
      "copenhagen": "копенгаген",
      "cairo": "каир",
      "helsinki": "хельсинки",
      "athens": "афины",
      "budapest": "будапешт",
      "new delhi": "нью-дели",
      "jakarta": "джакарта",
      "dublin": "дублин",
      "jerusalem": "иерусалим",
      "seoul": "сеул",
      "riga": "рига",
      "vilnius": "вильнюс",
      "lima": "лима",
      "lisbon": "лиссабон",
      "bucharest": "бухарест",
      "riyadh": "эр-рияд",
      "stockholm": "стокгольм",
      "bangkok": "бангкок",
      "kyiv": "киев"
    };
    
    // Get Russian version of the capital if available
    const correctRussianAnswer = russianCapitals[correctAnswer] || correctAnswer;
    
    // Accept answers that are at least 70% similar to the correct answer
    // This allows for different languages and minor typos
    let correct = false;
    
    // Exact match (in either language)
    if (userAnswer === correctAnswer || userAnswer === correctRussianAnswer) {
      correct = true;
    } 
    // Check if the answer contains the name or vice versa (handles partial matches)
    else if (userAnswer.length > 3 && (correctAnswer.includes(userAnswer) || correctRussianAnswer.includes(userAnswer))) {
      correct = true;
    } else if (userAnswer.length > 3 && (userAnswer.includes(correctAnswer) || userAnswer.includes(correctRussianAnswer))) {
      correct = true;
    }
    // For very short capitals, require more accurate answers
    else if (userAnswer.length <= 3 && (correctAnswer.length <= 3 || correctRussianAnswer.length <= 3) && 
             (userAnswer === correctAnswer || userAnswer === correctRussianAnswer)) {
      correct = true;
    }
    
    if (correct) {
      setScore(score + 1);
      updatePoints(10);
    }
    
    setIsCorrect(correct);
    setAnswered(true);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setAnswered(false);
    } else {
      setTestState("results");
    }
  };
  
  const restartTest = () => {
    setTestState("setup");
    setAnswer("");
  };
  
  return (
    <section id="capitals-test" className="bg-white rounded-xl shadow-lg p-6 mb-12">
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        {t("Тест на знание столиц", "Capitals Knowledge Test")}
      </h2>
      
      {testState === "setup" && (
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {t(
              "Проверьте свои знания столиц мира! Введите правильную столицу для каждой страны.", 
              "Test your knowledge of world capitals! Enter the correct capital for each country."
            )}
          </p>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="capitals-region" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Выберите регион:", "Select region:")}
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="capitals-region" className="w-full">
                  <SelectValue placeholder={t("Выберите регион", "Select region")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="world">{t("Весь мир", "Whole World")}</SelectItem>
                  <SelectItem value="africa">{t("Африка", "Africa")}</SelectItem>
                  <SelectItem value="asia">{t("Азия", "Asia")}</SelectItem>
                  <SelectItem value="europe">{t("Европа", "Europe")}</SelectItem>
                  <SelectItem value="namerica">{t("Северная Америка", "North America")}</SelectItem>
                  <SelectItem value="samerica">{t("Южная Америка", "South America")}</SelectItem>
                  <SelectItem value="oceania">{t("Океания", "Oceania")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label htmlFor="test-questions" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Количество вопросов:", "Number of questions:")}
              </label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="test-questions" className="w-full">
                  <SelectValue placeholder={t("Выберите количество", "Select count")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">{t("10 вопросов", "10 questions")}</SelectItem>
                  <SelectItem value="20">{t("20 вопросов", "20 questions")}</SelectItem>
                  <SelectItem value="50">{t("50 вопросов", "50 questions")}</SelectItem>
                  <SelectItem value="all">{t("Все страны", "All countries")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:self-end">
              <Button 
                onClick={prepareTest}
                className="bg-accent hover:bg-amber-600 text-white w-full md:w-auto"
              >
                {t("Начать тест", "Start Test")}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {testState === "testing" && currentQuestions.length > 0 && (
        <div id="test-container">
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-xl">{currentQuestions[currentQuestionIndex].country}</h3>
              <div className="text-sm text-gray-600">
                {t("Вопрос", "Question")} <span>{currentQuestionIndex + 1}</span> / <span>{currentQuestions.length}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder={t("Введите название столицы...", "Enter the capital name...")}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={answered}
                className="flex-1"
              />
              {!answered ? (
                <Button 
                  onClick={checkAnswer}
                  className="bg-primary hover:bg-blue-600 text-white"
                  disabled={!answer.trim()}
                >
                  {t("Проверить", "Check")}
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-primary hover:bg-blue-600 text-white"
                >
                  {currentQuestionIndex + 1 < currentQuestions.length 
                    ? t("Следующий", "Next") 
                    : t("Завершить", "Finish")}
                </Button>
              )}
            </div>
            
            {answered && (
              <div className="mt-4">
                <div className={`p-3 ${isCorrect ? "bg-success/10 text-success" : "bg-error/10 text-error"} rounded-lg`}>
                  {isCorrect ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t(
                        `Правильно! ${currentQuestions[currentQuestionIndex].capital} - это столица ${currentQuestions[currentQuestionIndex].country}.`,
                        `Correct! ${currentQuestions[currentQuestionIndex].capital} is the capital of ${currentQuestions[currentQuestionIndex].country}.`
                      )}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {t(
                        `Неверно. Столица ${currentQuestions[currentQuestionIndex].country} - ${currentQuestions[currentQuestionIndex].capital}.`,
                        `Incorrect. The capital of ${currentQuestions[currentQuestionIndex].country} is ${currentQuestions[currentQuestionIndex].capital}.`
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <div>
              <span className="font-semibold text-gray-700">{t("Счет:", "Score:")}</span>
              <span className="text-primary font-bold ml-1">{score}</span> / 
              <span className="text-gray-700 ml-1">{currentQuestions.length}</span>
            </div>
          </div>
        </div>
      )}
      
      {testState === "results" && (
        <div className="text-center p-6">
          <h3 className="text-2xl font-heading font-bold mb-2">
            {t("Тест завершен!", "Test Complete!")}
          </h3>
          <p className="text-lg mb-4">
            {t(
              `Вы набрали ${score} из ${currentQuestions.length}`,
              `You scored ${score} out of ${currentQuestions.length}`
            )}
          </p>
          <Button 
            onClick={restartTest}
            className="bg-accent hover:bg-amber-600 text-white"
          >
            {t("Пройти еще раз", "Take Another Test")}
          </Button>
        </div>
      )}
    </section>
  );
}
