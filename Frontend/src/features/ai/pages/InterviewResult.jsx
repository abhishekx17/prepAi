import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterview } from '../services/interview.api';
import LoadingScreen from '../components/LoadingScreen';
import { 
  ArrowLeft, 
  Terminal, 
  Award, 
  BookOpen, 
  Calendar, 
  Code2, 
  FileText, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle
} from 'lucide-react';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'questions', 'roadmap'
  const [expandedAnswers, setExpandedAnswers] = useState({});

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getInterview(id);
        
        if (data?.status === 'active') {
          navigate(`/interview/${id}`);
          return;
        }

        setSession(data.session);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load interview feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const toggleAnswer = (index) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getScoreTheme = (score) => {
    return {
      text: 'text-zinc-50',
      bg: 'bg-zinc-900 border-zinc-800',
      circle: '#fafafa'
    };
  };

  const getRecBadge = (rec) => {
    switch (rec) {
      case 'Strong Hire':
      case 'Hire':
        return 'text-zinc-100 bg-zinc-900 border-zinc-700';
      default:
        return 'text-zinc-400 bg-zinc-900 border-zinc-800';
    }
  };

  if (loading) {
    return <LoadingScreen message="Computing feedback" />;
  }

  if (error || !session) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-zinc-500 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">Error Loading Feedback</h2>
        <p className="text-xs text-zinc-500 max-w-md mb-6">{error || 'Could not find mock interview evaluation details.'}</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-zinc-50 text-zinc-950 font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  const { evaluation, questions, jobTitle, difficulty, focusArea, createdAt } = session;
  const scoreTheme = getScoreTheme(evaluation.score);

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8 select-none">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <span className="text-[10px] text-zinc-500 font-mono font-medium">
            COMPLETED: {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Scorecard Hero Banner */}
        <section className="grid grid-cols-1 md:grid-cols-12 bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 sm:p-8 gap-8 items-center relative overflow-hidden">
          {/* Identity details */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-950 border border-zinc-850 text-zinc-500">
                OFFICIAL_EVALUATION
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getRecBadge(evaluation.recommendation)}`}>
                {evaluation.recommendation}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-50 tracking-tight leading-snug">
              {jobTitle}
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">
              {focusArea} | {difficulty} Difficulty
            </p>
          </div>

          {/* Performance Circle */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="stroke-zinc-850"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke={scoreTheme.circle}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - evaluation.score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold tracking-tight text-zinc-50">{evaluation.score}</span>
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Selector */}
        <nav className="flex border-b border-zinc-800 gap-1 pb-px scrollbar-none overflow-x-auto select-none">
          {[
            { id: 'summary', label: 'Core Feedback', icon: Award },
            { id: 'questions', label: 'Critique log', icon: FileText },
            { id: 'roadmap', label: 'Improvement plan', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-3 px-4 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{tab.label}</span>
                {active && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Main Tab Details Wrapper */}
        <section className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: Summary core feedback */}
            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 select-none">
                  <Award className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  Executive Summary
                </h3>
                <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 shadow-inner">
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {evaluation.feedbackSummary}
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Question critique details */}
            {activeTab === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 mb-4 select-none">
                  <UserCheck className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  Individual critique
                </h3>

                {questions.map((q, idx) => {
                  const isOpen = expandedAnswers[idx];
                  const qScoreTheme = getScoreTheme(q.score);

                  return (
                    <div key={idx} className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                      <button
                        onClick={() => toggleAnswer(idx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-zinc-200 hover:text-zinc-50 cursor-pointer select-none"
                      >
                        <span className="pr-4 flex items-start gap-2.5">
                          <span className="text-zinc-650 font-mono">Q{idx + 1}.</span>
                          <span>{q.question}</span>
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-bold bg-zinc-900 border-zinc-800 text-zinc-350`}>
                            {q.score} / 100
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-555" /> : <ChevronDown className="w-4 h-4 text-zinc-555" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 border-t border-zinc-850 pt-4 bg-zinc-900/10 space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-400">
                              {q.type === 'coding' && (
                                <div className="space-y-2 select-text">
                                  <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                    <Code2 className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                                    Submitted Code
                                  </h4>
                                  <pre className="bg-zinc-950 border border-zinc-850 rounded-lg p-4 overflow-x-auto text-zinc-200 font-mono text-[11px] whitespace-pre">
                                    <code>{q.userCode || '// No code submitted'}</code>
                                  </pre>
                                </div>
                              )}

                              <div className="space-y-1.5 select-text">
                                <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                                  Submitted response
                                </h4>
                                <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-4 whitespace-pre-wrap text-zinc-300">
                                  {q.userAnswer || 'No response submitted.'}
                                </div>
                              </div>

                              {q.hintsUsed && q.hintsUsed.length > 0 && (
                                <div className="space-y-1.5 bg-zinc-950/60 border border-zinc-850 p-4 rounded-lg text-zinc-400 text-xs">
                                  <h5 className="font-bold uppercase font-mono tracking-wider text-[9px] text-zinc-450">Hints Requested</h5>
                                  <ul className="list-disc pl-4 space-y-1">
                                    {q.hintsUsed.map((h, hIdx) => (
                                      <li key={hIdx}>{h}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="space-y-1.5 select-text">
                                <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                                  AI Feedback Critique
                                </h4>
                                <p className="whitespace-pre-wrap text-zinc-300">{q.feedback}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* TAB 3: Roadmap */}
            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 select-none">
                  <BookOpen className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                  Action roadmap
                </h3>

                {evaluation.roadmap.length === 0 ? (
                  <p className="text-zinc-500 text-xs italic">No specific roadmap items generated.</p>
                ) : (
                  <div className="relative border-l border-zinc-800 ml-3 pl-6 space-y-6 select-text">
                    {evaluation.roadmap.map((item, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[35px] top-1 w-5.5 h-5.5 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-200 font-mono shadow-sm select-none">
                          {idx + 1}
                        </span>
                        
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4.5 space-y-2 hover:border-zinc-700 transition-colors">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500">Focus Area</span>
                          <h4 className="text-sm font-bold text-zinc-100 mt-0.5">{item.topic}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                            {item.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Next step panels */}
        <section className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/10 border border-zinc-800 p-5 rounded-xl select-none">
          <Calendar className="w-8 h-8 text-zinc-500 shrink-0" strokeWidth={1.5} />
          <div className="text-center sm:text-left flex-1">
            <h4 className="text-xs font-bold text-zinc-200">Prepare for another session?</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">Generate another mock session with custom configurations, or evaluate your resume alignment again.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-zinc-50 hover:bg-white text-zinc-950 font-bold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Start new simulator
          </button>
        </section>

      </div>
    </main>
  );
};

export default InterviewResult;
