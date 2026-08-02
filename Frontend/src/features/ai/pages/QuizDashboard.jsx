import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { startQuiz, getQuizHistory } from '../services/quiz.api';
import Logo from '../../../components/ui/Logo';
import { 
  Bot, 
  Plus, 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  Award,
  Play,
  Layers,
  History,
  CheckSquare,
  Sun,
  ClipboardList,
  Crosshair,
  FileText
} from 'lucide-react';

const QuizDashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  // State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Form State
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Mid');
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState('');

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getQuizHistory();
      setHistory(data.history || []);
    } catch {
      setError('Failed to load quiz history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  // Generation steps animation simulation
  useEffect(() => {
    let interval;
    if (generating) {
      setGenerationStep(1);
      interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 2500);
    } else {
      setGenerationStep(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic for the quiz.');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      const data = await startQuiz({
        topic,
        difficulty,
        numQuestions
      });

      if (data?.sessionId) {
        navigate(`/quiz/${data.sessionId}`);
      } else {
        setError('Failed to start quiz session.');
        setGenerating(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate quiz. Please check API key quota.');
      setGenerating(false);
    }
  };

  // Stats calculation
  const getAverageScore = () => {
    if (history.length === 0) return 0;
    const totalPercentage = history.reduce((sum, item) => {
      const percentage = (item.score / item.numQuestions) * 100;
      return sum + percentage;
    }, 0);
    return Math.round(totalPercentage / history.length);
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
    if (percentage >= 50) return 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    return 'text-rose-400 bg-rose-950/20 border-rose-900/30';
  };

  const getAverageScoreTheme = () => {
    const avg = getAverageScore();
    if (avg >= 80) return { text: 'text-emerald-400', circle: '#34d399' };
    if (avg >= 50) return { text: 'text-amber-400', circle: '#fbbf24' };
    return { text: 'text-rose-400', circle: '#fb7185' };
  };

  const steps = [
    'Synthesizing quiz parameters and difficulty context...',
    'Generating conceptual multiple-choice items...',
    'Formulating option distractors and correct keys...',
    'Writing detailed educational explanations for answers...'
  ];

  return (
    <main className="min-h-screen w-full bg-[#0A0C10] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex page-transition">
      {/* Sidebar - Matches Login Page and Dashboard theme */}
      <aside className="w-80 hidden md:flex flex-col bg-[#0E1017] border-r border-[#161926] justify-between h-screen sticky top-0 select-none shrink-0 z-20">
        <div className="flex flex-col overflow-y-auto flex-1">
          {/* Logo Section */}
          <div className="p-6 border-b border-[#161926] flex items-center justify-between">
            <Logo size="md" variant="blue" showText={true} textClassName="text-lg font-bold tracking-tight text-zinc-50" />
          </div>

          {/* New Practice Quiz button */}
          <div className="p-4">
            <button
              onClick={() => {
                setGenerating(false);
                setTopic('');
                setError('');
              }}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-black font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-sm border border-slate-250"
            >
              <Plus className="w-4 h-4" />
              <span>New Practice Quiz</span>
            </button>
          </div>

          {/* Sidebar link list */}
          <div className="px-3 py-2 space-y-1">
            <button
              onClick={() => navigate('/?tab=report')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#161926]/40 text-sm font-medium transition-colors cursor-pointer text-left"
            >
              <Bot className="w-4 h-4" />
              <span>Interview Hub</span>
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#161926] text-white text-sm font-semibold transition-colors cursor-pointer text-left"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Practice Quiz</span>
            </button>
            <button
              onClick={() => navigate('/?tab=interview')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#161926]/40 text-sm font-medium transition-colors cursor-pointer text-left"
            >
              <Crosshair className="w-4 h-4" />
              <span>Mock Arena</span>
            </button>
            <button
              onClick={() => navigate('/?tab=report')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#161926]/40 text-sm font-medium transition-colors cursor-pointer text-left"
            >
              <FileText className="w-4 h-4" />
              <span>Prep Reports</span>
            </button>
          </div>

          {/* Quiz History List */}
          <div className="flex-1 px-3 py-6 flex flex-col border-t border-[#161926] mt-4">
            <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Quiz History</span>
            </h3>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-slate-550 animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-550 italic">No quizzes taken yet.</div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-360px)]">
                {history.map((quiz) => (
                  <button
                    key={quiz._id}
                    onClick={() => navigate(`/quiz/${quiz._id}/result`)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#161926] text-left transition-colors group cursor-pointer border border-transparent hover:border-[#161926]"
                  >
                    <div className="truncate mr-3">
                      <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                        {quiz.topic}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <span>{quiz.difficulty}</span>
                        <span>•</span>
                        <span>{quiz.numQuestions} Qs</span>
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold shrink-0 ${getScoreColor(quiz.score, quiz.numQuestions)}`}>
                      {quiz.score}/{quiz.numQuestions}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-[#161926] bg-[#0A0C10]/40 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate mr-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-350 shrink-0 shadow-inner">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <p className="text-xs text-slate-550 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-[#161926] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors border border-[#161926] hover:border-rose-500/20 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Navigation Header Tabs */}
        <header className="px-6 py-4 bg-[#0E1017] border-b border-[#161926] flex items-center justify-between sticky top-0 z-15 shrink-0">
          <div className="flex items-center bg-[#12151E] border border-slate-850 p-1 rounded-xl text-xs font-semibold select-none">
            <button
              onClick={() => navigate('/dashboard')}
              className="py-2 px-5 text-center rounded-lg transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Interview Hub
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="py-2 px-5 text-center rounded-lg transition-colors bg-[#1D202F] text-white cursor-pointer"
            >
              Practice Quiz
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-xl bg-[#161926] border border-[#161926] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </header>

        {generating ? (
          /* Interactive Loader */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-2xl mx-auto w-full">
            <div className="relative w-40 h-40 flex items-center justify-center mb-10">
              <div className="absolute inset-0 rounded-full border border-dashed border-slate-800 animate-[spin_12s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-slate-700/50 animate-[spin_6s_linear_infinite_reverse]"></div>
              <div className="w-16 h-16 rounded-full bg-[#0E1017] border border-slate-850 flex items-center justify-center shadow-2xl relative">
                <Loader2 className="w-6 h-6 text-white animate-spin stroke-[2.5]" />
              </div>
            </div>

            <div className="text-center w-full mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                Assembling Quiz
              </h2>
              <p className="text-sm text-slate-450">
                Gemini is preparing multiple-choice questions for: <strong className="text-white">"{topic}"</strong>.
              </p>
            </div>

            <div className="w-full bg-[#0E1017] border border-[#161926] rounded-2xl p-6 space-y-4 shadow-lg">
              {steps.map((text, idx) => {
                const stepNum = idx + 1;
                const isCompleted = generationStep > stepNum;
                const isActive = generationStep === stepNum;
                
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 transition-all duration-300 ${
                      isCompleted ? 'text-slate-350' : isActive ? 'text-white font-semibold' : 'text-slate-600'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold">
                          {stepNum}
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Form Entry Screen */
          <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 lg:p-12 flex flex-col justify-center gap-8">
            <div className="flex flex-col sm:flex-row gap-6 items-stretch">
              
              {/* Left Config Card */}
              <div className="flex-1 bg-[#0E1017] border border-[#161926] p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="space-y-6">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#161926] border border-[#161926] text-slate-300 flex items-center gap-1.5 w-fit mb-3">
                      <CheckSquare className="w-3.5 h-3.5 text-slate-300" />
                      QUIZ_ARENA_SETUP
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      MCQ Objective Quizzes
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      Assess your technical comprehension in seconds. Input a topic, choose difficulty and test size to launch.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs sm:text-sm text-rose-400 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="topic" className="block text-xs font-semibold text-slate-350 mb-2">
                        Technical Topic *
                      </label>
                      <input
                        type="text"
                        id="topic"
                        placeholder="e.g. React Hooks, Database Indexing, JavaScript Closures"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-[#161926] border border-slate-850 rounded-xl py-2.5 px-4 text-white text-sm placeholder:text-slate-650 focus:outline-none focus:border-slate-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="difficulty" className="block text-xs font-semibold text-slate-350 mb-2">
                          Difficulty *
                        </label>
                        <select
                          id="difficulty"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full bg-[#161926] border border-slate-850 text-white py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500 transition-colors cursor-pointer"
                        >
                          <option value="Low">Low (Beginner)</option>
                          <option value="Mid">Mid (Intermediate)</option>
                          <option value="High">High (Advanced)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="numQuestions" className="block text-xs font-semibold text-slate-350 mb-2">
                          Questions Size *
                        </label>
                        <select
                          id="numQuestions"
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                          className="w-full bg-[#161926] border border-slate-850 text-white py-2 px-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-500 transition-colors cursor-pointer"
                        >
                          <option value="5">5 Questions</option>
                          <option value="10">10 Questions</option>
                          <option value="15">15 Questions</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/15 active:scale-[0.99] border-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-white stroke-[3]" />
                        <span>Launch Quiz Arena</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Performance Stats Panel */}
              <div className="w-full sm:w-80 bg-[#0E1017] border border-[#161926] p-6 sm:p-8 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm">
                <div className="space-y-6 w-full">
                  <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                    Overall Metrics
                  </h3>

                  {history.length === 0 ? (
                    <div className="py-8 text-xs text-slate-550 italic">No score statistics compiled yet. Complete your first practice test.</div>
                  ) : (
                    <div className="space-y-6 w-full">
                      {/* Average score gauge */}
                      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                        {/* Radial Glow */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-md" />
                        
                        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            className="stroke-[#161926]"
                            strokeWidth="6"
                            fill="transparent"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke={getAverageScoreTheme().circle}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - getAverageScore() / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center z-10">
                          <span className={`text-2xl font-black ${getAverageScoreTheme().text}`}>{getAverageScore()}%</span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Average</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border-t border-[#161926] pt-4 gap-2 text-left">
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase">Tests Done</p>
                          <p className="text-lg font-bold text-white mt-0.5">{history.length}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase">Focus level</p>
                          <p className="text-xs font-semibold text-white mt-1 truncate">Objective MCQ</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-slate-650 font-mono text-[9px] uppercase tracking-wider flex items-center gap-2 border-t border-[#161926] w-full justify-center pt-4 mt-6">
                  <Award className="w-3.5 h-3.5" />
                  <span>Evaluation Engine Ready</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default QuizDashboard;
