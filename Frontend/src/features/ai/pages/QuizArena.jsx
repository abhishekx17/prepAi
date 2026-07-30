import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuiz, submitQuiz } from '../services/quiz.api';
import LoadingScreen from '../components/LoadingScreen';
import { 
  ArrowLeft, 
  HelpCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  CheckSquare, 
  Timer,
  BookOpen
} from 'lucide-react';

const QuizArena = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Navigation & Answers
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Load quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getQuiz(id);
        
        if (data?.status === 'completed') {
          navigate(`/quiz/${id}/result`);
          return;
        }

        setQuizInfo(data);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id]);

  // Timer interval
  useEffect(() => {
    if (loading || submitting || !quizInfo) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, submitting, quizInfo]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = optionIndex;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < quizInfo.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = selectedAnswers.filter(ans => ans === -1).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit the quiz?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitQuiz(id, selectedAnswers);
      navigate(`/quiz/${id}/result`);
    } catch {
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (loading) {
    return <LoadingScreen message="Entering quiz arena" />;
  }

  if (error && !quizInfo) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
        <HelpCircle className="w-12 h-12 text-zinc-550 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">Quiz Load Error</h2>
        <p className="text-xs text-zinc-500 max-w-md mb-6">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 hover:bg-zinc-850 hover:text-zinc-50 transition-colors cursor-pointer text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>
      </div>
    );
  }

  const { questions, topic, difficulty } = quizInfo;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentSelection = selectedAnswers[currentIndex];

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Status Header */}
      <header className="px-6 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-850/60 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel the quiz? Your score will not be saved.')) {
                navigate('/dashboard');
              }
            }}
            className="text-zinc-550 hover:text-zinc-350 transition-colors cursor-pointer"
            title="Exit Quiz"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="border-l border-zinc-800 h-5"></div>
          <div>
            <h2 className="text-xs font-bold text-zinc-200 leading-none">{topic}</h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wide">
              QUIZ ARENA | {difficulty} DIFFICULTY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono font-bold bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md">
            <Timer className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md">
            Q {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </header>

      {/* Linear progress bar */}
      <div className="w-full h-0.5 bg-zinc-900 relative shrink-0">
        <div 
          className="absolute h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Test Body Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 lg:p-12 flex flex-col justify-center gap-6">
        
        {/* Question Text Card */}
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl relative select-text">
          {/* macOS controls */}
          <div className="flex items-center justify-between bg-zinc-950/60 border-b border-zinc-850/60 px-5 py-3 select-none">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-[10px] font-mono text-zinc-550 font-bold uppercase tracking-wider ml-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-zinc-400" />
                question_spec.md
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest font-bold">
                ACTIVE
              </span>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <h2 className="text-sm sm:text-base font-semibold text-zinc-150 leading-relaxed font-sans">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Options Selection grid */}
        <div className="space-y-2.5 select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2.5"
            >
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = currentSelection === optIdx;
                const label = optionLabels[optIdx];

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full flex items-center gap-4 p-4.5 rounded-xl border text-left transition-all cursor-pointer group select-none ${
                      isSelected 
                        ? 'border-sky-500/50 bg-sky-950/15 text-sky-200 font-semibold shadow-lg shadow-sky-500/5 hover:border-sky-400' 
                        : 'border-zinc-855 bg-zinc-900/10 hover:border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-900/20 hover:scale-[1.005]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all shrink-0 ${
                      isSelected 
                        ? 'bg-sky-500 text-white border border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                        : 'bg-zinc-950 group-hover:bg-zinc-900 text-zinc-500 group-hover:text-zinc-300 border border-zinc-850'
                    }`}>
                      {label}
                    </div>
                    <span className="text-xs sm:text-sm leading-snug">{opt}</span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error messaging block */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-red-950/10 border border-red-900/20 rounded-xl text-xs text-red-400 font-medium flex items-center gap-2 select-none"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between border-t border-zinc-850 pt-6 select-none">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-50 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Back</span>
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 py-2 px-5 rounded-lg text-xs font-bold bg-zinc-50 text-zinc-950 hover:bg-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" strokeWidth={1.5} />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-50 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

      </div>
    </main>
  );
};

export default QuizArena;
