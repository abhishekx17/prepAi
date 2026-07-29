import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { getInterview, submitAnswer, requestHint } from '../services/interview.api';
import LoadingScreen from '../components/LoadingScreen';
import { 
  Bot, 
  Terminal, 
  FileCode, 
  ChevronRight, 
  Info,
  Loader2,
  RefreshCw,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';

const InterviewArena = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Active Question inputs
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const [requestingHint, setRequestingHint] = useState(false);

  // References for editor line numbers
  const codeTextareaRef = useRef(null);

  // Load question
  useEffect(() => {
    loadActiveQuestion();
  }, [id]);

  const loadActiveQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      setHint('');
      const data = await getInterview(id);
      
      if (data?.status === 'completed') {
        navigate(`/interview/${id}/result`);
        return;
      }

      setSessionInfo(data);
      setAnswer('');
      
      if (data?.question?.type === 'coding') {
        setCode(data.question.codeTemplate || 'function solve() {\n  // Write code here\n}');
      } else {
        setCode('');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load interview question.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Tab interception in Code Editor
  const handleCodeKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;

      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      setCode(newVal);

      setTimeout(() => {
        if (codeTextareaRef.current) {
          codeTextareaRef.current.selectionStart = codeTextareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Reset editor template
  const handleResetCode = () => {
    if (window.confirm('Are you sure you want to reset the editor to the starter template?')) {
      setCode(sessionInfo?.question?.codeTemplate || '');
    }
  };

  // Get hints
  const handleRequestHint = async () => {
    if (requestingHint) return;
    setRequestingHint(true);
    setError('');
    try {
      const data = await requestHint(id, { userAnswerSoFar: answer, userCodeSoFar: code });
      setHint(data.hint || 'No hint returned.');
    } catch {
      setError('Failed to load hint. Try again.');
    } finally {
      setRequestingHint(false);
    }
  };

  // Submit Answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sessionInfo?.question?.type === 'coding' && !code.trim()) {
      setError('Please provide a code solution before submitting.');
      return;
    }
    if (sessionInfo?.question?.type !== 'coding' && !answer.trim()) {
      setError('Please write an answer before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await submitAnswer(id, { answer, code });
      if (res.status === 'completed') {
        navigate(`/interview/${id}/result`);
      } else {
        loadActiveQuestion();
      }
    } catch {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getLineNumbers = () => {
    const linesCount = code.split('\n').length || 1;
    return Array.from({ length: Math.max(linesCount, 1) }, (_, i) => i + 1);
  };

  if (loading) {
    return <LoadingScreen message="Entering arena" />;
  }

  if (error && !sessionInfo) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <Bot className="w-12 h-12 text-zinc-600 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">Failed to Enter Arena</h2>
        <p className="text-sm text-zinc-500 max-w-md mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 hover:bg-zinc-850 hover:text-zinc-50 transition-colors cursor-pointer text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>
      </div>
    );
  }

  const { question, currentQuestionIndex, totalQuestions } = sessionInfo;

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Header Status Bar */}
      <header className="px-6 py-3 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the interview session? Your progress will be saved.')) {
                navigate('/');
              }
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            title="Exit Session"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="border-l border-zinc-800 h-5"></div>
          <div>
            <h2 className="text-xs font-bold text-zinc-200 leading-none">{sessionInfo.jobTitle}</h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wide">
              {sessionInfo.focusArea} | {sessionInfo.difficulty} Level
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono font-bold px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="w-20 bg-zinc-900 h-1 rounded-full hidden sm:block overflow-hidden border border-zinc-850">
            <div 
              className="bg-zinc-200 h-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Split Grid Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-53px)]">
        
        {/* Left Side: Interviewer / Question Box */}
        <section className="lg:col-span-5 border-r border-zinc-850 bg-zinc-950 flex flex-col p-6 sm:p-8 overflow-y-auto justify-between gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 flex items-center justify-center relative select-none">
                <Bot className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-zinc-400 rounded-full border border-zinc-950"></span>
              </div>
              <div className="select-none">
                <h4 className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wider">AI Interviewer</h4>
                <div className="flex items-center gap-1 h-3 mt-0.5">
                  <span className="w-0.5 bg-zinc-600 rounded-full h-1.5 animate-[bounce_1s_infinite_100ms]"></span>
                  <span className="w-0.5 bg-zinc-550 rounded-full h-2.5 animate-[bounce_1s_infinite_300ms]"></span>
                  <span className="w-0.5 bg-zinc-500 rounded-full h-2 animate-[bounce_1s_infinite_200ms]"></span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/10 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 select-none">
                <Info className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 tracking-wider">Question Prompt</span>
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed font-medium">
                {question.question}
              </p>
            </div>

            {/* Hint Box panel */}
            <AnimatePresence mode="wait">
              {hint ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-xl flex gap-3 text-zinc-300"
                >
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-zinc-450 animate-pulse" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-[9px] font-bold font-mono uppercase tracking-wider mb-1 text-zinc-400">Interviewer Suggestion</h5>
                    <p className="text-xs leading-relaxed">{hint}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRequestHint}
                    disabled={requestingHint}
                    className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    {requestingHint ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Lightbulb className="w-3 h-3" />
                    )}
                    <span>Request Hint</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[10px] text-zinc-650 font-mono flex items-center gap-2 border-t border-zinc-900 pt-4 select-none">
            <Terminal className="w-3.5 h-3.5" />
            <span>SESSION_SECURED_ACTIVE</span>
          </div>
        </section>

        {/* Right Side: Answer Input Box */}
        <section className="lg:col-span-7 flex flex-col overflow-hidden h-full bg-zinc-950">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
            {question.type === 'coding' ? (
              /* Coding Split Screen */
              <div className="flex-1 flex flex-col overflow-hidden p-6 gap-5">
                
                {/* Code Editor Panel */}
                <div className="flex-1 flex flex-col overflow-hidden border border-zinc-800 rounded-xl bg-zinc-950 relative focus-within:border-zinc-700">
                  {/* Editor Header */}
                  <div className="px-4 py-2 border-b border-zinc-850 bg-zinc-900/20 flex items-center justify-between text-[11px] shrink-0 select-none">
                    <div className="flex items-center gap-2 text-zinc-400 font-mono">
                      <FileCode className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>solution.js</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetCode}
                      className="flex items-center gap-1.5 text-zinc-550 hover:text-zinc-300 transition-colors cursor-pointer font-mono"
                      title="Reset Template"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Editor Content Area */}
                  <div className="flex-1 flex overflow-y-auto font-mono text-xs leading-relaxed bg-zinc-900/10">
                    <div className="w-10 select-none border-r border-zinc-850/60 bg-zinc-950 text-zinc-600 flex flex-col items-center py-4 font-mono pr-2 text-right">
                      {getLineNumbers().map((num) => (
                        <div key={num} className="h-[21px]">{num}</div>
                      ))}
                    </div>

                    <textarea
                      ref={codeTextareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleCodeKeyDown}
                      className="flex-1 bg-transparent text-zinc-100 py-4 px-3 outline-none resize-none font-mono min-h-full whitespace-pre overflow-x-auto tab-size-2 focus:ring-0 border-0"
                      placeholder="// Write your solution function here..."
                      spellCheck="false"
                      style={{
                        lineHeight: '21px',
                        fontFamily: "monospace"
                      }}
                    />
                  </div>
                </div>

                {/* Explanation text box */}
                <div className="shrink-0 h-32 flex flex-col bg-zinc-900/10 border border-zinc-850 rounded-xl p-4 focus-within:border-zinc-700">
                  <label htmlFor="codeExplanation" className="block text-[9px] font-bold text-zinc-500 mb-1.5 font-mono uppercase tracking-wider select-none">
                    Complexity & Strategy Notes
                  </label>
                  <textarea
                    id="codeExplanation"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-1 bg-transparent text-zinc-200 outline-none resize-none text-xs placeholder:text-zinc-600 border-0 p-0 focus:ring-0 focus:outline-none"
                    placeholder="Describe your algorithm's core strategy and state the Big-O time/space complexity..."
                  />
                </div>
              </div>
            ) : (
              /* Conceptual / Behavioral Large Text Area */
              <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                <div className="flex-1 flex flex-col bg-zinc-900/10 border border-zinc-800 rounded-xl p-5 focus-within:border-zinc-700">
                  <label htmlFor="textAnswer" className="block text-[9px] font-bold text-zinc-500 mb-2.5 font-mono uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Terminal className="w-3.5 h-3.5" />
                    Your Response
                  </label>
                  <textarea
                    id="textAnswer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-1 bg-transparent text-zinc-150 outline-none resize-none text-sm leading-relaxed placeholder:text-zinc-600 min-h-[300px] border-0 p-0 focus:ring-0 focus:outline-none"
                    placeholder="Structure your response clearly. For behavioral questions, we recommend using the STAR framework (Situation, Task, Action, Result)..."
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-6 mb-4 p-3 bg-red-950/10 border border-red-950/30 rounded-lg text-xs text-red-400 font-medium flex items-center gap-2"
                >
                  <Info className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Footer Action Panel */}
            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between shrink-0 select-none">
              <span className="text-[10px] font-medium text-zinc-500 hidden sm:block">Answers are saved temporarily to your session log.</span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto ml-auto bg-zinc-50 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-semibold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating response...</span>
                  </>
                ) : (
                  <>
                    <span>Submit response</span>
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
};

export default InterviewArena;
