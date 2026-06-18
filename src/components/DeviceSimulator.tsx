import React, { useState, useEffect, useRef } from "react";
import { 
  Battery, Wifi, Signal, Moon, Sun, Play, Award, 
  RotateCcw, Home, Volume2, VolumeX, BookOpen, Layout, Layers, 
  Check, X, ChevronRight, HelpCircle, Trophy
} from "lucide-react";
import { QUIZ_TOPICS, Topic, Question } from "../data/questions";
import { sound } from "../utils/sound";

interface DeviceSimulatorProps {
  onSelectTopicCode: (topicId: string) => void;
}

export default function DeviceSimulator({ onSelectTopicCode }: DeviceSimulatorProps) {
  // Simulator Environment States
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<Record<string, number>>({
    "kotlin-basics": 0,
    "android-ui": 0,
    "kotlin-mvvm": 0
  });

  // App screen navigation: "home" | "quiz" | "result"
  const [screen, setScreen] = useState<"home" | "quiz" | "result">("home");
  
  // Game Play States
  const [selectedTopic, setSelectedTopic] = useState<Topic>(QUIZ_TOPICS[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [userChoices, setUserChoices] = useState<Record<number, number>>({});
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Sound play handler
  const playSfx = (type: "click" | "tick" | "correct" | "wrong" | "victory") => {
    if (isMuted) return;
    if (type === "click") sound.playClick();
    if (type === "tick") sound.playTick();
    if (type === "correct") sound.playCorrect();
    if (type === "wrong") sound.playWrong();
    if (type === "victory") sound.playVictory();
  };

  // Load high scores & settings from localStorage (mocking SharedPreferences)
  useEffect(() => {
    const savedBasics = localStorage.getItem("HIGH_SCORE_kotlin-basics");
    const savedUI = localStorage.getItem("HIGH_SCORE_android-ui");
    const savedMVVM = localStorage.getItem("HIGH_SCORE_kotlin-mvvm");
    const savedMode = localStorage.getItem("DARK_MODE");

    setHighScores({
      "kotlin-basics": savedBasics ? parseInt(savedBasics) : 0,
      "android-ui": savedUI ? parseInt(savedUI) : 0,
      "kotlin-mvvm": savedMVVM ? parseInt(savedMVVM) : 0,
    });

    if (savedMode === "true") {
      setDarkTheme(true);
    }
  }, []);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (screen !== "quiz" || selectedOptionIndex !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Force select incorrect (-1 represents timeout)
          clearInterval(timerRef.current!);
          handleSelectOption(-1); // -1 triggers wrong answer flow
          return 0;
        }
        if (prev <= 10) {
          playSfx("tick"); // warnings ticks for last 10 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, currentQuestionIndex, selectedOptionIndex]);

  // Handle Option selection
  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null) return; // ignore multiple clicks
    
    setSelectedOptionIndex(index);
    const question = selectedTopic.questions[currentQuestionIndex];
    const isCorrect = index === question.correctIndex;

    // Log answer in state tracker
    setUserChoices(prev => ({ ...prev, [currentQuestionIndex]: index }));

    if (isCorrect) {
      setScore(prev => prev + 1);
      playSfx("correct");
    } else {
      playSfx("wrong");
    }
  };

  // Handle Next Question
  const handleNext = () => {
    playSfx("click");
    if (currentQuestionIndex < selectedTopic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setTimeLeft(30);
    } else {
      // Completed the Quiz! Calculate stats and show results
      const finalScore = score + (selectedOptionIndex === selectedTopic.questions[currentQuestionIndex].correctIndex ? 1 : 0);
      const prevHighScore = highScores[selectedTopic.id] || 0;
      
      let isRecord = false;
      if (finalScore > prevHighScore) {
        localStorage.setItem(`HIGH_SCORE_${selectedTopic.id}`, finalScore.toString());
        setHighScores(prev => ({ ...prev, [selectedTopic.id]: finalScore }));
        isRecord = true;
        setIsNewRecord(true);
      } else {
        setIsNewRecord(false);
      }

      setScreen("result");
      if (isRecord) {
        playSfx("victory");
      } else {
        playSfx("click");
      }
    }
  };

  // Start the Quiz
  const handleStartQuiz = () => {
    playSfx("click");
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedOptionIndex(null);
    setUserChoices({});
    setScreen("quiz");
    onSelectTopicCode(selectedTopic.id); // Sync code view category on start
  };

  // Reset/Restart Game
  const handleRetry = () => {
    playSfx("click");
    handleStartQuiz();
  };

  // Quit and Back to Home
  const handleGoHome = () => {
    playSfx("click");
    setScreen("home");
  };

  // Toggle Dark theme (Simulates Android system night mode)
  const handleToggleTheme = () => {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    localStorage.setItem("DARK_MODE", nextTheme.toString());
    playSfx("click");
  };

  const getTopicIcon = (id: string, sizeClass = "w-6 h-6") => {
    switch (id) {
      case "kotlin-basics":
        return <BookOpen className={`${sizeClass} text-indigo-500`} />;
      case "android-ui":
        return <Layout className={`${sizeClass} text-cyan-500`} />;
      case "kotlin-mvvm":
        return <Layers className={`${sizeClass} text-emerald-500`} />;
      default:
        return <HelpCircle className={`${sizeClass} text-indigo-500`} />;
    }
  };

  const currentQuestion: Question = selectedTopic.questions[currentQuestionIndex];

  // Simulated Time of current day
  const currentTimeString = "10:15";

  return (
    <div id="sim-device-root" className="flex flex-col items-center">
      {/* Sound Toggle and Tips */}
      <div className="w-full max-w-sm mb-4 flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          Giả lập SharedPreferences & Lifecycle
        </span>
        <button 
          id="btn-toggle-sound"
          onClick={() => {
            setIsMuted(!isMuted);
            sound.playClick();
          }}
          className="p-1 px-2.5 rounded-lg bg-white dark:bg-zinc-700 shadow-sm border border-gray-200 dark:border-zinc-600 text-xs text-gray-700 dark:text-gray-200 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-zinc-600 transition"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-green-500" />}
          {isMuted ? "Tắt Âm" : "Bật Âm"}
        </button>
      </div>

      {/* Actual Smartphone Wrapper */}
      <div className="relative mx-auto w-[365px] h-[740px] rounded-[52px] bg-zinc-950 p-[12px] shadow-2xl ring-[14px] ring-zinc-800 border-4 border-zinc-900 transition-all duration-300">
        
        {/* Phone Speaker & Camera Bar (Dynamic Island style) */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-zinc-800 rounded-full border border-zinc-900 absolute left-4"></div>
          <div className="w-12 h-1 bg-zinc-900 rounded-full absolute right-6"></div>
        </div>

        {/* Home Indicator bar at the bottom */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-gray-400 dark:bg-zinc-600 rounded-full z-30"></div>

        {/* Screen Area Content */}
        <div className={`w-full h-full rounded-[42px] overflow-hidden flex flex-col relative transition-colors duration-300 ${darkTheme ? "bg-zinc-900 text-gray-100" : "bg-white text-gray-900"}`}>
          
          {/* High-fidelity Android Status Bar */}
          <div className={`px-6 pt-9 pb-2 flex justify-between items-center text-xs font-medium z-20 ${darkTheme ? "bg-zinc-900 text-gray-200" : "bg-gray-50 text-gray-600"}`}>
            <span>{currentTimeString}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* APPLICATION MAIN SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-4 pb-12 flex flex-col pt-2">
            
            {/* ==================== SCREEN 1: HOME ==================== */}
            {screen === "home" && (
              <div id="sim-screen-home" className="flex flex-col flex-1 animate-fade-in">
                {/* Title and Theme Material Switch */}
                <div className="flex justify-between items-start mt-4 mb-2">
                  <div>
                    <h1 id="lbl-title" className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                      Quiz Lập Trình Kotlin
                    </h1>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Android Studio Assignment 1
                    </p>
                  </div>
                  <button 
                    id="btn-toggle-theme"
                    onClick={handleToggleTheme}
                    className="p-1 px-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 transition"
                  >
                    {darkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4 leading-relaxed bg-gray-50 dark:bg-zinc-800/50 p-2.5 rounded-lg">
                  Làm quen với các thành phần cơ bản của Android (Activity, RecyclerView, Adapter, SharedPreferences). Đồ án mẫu cho dự án <strong className="text-indigo-500">AcademyTrack</strong>.
                </div>

                {/* SharedPreferences Score Summary Card */}
                <div id="card-high-score" className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 p-3 rounded-2xl mb-5">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs mb-2">
                    <Trophy className="w-4 h-4" />
                    <span>🏆 Xem điểm cao nhất (SharedPreferences)</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between font-mono">
                      <span>Cơ bản:</span>
                      <span className="font-semibold">{highScores["kotlin-basics"]}/10 ({highScores["kotlin-basics"] * 10}%)</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Giao diện UI:</span>
                      <span className="font-semibold">{highScores["android-ui"]}/10 ({highScores["android-ui"] * 10}%)</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Kiến trúc MVVM:</span>
                      <span className="font-semibold">{highScores["kotlin-mvvm"]}/10 ({highScores["kotlin-mvvm"] * 10}%)</span>
                    </div>
                  </div>
                </div>

                {/* Topic Selector List */}
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Chọn chủ đề Quiz
                </h2>

                <div className="space-y-2.5 flex-1 select-none">
                  {QUIZ_TOPICS.map((topic) => {
                    const isSelected = selectedTopic.id === topic.id;
                    return (
                      <div
                        key={topic.id}
                        id={`card-topic-${topic.id}`}
                        onClick={() => {
                          setSelectedTopic(topic);
                          playSfx("click");
                          onSelectTopicCode(topic.id); // Sync right panel view
                        }}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected 
                            ? "border-indigo-600 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md" 
                            : "border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-100 dark:bg-indigo-950" : "bg-gray-100 dark:bg-zinc-700"}`}>
                            {getTopicIcon(topic.id)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {topic.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action button */}
                <button
                  id="btn-start"
                  onClick={handleStartQuiz}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition mt-6 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 dark:shadow-none"
                >
                  <Play className="w-4 h-4 fill-white" />
                  BẮT ĐẦU TRẢI NGHIỆM
                </button>
              </div>
            )}

            {/* ==================== SCREEN 2: ACTIVE QUIZ PLAY ==================== */}
            {screen === "quiz" && currentQuestion && (
              <div id="sim-screen-quiz" className="flex flex-col flex-1 animate-fade-in">
                
                {/* Back button and Topic label */}
                <div className="flex items-center justify-between mt-3 mb-4">
                  <button 
                    onClick={handleGoHome}
                    className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-0.5"
                  >
                    ← Thoát
                  </button>
                  <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedTopic.id === "kotlin-basics" ? "Basics" : selectedTopic.id === "android-ui" ? "UI & Components" : "MVVM Core"}
                  </span>
                </div>

                {/* Tracker and Linear ProgressBar */}
                <div className="mb-4">
                  <div className="flex justify-between items-baseline text-xs font-bold mb-1.5">
                    <span>Câu hỏi {currentQuestionIndex + 1}/{selectedTopic.questions.length}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                      Tính điểm: {score}/{selectedTopic.questions.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / selectedTopic.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Circular Timer CountDown Display */}
                <div className="flex justify-center my-3 relative">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* SVG Radial Progress Background */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-gray-100 dark:stroke-zinc-800"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className={`transition-all duration-1000 ${
                          timeLeft <= 10 ? "stroke-red-500" : "stroke-indigo-600 dark:stroke-indigo-400"
                        }`}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - timeLeft / 30)}
                      />
                    </svg>
                    <span className={`text-base font-extrabold font-mono ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-indigo-600 dark:text-indigo-400"}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Prompt Question Content */}
                <div className="bg-gray-50 dark:bg-zinc-800/80 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 mb-4 shadow-sm min-h-[92px] flex items-center">
                  <p id="lbl-question-text" className="text-xs font-semibold leading-relaxed text-gray-800 dark:text-gray-100">
                    {currentQuestion.text}
                  </p>
                </div>

                {/* Choice List Container */}
                <div id="layout-options" className="space-y-2 flex-1">
                  {currentQuestion.options.map((option, idx) => {
                    const isAnySelected = selectedOptionIndex !== null;
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    
                    let buttonClass = "bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700/80 border-gray-100 dark:border-zinc-800/60 text-gray-700 dark:text-gray-200";
                    
                    if (isAnySelected) {
                      if (isCorrect) {
                        buttonClass = "bg-emerald-500 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/10";
                      } else if (isSelected) {
                        buttonClass = "bg-red-500 border-red-500 text-white font-bold shadow-md shadow-red-500/10";
                      } else {
                        buttonClass = "bg-gray-100 dark:bg-zinc-800/40 border-gray-200/50 dark:border-zinc-800/40 text-gray-400 dark:text-gray-500 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`btn-option-${idx + 1}`}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnySelected}
                        className={`w-full text-left p-3.5 rounded-xl border text-[11px] leading-snug transition-all duration-200 flex items-center gap-2.5 ${buttonClass}`}
                      >
                        <span className={`w-5 h-5 min-w-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                          isAnySelected
                            ? isCorrect
                              ? "bg-white text-emerald-600 border-white"
                              : isSelected
                                ? "bg-white text-red-600 border-white"
                                : "bg-transparent text-gray-300 dark:text-zinc-700 border-gray-300 dark:border-zinc-700"
                            : "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 border-gray-200 dark:border-zinc-600"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Overlay */}
                {selectedOptionIndex !== null && (
                  <div id="layout-feedback" className="mt-4 p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800/60 animate-bounce-short">
                    <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                      {selectedOptionIndex === currentQuestion.correctIndex ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500">✓ ĐÚNG RỒI!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-red-500">✗ CHƯA CHÍNH XÁC!</span>
                        </>
                      )}
                    </div>
                    <p id="lbl-feedback-explanation" className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal italic">
                      Giải thích: {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Control Action Button */}
                <div className="mt-5 h-12 flex justify-end">
                  {selectedOptionIndex !== null && (
                    <button
                      id="btn-next"
                      onClick={handleNext}
                      className="p-3 px-5 bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-indigo-700 transition"
                    >
                      <span>Kế Tiếp</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ==================== SCREEN 3: RESULT AND REVIEW RECYCLERVIEW ==================== */}
            {screen === "result" && (
              <div id="sim-screen-result" className="flex flex-col flex-1 animate-fade-in">
                
                {/* Headline Banner */}
                <div className="text-center my-4">
                  <h1 className="text-lg font-black text-gray-800 dark:text-gray-100 uppercase tracking-wide">
                    Kết quả bài làm
                  </h1>
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold">
                    {selectedTopic.name}
                  </span>
                </div>

                {/* Radial Score Indicator */}
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    {score}/10
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                    Tỷ lệ chính xác: {score * 10}%
                  </span>
                  
                  {isNewRecord && (
                    <div id="lbl-new-record" className="mt-2.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg flex items-center gap-1 animate-pulse border border-amber-300/30">
                      <Trophy className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>🎉 KỶ LỤC ĐIỂM SỐ MỚI!</span>
                    </div>
                  )}
                </div>

                {/* RV Title Label */}
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-5 mb-2">
                  Xem lại chi tiết bằng RecyclerView
                </h3>

                {/* RecyclerView Simulation Container */}
                <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-3 mb-4 select-text">
                  {selectedTopic.questions.map((question, index) => {
                    const userChoice = userChoices[index];
                    const isCorrect = userChoice === question.correctIndex;
                    
                    return (
                      <div 
                        key={question.id}
                        className={`p-3 rounded-xl border text-[11px] flex flex-col gap-1.5 transition-colors ${
                          isCorrect 
                            ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/20" 
                            : "bg-red-50/50 dark:bg-red-950/10 border-red-200/50 dark:border-red-900/20"
                        }`}
                      >
                        {/* RV item status header */}
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                            Câu {index + 1}:
                          </span>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCorrect ? "text-emerald-500 bg-emerald-100/30" : "text-red-500 bg-red-100/30"
                          }`}>
                            {isCorrect ? "✓" : "✗"}
                          </span>
                        </div>

                        {/* RV item question body */}
                        <p className="font-bold text-gray-800 dark:text-gray-200 leading-snug">
                          {question.text}
                        </p>

                        {/* Choice visual list */}
                        <div className="space-y-1 font-mono text-[9px] text-gray-600 dark:text-gray-400 mt-1">
                          {question.options.map((option, optIdx) => {
                            const isChose = userChoice === optIdx;
                            const isCorrectAns = question.correctIndex === optIdx;
                            let style = "";
                            if (isChose) {
                              style = isCorrect ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-red-500 dark:text-red-400 font-bold line-through";
                            }
                            if (isCorrectAns) {
                              style = "text-emerald-600 dark:text-emerald-400 font-bold";
                            }

                            return (
                              <div key={optIdx} className={`flex items-start gap-1 ${style}`}>
                                <span className="uppercase">{String.fromCharCode(97 + optIdx)}. </span>
                                <span>
                                  {option}
                                  {isChose && !isCorrect && " (Bạn chọn)"}
                                  {isCorrectAns && isChose && " (Chính xác)"}
                                  {isCorrectAns && !isChose && " (Đáp án đúng)"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* RV item explanation footer */}
                        <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-1.5 mt-1">
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 italic leading-snug">
                            Giải thích: {question.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Control Options Buttons */}
                <div className="flex gap-2.5 mt-auto">
                  <button
                    id="btn-retry"
                    onClick={handleRetry}
                    className="flex-1 h-11 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    LÀM LẠI
                  </button>
                  <button
                    id="btn-home"
                    onClick={handleGoHome}
                    className="flex-1 h-11 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-700 transition"
                  >
                    <Home className="w-3.5 h-3.5" />
                    TRANG CHỦ
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Android Navigation bar simulated keys */}
          <div className={`px-12 py-3 flex justify-between items-center text-xs text-gray-400 dark:text-zinc-600 font-bold z-20 select-none ${darkTheme ? "bg-zinc-900 border-t border-zinc-800/40" : "bg-gray-50 border-t border-gray-100"}`}>
            <span onClick={handleGoHome} className="cursor-pointer hover:text-indigo-500 transition">◁</span>
            <span onClick={handleGoHome} className="cursor-pointer hover:text-indigo-500 transition text-[10px]">◯</span>
            <span onClick={handleGoHome} className="cursor-pointer hover:text-indigo-500 transition text-xs">▢</span>
          </div>

        </div>
      </div>
    </div>
  );
}
