import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { getReportById, deleteReport } from '../services/report.api';
import LoadingScreen from '../components/LoadingScreen';
import { 
  ArrowLeft, 
  Trash2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square,
  Sparkles,
  BookOpen,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('match'); // 'match', 'technical', 'behavioral', 'plan'
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Fetch report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReportById(id);
        if (data?.report) {
          setReport(data.report);
          // Load completed tasks status from localStorage
          const storageKey = `report_tasks_${id}`;
          const savedTasks = localStorage.getItem(storageKey);
          if (savedTasks) {
            setCompletedTasks(JSON.parse(savedTasks));
          }
        } else {
          setError('Report details not found.');
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // Toggle question accordion
  const toggleQuestion = (index, type) => {
    const key = `${type}_${index}`;
    setExpandedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle roadmap task completion
  const toggleTask = (day, taskIndex) => {
    const taskKey = `${day}_${taskIndex}`;
    const updated = {
      ...completedTasks,
      [taskKey]: !completedTasks[taskKey],
    };
    setCompletedTasks(updated);
    
    // Save to localStorage
    const storageKey = `report_tasks_${id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Handle report deletion
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000); // Reset confirm state after 3s
      return;
    }

    try {
      setLoading(true);
      await deleteReport(id);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete report.');
      setLoading(false);
    }
  };

  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/10 border-emerald-900/30',
        circle: '#34d399' // emerald-400
      };
    }
    if (score >= 50) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-950/10 border-amber-900/30',
        circle: '#fbbf24' // amber-400
      };
    }
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-950/10 border-rose-900/30',
      circle: '#fb7185' // rose-400
    };
  };

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-rose-400 bg-rose-950/20 border-rose-900/30';
      case 'medium':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/30';
      default:
        return 'text-blue-400 bg-blue-950/20 border-blue-900/30';
    }
  };

  const formatResumeText = (text) => {
    if (!text) return <span className="text-zinc-500 italic">No resume snapshot provided.</span>;
    
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      const isHeading = /^(EXPERIENCE|PROJECTS|EDUCATION|SKILLS|SUMMARY|WORK HISTORY|LANGUAGES|CERTIFICATIONS|INTERNSHIPS|PUBLICATIONS|AWARDS|CONTACT|ABOUT ME)$/i.test(trimmed) || 
                        (trimmed.length > 2 && trimmed.length < 35 && trimmed === trimmed.toUpperCase() && !trimmed.includes('.') && !trimmed.includes(','));

      if (isHeading) {
        return (
          <div key={idx} className="mt-4 first:mt-0 mb-2 border-b border-zinc-800 pb-1 flex items-center gap-2">
            <span className="w-1 h-3 bg-zinc-500 rounded-full"></span>
            <span className="font-bold font-mono text-zinc-300 uppercase tracking-wider text-[10px] sm:text-xs">
              {trimmed}
            </span>
          </div>
        );
      }
      
      return (
        <div key={idx} className="text-zinc-400 text-xs leading-relaxed font-mono min-h-[1.1rem]">
          {line}
        </div>
      );
    });
  };

  if (loading) {
    return <LoadingScreen message="Fetching report" />;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
        <AlertTriangle className="w-12 h-12 text-zinc-650 mb-4" strokeWidth={1.5} />
        <h2 className="text-lg font-bold mb-2">Error Loading Report</h2>
        <p className="text-xs text-zinc-500 max-w-md mb-6">{error || 'The report does not exist or has been deleted.'}</p>
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

  const scoreTheme = getScoreTheme(report.matchScore);

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8 select-none">
        
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 border rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              deleteConfirm
                ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-bold'
                : 'bg-zinc-900 hover:bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{deleteConfirm ? 'Confirm delete' : 'Delete Report'}</span>
          </button>
        </div>

        {/* Hero Section: Report Identity & Score Card */}
        <section className="grid grid-cols-1 md:grid-cols-12 bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 sm:p-8 gap-8 items-center relative overflow-hidden">
          {/* Job details */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-950 border border-zinc-850 text-zinc-500">
                COMPATIBILITY_LOG
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date(report.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-50 tracking-tight leading-snug">
              {report.jobTitle}
            </h1>
            <p className="text-zinc-500 text-xs leading-relaxed max-h-20 overflow-y-auto pr-1 select-text">
              <strong>Preview:</strong> {report.jobDescription}
            </p>
          </div>

          {/* Match Score Display */}
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
                  strokeDashoffset={2 * Math.PI * 52 * (1 - report.matchScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-bold tracking-tight ${scoreTheme.text}`}>{report.matchScore}%</span>
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Match</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Selection Navigation */}
        <nav className="flex overflow-x-auto border-b border-zinc-800 gap-1 pb-px scrollbar-none">
          {[
            { id: 'match', label: 'Alignment & Gaps', icon: Layers },
            { id: 'technical', label: 'Technical Prep', icon: BookOpen },
            { id: 'behavioral', label: 'Behavioral Prep', icon: UserCheck },
            { id: 'plan', label: 'Study Roadmap', icon: Calendar },
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
                    layoutId="report-active-tab-line"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Contents */}
        <section className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Compatibility & Gaps */}
            {activeTab === 'match' && (
              <motion.div
                key="match"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
                  {/* Profile Notes Card */}
                  <div className="bg-zinc-950/80 border border-zinc-850/80 rounded-xl overflow-hidden flex flex-col backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-850/60 bg-zinc-900/30 px-4 py-2.5 select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                          profile_briefing.md
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {report.selfDescription ? `${report.selfDescription.split(/\s+/).length} words` : '0 words'}
                      </span>
                    </div>
                    <div className="p-5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2 select-text font-sans text-xs sm:text-sm leading-relaxed text-zinc-400">
                      {report.selfDescription || 'No profile notes provided.'}
                    </div>
                  </div>
                  
                  {/* Resume Text Card */}
                  <div className="bg-zinc-950/80 border border-zinc-850/80 rounded-xl overflow-hidden flex flex-col backdrop-blur-md shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-850/60 bg-zinc-900/30 px-4 py-2.5 select-none">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider ml-1">
                          resume_raw.txt
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {report.resume ? `${report.resume.split(/\s+/).length} words` : '0 words'}
                      </span>
                    </div>
                    <div className="p-5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2 select-text space-y-1">
                      {formatResumeText(report.resume)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2 select-none">
                    <Sparkles className="w-4.5 h-4.5 text-zinc-400" strokeWidth={1.5} />
                    Identified Skill Gaps
                  </h3>
                  {report.skillGaps.length === 0 ? (
                    <p className="text-zinc-500 text-xs italic">No significant skill gaps were detected! Your profile aligns closely with the job requirements.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 select-text">
                      {report.skillGaps.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
                          <span className="text-xs font-bold text-zinc-200">{item.skill}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md border uppercase tracking-wider font-mono font-bold shrink-0 ${getSeverityBadge(item.severity)}`}>
                            {item.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 2: Technical Questions */}
            {activeTab === 'technical' && (
              <motion.div
                key="technical"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2 select-none">
                  <HelpCircle className="w-4.5 h-4.5 text-zinc-400" strokeWidth={1.5} />
                  Technical Prep Questions
                </h3>
                {report.technicalQuestions.length === 0 ? (
                  <p className="text-zinc-550 text-xs italic">No technical questions generated.</p>
                ) : (
                  report.technicalQuestions.map((q, idx) => {
                    const key = `tech_${idx}`;
                    const isOpen = expandedQuestions[key];

                    return (
                      <div key={idx} className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                        <button
                          onClick={() => toggleQuestion(idx, 'tech')}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-zinc-200 hover:text-zinc-50 cursor-pointer select-none"
                        >
                          <span className="pr-4 flex items-start gap-2.5">
                            <span className="text-zinc-650 font-mono">Q{idx + 1}.</span>
                            <span>{q.question}</span>
                          </span>
                          {isOpen ? <ChevronUp className="w-4.5 h-4.5 shrink-0 text-zinc-400" /> : <ChevronDown className="w-4.5 h-4.5 shrink-0 text-zinc-400" />}
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
                              <div className="px-5 pb-5 border-t border-zinc-850 pt-4 bg-zinc-900/10 space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-400 select-text">
                                <div>
                                  <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono select-none">Intent</h4>
                                  <p>{q.intention}</p>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono select-none">Suggested Answer Strategy</h4>
                                  <p className="whitespace-pre-wrap font-sans">{q.answer}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* TAB 3: Behavioral Questions */}
            {activeTab === 'behavioral' && (
              <motion.div
                key="behavioral"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2 select-none">
                  <UserCheck className="w-4.5 h-4.5 text-zinc-400" strokeWidth={1.5} />
                  Behavioral Prep Questions
                </h3>
                {report.behavioralQuestions.length === 0 ? (
                  <p className="text-zinc-550 text-xs italic">No behavioral questions generated.</p>
                ) : (
                  report.behavioralQuestions.map((q, idx) => {
                    const key = `behavioral_${idx}`;
                    const isOpen = expandedQuestions[key];

                    return (
                      <div key={idx} className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                        <button
                          onClick={() => toggleQuestion(idx, 'behavioral')}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-zinc-200 hover:text-zinc-50 cursor-pointer select-none"
                        >
                          <span className="pr-4 flex items-start gap-2.5">
                            <span className="text-zinc-650 font-mono">Q{idx + 1}.</span>
                            <span>{q.question}</span>
                          </span>
                          {isOpen ? <ChevronUp className="w-4.5 h-4.5 shrink-0 text-zinc-400" /> : <ChevronDown className="w-4.5 h-4.5 shrink-0 text-zinc-400" />}
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
                              <div className="px-5 pb-5 border-t border-zinc-850 pt-4 bg-zinc-900/10 space-y-4 text-xs sm:text-sm leading-relaxed text-zinc-400 select-text">
                                <div>
                                  <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono select-none">Intent</h4>
                                  <p>{q.intention}</p>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono select-none">Structuring Strategy</h4>
                                  <p className="whitespace-pre-wrap font-sans">{q.answer}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* TAB 4: Study Roadmap */}
            {activeTab === 'plan' && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2 select-none">
                  <Calendar className="w-4.5 h-4.5 text-zinc-400" strokeWidth={1.5} />
                  7-Day Study Roadmap
                </h3>
                {report.preparationPlan.length === 0 ? (
                  <p className="text-zinc-550 text-xs italic">No custom roadmap generated.</p>
                ) : (
                  <div className="relative border-l border-zinc-800 ml-3.5 pl-6 sm:pl-8 space-y-8 select-text">
                    {report.preparationPlan.map((dayItem, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[35px] sm:-left-[43px] top-1 w-5.5 h-5.5 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-200 font-mono shadow-sm select-none">
                          {dayItem.day}
                        </span>
                        
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 hover:border-zinc-700 transition-colors">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 select-none">Day {dayItem.day}</span>
                            <h4 className="text-sm font-bold text-zinc-150 mt-0.5">{dayItem.focus}</h4>
                          </div>

                          {/* Interactive Task checklist */}
                          <div className="space-y-2 select-none">
                            {dayItem.tasks.map((task, taskIdx) => {
                              const isCompleted = completedTasks[`${dayItem.day}_${taskIdx}`];

                              return (
                                <button
                                  key={taskIdx}
                                  onClick={() => toggleTask(dayItem.day, taskIdx)}
                                  className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-900/30 text-left transition-colors cursor-pointer group"
                                >
                                  <div className="mt-0.5 shrink-0 text-zinc-500 group-hover:text-zinc-350">
                                    {isCompleted ? (
                                      <CheckSquare className="w-4 h-4 text-zinc-200" strokeWidth={1.5} />
                                    ) : (
                                      <Square className="w-4 h-4 text-zinc-800 group-hover:text-zinc-650" strokeWidth={1.5} />
                                    )}
                                  </div>
                                  <span className={`text-xs sm:text-sm transition-all ${isCompleted ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                                    {task}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
};

export default ReportDetail;
