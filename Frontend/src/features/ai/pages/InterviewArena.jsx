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

// A zero-dependency JavaScript syntax highlighter tokenizer
const highlightJS = (code) => {
  if (!code) return '';
  
  // Combine all token regexes into one big regex with capture groups
  const regex = new RegExp(
    '(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)' + // Group 1: Comments
    '|("(?:\\\\.|[^"\\\\])*"|\\\'(?:\\\\.|[^\\\'\\\\])*\\\'|`(?:\\\\.|[^`\\\\])*`)' + // Group 2: Strings
    '|\\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|default|import|export|from|class|extends|new|try|catch|finally|throw|async|await|true|false|null|undefined)\\b' + // Group 3: Keywords
    '|\\b(console|window|document|Object|Array|String|Number|Boolean|Promise|Map|Set|Math)\\b' + // Group 4: Built-ins
    '|\\b([a-zA-Z_]\\w*)(?=\\s*\\()' + // Group 5: Function calls
    '|\\b(\\d+)\\b', // Group 6: Numbers
    'g'
  );

  let lastIndex = 0;
  let html = '';

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  code.replace(regex, (match, g1, g2, g3, g4, g5, g6, offset) => {
    // Append text since last match
    const textBefore = code.slice(lastIndex, offset);
    html += escapeHtml(textBefore);

    // Append wrapped match
    if (g1) {
      html += `<span class="text-zinc-550 italic select-none">${escapeHtml(match)}</span>`;
    } else if (g2) {
      html += `<span class="text-emerald-400 font-medium">${escapeHtml(match)}</span>`;
    } else if (g3) {
      html += `<span class="text-pink-400 font-bold">${escapeHtml(match)}</span>`;
    } else if (g4) {
      html += `<span class="text-amber-400 font-semibold">${escapeHtml(match)}</span>`;
    } else if (g5) {
      html += `<span class="text-blue-400 font-semibold">${escapeHtml(match)}</span>`;
    } else if (g6) {
      html += `<span class="text-orange-400 font-medium">${escapeHtml(match)}</span>`;
    } else {
      html += escapeHtml(match);
    }

    lastIndex = offset + match.length;
    return match;
  });

  html += escapeHtml(code.slice(lastIndex));
  return html;
};

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

  // References for editor line numbers and scroll syncing
  const codeTextareaRef = useRef(null);
  const preRef = useRef(null);

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

  // Sync scroll offset from textarea to backdrop pre block
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
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
          onClick={() => navigate('/dashboard')}
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
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden">
      {/* Background radial soft light-glow decoration */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-blue-955/10 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Top Header Status Bar */}
      <header className="px-6 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 flex items-center justify-between z-10 shrink-0 select-none relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the interview session? Your progress will be saved.')) {
                navigate('/dashboard');
              }
            }}
            className="text-zinc-500 hover:text-zinc-350 hover:bg-zinc-905/60 p-1.5 rounded-lg border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
            title="Exit Session"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          </button>
          <div className="border-l border-zinc-850 h-5"></div>
          <div>
            <h2 className="text-xs font-bold text-zinc-200 leading-none">{sessionInfo.jobTitle}</h2>
            <p className="text-[9px] text-zinc-505 font-mono mt-1.5 uppercase tracking-wider font-bold">
              {sessionInfo.focusArea} | {sessionInfo.difficulty} Level
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono font-black px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg select-none">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="w-24 bg-zinc-900 h-1.5 rounded-full hidden sm:block overflow-hidden border border-zinc-850 select-none">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Split Grid Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-53px)] relative z-10">
        
        {/* Left Side: Interviewer / Question Box */}
        <section className="lg:col-span-5 border-r border-zinc-905 bg-zinc-950 flex flex-col p-6 sm:p-8 overflow-y-auto justify-between gap-6 relative">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 flex items-center justify-center relative select-none">
                <Bot className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                <div className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-zinc-950"></span>
                </div>
              </div>
              <div className="select-none">
                <h4 className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  AI Interviewer
                  <span className="rounded-full bg-blue-950/40 border border-blue-800/40 px-1.5 py-0.5 text-[8px] font-black text-blue-400">Online</span>
                </h4>
                <div className="flex items-center gap-1 h-3 mt-1.5">
                  <span className="w-0.5 bg-blue-500 rounded-full h-1.5 animate-[bounce_1s_infinite_100ms]"></span>
                  <span className="w-0.5 bg-indigo-505 rounded-full h-2.5 animate-[bounce_1s_infinite_300ms]"></span>
                  <span className="w-0.5 bg-blue-400 rounded-full h-2 animate-[bounce_1s_infinite_200ms]"></span>
                </div>
              </div>
            </div>

            {/* Question Card Prompt */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl backdrop-blur-sm group select-text">
              {/* Highlight Top border */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0"></div>
              
              <div className="flex items-center gap-1.5 select-none mb-4">
                <Info className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                <span className="text-[9px] font-mono font-black uppercase text-blue-400 tracking-wider">Question Prompt</span>
              </div>
              
              <p className="text-zinc-100 text-sm sm:text-base leading-relaxed font-semibold">
                {question.question}
              </p>
            </div>

            {/* Hint Box panel */}
            <AnimatePresence mode="wait">
              {hint ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-5 bg-amber-500/5 border border-amber-500/20 text-amber-200 rounded-2xl flex gap-3.5 backdrop-blur-sm select-text"
                >
                  <Lightbulb className="w-5.5 h-5.5 shrink-0 text-amber-400 animate-pulse" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-[9px] font-black font-mono uppercase tracking-wider mb-1 text-amber-450 select-none">Interviewer Suggestion</h5>
                    <p className="text-xs leading-relaxed font-medium">{hint}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRequestHint}
                    disabled={requestingHint}
                    className="flex items-center gap-2 text-[10px] font-mono font-black text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/60 disabled:opacity-50 cursor-pointer shadow-sm select-none"
                  >
                    {requestingHint ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                    ) : (
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Request Hint</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[9px] text-zinc-600 font-mono flex items-center gap-2 border-t border-zinc-900/80 pt-4 select-none">
            <Terminal className="w-3.5 h-3.5" />
            <span>SESSION_SECURED_ACTIVE // SSL_VERIFIED</span>
          </div>
        </section>

        {/* Right Side: Answer Input Box */}
        <section className="lg:col-span-7 flex flex-col overflow-hidden h-full bg-zinc-950">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
            {question.type === 'coding' ? (
              /* Coding Split Screen */
              <div className="flex-1 flex flex-col overflow-hidden p-6 gap-5">
                
                {/* Code Editor Panel */}
                <div className="flex-1 flex flex-col overflow-hidden border border-zinc-800 bg-zinc-900/25 rounded-2xl relative focus-within:border-zinc-700 shadow-xl backdrop-blur-sm">
                  {/* macOS Mock Header Bar */}
                  <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-900/40 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-3">
                      {/* Window Controls */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-600/30"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-600/30"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/30"></span>
                      </div>
                      <div className="border-l border-zinc-800 h-3 mx-1"></div>
                      {/* File Tab */}
                      <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] font-bold bg-zinc-950 px-3 py-1 rounded-lg border border-zinc-850 select-none">
                        <span className="text-amber-500 font-extrabold text-[9px] font-mono select-none">JS</span>
                        <span>solution.js</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleResetCode}
                      className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer font-mono text-[10px] font-bold py-1 px-2.5 rounded-lg border border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900"
                      title="Reset Template"
                    >
                      <RefreshCw className="w-3 h-3 text-zinc-400" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex-1 flex overflow-y-auto font-mono text-xs bg-zinc-950/15">
                    {/* Line Numbers */}
                    <div className="w-10 select-none border-r border-zinc-850/60 bg-zinc-950/80 text-zinc-500 flex flex-col items-center py-4 font-mono pr-2 text-right leading-[21px]">
                      {getLineNumbers().map((num) => (
                        <div key={num} className="h-[21px]">{num}</div>
                      ))}
                    </div>

                    {/* Syntax Highlighter and Textarea Container */}
                    <div className="flex-1 relative min-h-full font-mono text-xs leading-[21px] overflow-hidden">
                      {/* Code overlay background highlighted block */}
                      <pre 
                        ref={preRef}
                        className="absolute inset-0 p-4 pl-3 pointer-events-none whitespace-pre overflow-auto font-mono text-zinc-100 leading-[21px] select-none scrollbar-none"
                        dangerouslySetInnerHTML={{ __html: highlightJS(code) }}
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-mono, monospace)"
                        }}
                      />
                      
                      {/* Actual interactive transparent textarea */}
                      <textarea
                        ref={codeTextareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={handleCodeKeyDown}
                        onScroll={handleScroll}
                        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-zinc-100 p-4 pl-3 outline-none resize-none font-mono leading-[21px] whitespace-pre overflow-auto tab-size-2 focus:ring-0 border-0 focus:outline-none"
                        placeholder="// Write your solution function here..."
                        spellCheck="false"
                        style={{
                          fontFamily: "var(--font-mono, monospace)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Complexity/Explanation notes */}
                <div className="shrink-0 h-28 flex flex-col bg-zinc-900/10 border border-zinc-850 rounded-2xl p-4 focus-within:border-zinc-700 relative overflow-hidden backdrop-blur-sm shadow-md">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500/0 via-zinc-800 to-blue-500/0"></div>
                  <label htmlFor="codeExplanation" className="block text-[9px] font-bold text-zinc-500 mb-1.5 font-mono uppercase tracking-wider select-none">
                    Complexity & Strategy Notes
                  </label>
                  <textarea
                    id="codeExplanation"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-1 bg-transparent text-zinc-100 outline-none resize-none text-xs placeholder:text-zinc-600 border-0 p-0 focus:ring-0 focus:outline-none select-text font-medium"
                    placeholder="Describe your algorithm's core strategy and state the Big-O time/space complexity..."
                  />
                </div>
              </div>
            ) : (
              /* Conceptual / Behavioral Large Text Area */
              <div className="flex-1 overflow-y-auto p-6 flex flex-col select-text">
                <div className="flex-1 flex flex-col bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 focus-within:border-zinc-700 relative overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-blue-500/0 via-zinc-800 to-blue-500/0"></div>
                  <label htmlFor="textAnswer" className="block text-[9px] font-bold text-zinc-500 mb-3.5 font-mono uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    Your Response
                  </label>
                  <textarea
                    id="textAnswer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-1 bg-transparent text-zinc-100 outline-none resize-none text-sm leading-relaxed placeholder:text-zinc-650 min-h-[300px] border-0 p-0 focus:ring-0 focus:outline-none font-medium"
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
                  <Info className="w-4 h-4 shrink-0 text-red-500" strokeWidth={1.5} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Footer Action Panel */}
            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between shrink-0 select-none relative">
              <span className="text-[10px] font-medium text-zinc-500 hidden sm:block">Answers are saved temporarily to your session log.</span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto ml-auto bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-bold text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating response...</span>
                  </>
                ) : (
                  <>
                    <span>Submit response</span>
                    <ChevronRight className="w-4 h-4 text-zinc-800" strokeWidth={2} />
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
