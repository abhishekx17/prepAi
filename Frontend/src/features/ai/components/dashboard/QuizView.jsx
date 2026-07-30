import React from 'react';
import { Play, ClipboardCheck, Sparkles, Zap, Award, Target, Timer } from 'lucide-react';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { Input, FieldLabel } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';

const SUGGESTED_TOPICS = [
  'React Hooks',
  'JavaScript Closures',
  'SQL vs NoSQL',
  'REST APIs',
  'System Design'
];

const QuizView = ({
  quizTopic,
  setQuizTopic,
  quizDifficulty,
  setQuizDifficulty,
  quizNumQuestions,
  setQuizNumQuestions,
  error,
  successMsg,
  onClear,
  onSubmit,
}) => {
  const difficulties = [
    { 
      value: 'Low', 
      label: 'Beginner', 
      desc: 'Junior level concepts & basic syntax check', 
      activeColor: 'border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-lg shadow-emerald-500/5' 
    },
    { 
      value: 'Mid', 
      label: 'Intermediate', 
      desc: 'Practical application & core architectures', 
      activeColor: 'border-amber-500 bg-amber-950/20 text-amber-300 shadow-lg shadow-amber-500/5' 
    },
    { 
      value: 'High', 
      label: 'Advanced', 
      desc: 'System scaling, optimization & design patterns', 
      activeColor: 'border-rose-500 bg-rose-950/20 text-rose-300 shadow-lg shadow-rose-500/5' 
    },
  ];

  const questionCounts = [
    { value: 5, label: '5 Questions', desc: 'Quick check', time: '5 mins', icon: Zap },
    { value: 10, label: '10 Questions', desc: 'Standard test', time: '15 mins', icon: Target },
    { value: 15, label: '15 Questions', desc: 'Deep dive', time: '30 mins', icon: Award },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="p-5 sm:p-6 bg-zinc-950/40 border border-zinc-850/80 shadow-2xl backdrop-blur-sm">
        <CardHeader
          icon={ClipboardCheck}
          title="Skill Quiz"
          description="Assess your technical comprehension in seconds. Select a topic, difficulty, and size to generate custom questions."
          action={
            <Button variant="secondary" size="sm" onClick={onClear} className="h-8 text-xs px-2.5">
              Reset
            </Button>
          }
        />

        {(error || successMsg) && (
          <div className="mt-5">
            <Alert type={error ? 'error' : 'success'}>{error || successMsg}</Alert>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {/* Technical Topic Selector */}
          <div>
            <FieldLabel htmlFor="quizTopic">Technical topic</FieldLabel>
            <Input
              id="quizTopic"
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
              placeholder="e.g. React Hooks, Database Indexing, JavaScript Closures"
              required
              className="bg-[#161926] border border-slate-855 py-3 rounded-xl focus:border-slate-500"
            />
            {/* Suggested quick chips */}
            <div className="mt-2.5 flex flex-wrap gap-2 select-none">
              {SUGGESTED_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuizTopic(t)}
                  className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Cards Selection */}
          <div className="space-y-3">
            <FieldLabel>Select Difficulty</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3 select-none">
              {difficulties.map((d) => {
                const isSelected = quizDifficulty === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setQuizDifficulty(d.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                      isSelected 
                        ? d.activeColor 
                        : 'border-zinc-850 bg-zinc-900/10 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider font-mono">{d.label}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{d.desc}</p>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current self-end mt-2"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count Cards Selection */}
          <div className="space-y-3">
            <FieldLabel>Question Size</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3 select-none">
              {questionCounts.map((q) => {
                const isSelected = quizNumQuestions === q.value;
                const Icon = q.icon;
                return (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => setQuizNumQuestions(q.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'border-sky-500/50 bg-sky-950/15 text-sky-200 shadow-lg shadow-sky-500/5' 
                        : 'border-zinc-850 bg-zinc-900/10 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-zinc-950 text-zinc-500 border border-zinc-850'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-none">{q.label}</h4>
                        <span className="text-[9px] font-mono text-zinc-500 mt-1 block">{q.desc}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 flex items-center gap-1 select-none">
                        <Timer className="w-3 h-3 text-zinc-400" />
                        {q.time}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between select-none">
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium max-w-md">
              Generates customized question items with real-time scoring, comprehensive grading breakdown, and targeted AI study explanations.
            </p>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold h-11 px-6 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/10 border-0"
            >
              <Play className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} />
              Launch quiz
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default QuizView;
