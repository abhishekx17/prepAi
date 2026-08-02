import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { getQuiz } from '../services/quiz.api';
import LoadingScreen from '../components/LoadingScreen';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';

const QuizResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getQuiz(id);
        
        if (data?.status === 'active') {
          navigate(`/quiz/${id}`);
          return;
        }

        setSession(data.session);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quiz results.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizResult();
  }, [id]);

  const getScoreTheme = (score, total) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 80) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/15 border-emerald-900/30',
        circle: '#34d399',
        badge: 'EXCELLENT COMPREHENSION'
      };
    }
    if (percentage >= 50) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-950/15 border-amber-900/30',
        circle: '#fbbf24',
        badge: 'STEADY PROGRESS'
      };
    }
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-950/15 border-rose-900/30',
      circle: '#fb7185',
      badge: 'NEEDS PRACTICE'
    };
  };

  if (loading) {
    return <LoadingScreen message="Evaluating performance" />;
  }

  if (error || !session) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-zinc-500 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">Error Loading Results</h2>
        <p className="text-xs text-zinc-505 max-w-md mb-6">{error || 'Could not find quiz session details.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-zinc-50 text-zinc-950 font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  const { score, numQuestions, topic, difficulty, questions, createdAt } = session;
  const scoreTheme = getScoreTheme(score, numQuestions);
  const percentage = Math.round((score / numQuestions) * 100);
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-4 sm:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto space-y-8 select-none">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <span className="text-[10px] text-zinc-500 font-mono font-medium">
            TEST_DATE: {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Scorecard Hero Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-12 bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 sm:p-8 gap-8 items-center relative overflow-hidden">
          {/* Details */}
          <div className="sm:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${scoreTheme.bg} ${scoreTheme.text} uppercase tracking-wider`}>
                {scoreTheme.badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-50 tracking-tight leading-snug">
              {topic}
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">
              {numQuestions} Questions | {difficulty} Difficulty
            </p>
          </div>

          {/* Performance Circle */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Radial Glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-md" />
              
              <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 120 120">
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
                  strokeDashoffset={2 * Math.PI * 52 * (1 - score / numQuestions)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center z-10">
                <span className={`text-2xl font-bold tracking-tight ${scoreTheme.text}`}>{percentage}%</span>
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{score} / {numQuestions}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Review list */}
        <section className="space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
            Diagnostic critique
          </h3>

          {questions.map((q, idx) => {
            const isCorrect = q.userAnswerIndex === q.correctOptionIndex;

            return (
              <div 
                key={idx} 
                className={`border border-zinc-800 bg-zinc-900/10 rounded-xl p-5 sm:p-6 space-y-4 border-l-4 ${
                  isCorrect ? 'border-l-emerald-500/80' : 'border-l-rose-500/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-start gap-2.5 leading-relaxed select-text">
                    <span className="text-zinc-650 font-mono">Q{idx + 1}.</span>
                    <span>{q.question}</span>
                  </h4>
                  {isCorrect ? (
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-bold font-mono rounded-md flex items-center gap-1 shrink-0 select-none">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
                      Correct
                    </span>
                  ) : (
                    <span className="text-[9px] px-2 py-0.5 bg-rose-950/20 border border-rose-900/30 text-rose-400 font-bold font-mono rounded-md flex items-center gap-1 shrink-0 select-none">
                      <XCircle className="w-3 h-3 text-rose-400" strokeWidth={1.5} />
                      Incorrect
                    </span>
                  )}
                </div>

                {/* Graded Options grid */}
                <div className="space-y-2 select-text">
                  {q.options.map((opt, optIdx) => {
                    const isUserSelection = q.userAnswerIndex === optIdx;
                    const isCorrectOption = q.correctOptionIndex === optIdx;
                    const label = optionLabels[optIdx];

                    let styleClasses = 'border-zinc-850/60 bg-zinc-950/20 text-zinc-500';
                    let markIcon = null;

                    if (isCorrectOption) {
                      styleClasses = 'border-emerald-500/30 bg-emerald-950/10 text-emerald-200 font-medium';
                      markIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.5} />;
                    } else if (isUserSelection && !isCorrect) {
                      styleClasses = 'border-rose-500/30 bg-rose-950/10 text-rose-200 font-medium';
                      markIcon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" strokeWidth={1.5} />;
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs sm:text-sm ${styleClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 select-none ${
                            isCorrectOption 
                              ? 'bg-emerald-550 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                              : isUserSelection
                              ? 'bg-rose-550 text-white shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                              : 'bg-zinc-950 text-zinc-600 border border-zinc-850'
                          }`}>
                            {label}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {markIcon}
                      </div>
                    );
                  })}
                </div>

                {/* AI Explanation block */}
                <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-lg space-y-1.5 text-xs text-zinc-400 select-text">
                  <div className="flex items-center gap-1.5 text-zinc-550 select-none">
                    <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">AI Explanation</span>
                  </div>
                  <p className="font-sans leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Retry Section */}
        <section className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/10 border border-zinc-800 p-5 rounded-xl">
          <RefreshCw className="w-7 h-7 text-zinc-550 shrink-0 animate-[spin_40s_linear_infinite]" strokeWidth={1.5} />
          <div className="text-center sm:text-left flex-1">
            <h4 className="text-xs font-bold text-zinc-200">Want to challenge yourself again?</h4>
            <p className="text-[11px] text-zinc-550 mt-1 leading-normal">Start another interactive technical session or check your compatibility details dashboard.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-zinc-50 hover:bg-white text-zinc-950 font-bold text-xs py-2.5 px-4.5 rounded-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shrink-0"
          >
            Practice new quiz
          </button>
        </section>

      </div>
    </main>
  );
};

export default QuizResult;
