import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/Card';
import { 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Eye, 
  X,
  MessageSquare,
  Award,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

export default function SessionsManagement() {
  const [activeTab, setActiveTab] = useState('interviews');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filtering states
  const [difficulty, setDifficulty] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [status, setStatus] = useState('');

  // Data states
  const [interviews, setInterviews] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 }); // Show 9 items per page (3x3 grid)

  // Modal States
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchSessions = async (pageNumber = 1) => {
    setLoading(true);
    setActionError('');
    try {
      const params = {
        page: pageNumber,
        limit: 9,
        search,
        ...(activeTab === 'interviews' ? { difficulty, status, focusArea } : {}),
        ...(activeTab === 'quizzes' ? { difficulty, status } : {})
      };

      const url = activeTab === 'interviews' 
        ? '/api/admin/interviews' 
        : activeTab === 'quizzes' 
          ? '/api/admin/quizzes' 
          : '/api/admin/reports';
          
      const response = await api.get(url, { params });
      
      if (response.data?.success) {
        if (activeTab === 'interviews') {
          setInterviews(response.data.interviews);
        } else if (activeTab === 'quizzes') {
          setQuizzes(response.data.quizzes);
        } else {
          setReports(response.data.reports);
        }
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error(err);
      setActionError('Error fetching sessions database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch('');
    setDifficulty('');
    setFocusArea('');
    setStatus('');
    fetchSessions(1);
  }, [activeTab]);

  useEffect(() => {
    // Only filter for tabs that support these filters
    if (activeTab !== 'reports') {
      fetchSessions(1);
    }
  }, [difficulty, focusArea, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions(1);
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setDetailModalOpen(true);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setActionError('');
    try {
      const url = activeTab === 'interviews' 
        ? `/api/admin/interviews/${sessionToDelete._id}` 
        : activeTab === 'quizzes' 
          ? `/api/admin/quizzes/${sessionToDelete._id}` 
          : `/api/admin/reports/${sessionToDelete._id}`;
      
      const response = await api.delete(url);
      if (response.data?.success) {
        setActionSuccess('Log entry deleted successfully.');
        setDeleteModalOpen(false);
        fetchSessions(pagination.page);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting log entry.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 fade-in-up text-zinc-300">
      {/* Header and alerts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Activity Session Audit</h1>
          <p className="text-zinc-500 text-xs mt-1">Audit resumes, inspect code outputs, view feedback reports, and clean up active/expired databases</p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-xs flex justify-between items-center">
          <span className="text-emerald-450 font-semibold">{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-xs flex justify-between items-center">
          <span className="text-red-400 font-semibold">{actionError}</span>
          <button onClick={() => setActionError('')} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs selector */}
      <div className="flex border-b border-zinc-900 gap-4">
        <button
          onClick={() => setActiveTab('interviews')}
          className={`pb-3 font-semibold text-xs relative transition uppercase tracking-wider cursor-pointer
            ${activeTab === 'interviews' ? 'text-sky-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}
          `}
        >
          <span>Interview Arenas</span>
          {activeTab === 'interviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 font-semibold text-xs relative transition uppercase tracking-wider cursor-pointer
            ${activeTab === 'quizzes' ? 'text-sky-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}
          `}
        >
          <span>Quiz Sessions</span>
          {activeTab === 'quizzes' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"></span>}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 font-semibold text-xs relative transition uppercase tracking-wider cursor-pointer
            ${activeTab === 'reports' ? 'text-sky-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}
          `}
        >
          <span>Resume Reports</span>
          {activeTab === 'reports' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"></span>}
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={activeTab === 'interviews' ? 'Search job titles...' : activeTab === 'quizzes' ? 'Search quiz topics...' : 'Search report titles...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>
          <button type="submit" className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
            Search
          </button>
        </form>

        {activeTab !== 'reports' && (
          <div className="flex flex-wrap gap-3">
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700"
            >
              <option value="">All Difficulties</option>
              {activeTab === 'interviews' ? (
                <>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </>
              ) : (
                <>
                  <option value="Low">Low</option>
                  <option value="Mid">Mid</option>
                  <option value="High">High</option>
                </>
              )}
            </select>

            {activeTab === 'interviews' && (
              <select 
                value={focusArea} 
                onChange={(e) => setFocusArea(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700"
              >
                <option value="">All Focus Areas</option>
                <option value="Coding Heavy">Coding Heavy</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            )}

            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-zinc-700"
            >
              <option value="">All Statuses</option>
              {activeTab === 'interviews' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </>
              ) : (
                <>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Main Database Session Grid (Cards Layout) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <RotateCcw className="w-6 h-6 animate-spin text-sky-400 mb-3" />
          <p className="text-xs font-medium">Fetching session activity logs...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'interviews' ? (
              interviews.length > 0 ? (
                interviews.map((i) => (
                  <Card key={i._id} className="border-zinc-800 p-5 bg-zinc-900/40 hover:border-zinc-700 transition flex flex-col justify-between h-56">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate" title={i.jobTitle}>
                            {i.jobTitle}
                          </h3>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{i.userId?.username || 'Deleted User'} ({i.userId?.email || 'N/A'})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-semibold uppercase">
                          {i.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {i.focusArea}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-5 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-3">
                        <div className="flex items-center gap-1.5 uppercase text-[9px]">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full 
                            ${i.status === 'completed' ? 'bg-emerald-500' : i.status === 'active' ? 'bg-sky-500' : 'bg-zinc-700'}
                          `}></span>
                          <span className="font-semibold">{i.status}</span>
                        </div>
                        {i.evaluation?.score > 0 ? (
                          <span className="font-mono text-emerald-450 font-bold">Score: {i.evaluation.score}%</span>
                        ) : (
                          <span className="text-zinc-650">No evaluation score</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Started: {formatDate(i.createdAt)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(i)}
                          title="Audit Interview Arena"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(i)}
                          title="Purge Interview Session"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-zinc-500 text-xs">No active interview session logs.</div>
              )
            ) : activeTab === 'quizzes' ? (
              quizzes.length > 0 ? (
                quizzes.map((q) => (
                  <Card key={q._id} className="border-zinc-800 p-5 bg-zinc-900/40 hover:border-zinc-700 transition flex flex-col justify-between h-56">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate" title={q.topic}>
                            {q.topic}
                          </h3>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{q.userId?.username || 'Deleted User'} ({q.userId?.email || 'N/A'})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-semibold uppercase">
                          {q.difficulty} Level
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {q.numQuestions} Qs
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-5 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-3">
                        <div className="flex items-center gap-1.5 uppercase text-[9px]">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full 
                            ${q.status === 'completed' ? 'bg-emerald-500' : 'bg-sky-500'}
                          `}></span>
                          <span className="font-semibold">{q.status}</span>
                        </div>
                        {q.status === 'completed' ? (
                          <span className="font-mono text-emerald-450 font-bold">Grade: {q.score}/{q.numQuestions}</span>
                        ) : (
                          <span className="text-zinc-500 font-normal">playing</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Started: {formatDate(q.createdAt)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(q)}
                          title="Audit Quiz Session"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(q)}
                          title="Purge Quiz Session"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-zinc-500 text-xs">No active quiz session logs.</div>
              )
            ) : (
              /* Resume Reports list */
              reports.length > 0 ? (
                reports.map((r) => (
                  <Card key={r._id} className="border-zinc-800 p-5 bg-zinc-900/40 hover:border-zinc-700 transition flex flex-col justify-between h-56">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate" title={r.jobTitle}>
                            {r.jobTitle}
                          </h3>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{r.userId?.username || 'Deleted User'} ({r.userId?.email || 'N/A'})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-zinc-905 border border-zinc-800 text-zinc-400 font-mono font-bold flex items-center gap-1">
                          <FileText className="w-3 h-3 text-zinc-500" />
                          <span>Resume Analyzed</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-5 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-3">
                        <span className="font-semibold text-zinc-400">Match score evaluation</span>
                        <span className={`font-mono text-xs font-black px-2 py-0.5 rounded border
                          ${r.matchScore >= 80 ? 'text-emerald-400 border-emerald-900/35 bg-emerald-950/20' : 
                            r.matchScore >= 50 ? 'text-amber-400 border-amber-900/35 bg-amber-950/20' : 
                            'text-red-400 border-red-900/35 bg-red-950/20'}
                        `}>
                          {r.matchScore}% Score
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Generated: {formatDate(r.createdAt)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(r)}
                          title="Audit Resume Match Report"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(r)}
                          title="Purge Resume Report"
                          className="p-1.5 rounded-lg bg-zinc-955 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-zinc-500 text-xs">No resume match reports generated.</div>
              )
            )}
          </div>

          {/* Pagination controls footer */}
          {!loading && pagination.totalPages > 1 && (
            <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/20 flex items-center justify-between">
              <span className="text-zinc-500 text-xs">
                Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> (Total {pagination.total})
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchSessions(pagination.page - 1)}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchSessions(pagination.page + 1)}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl relative fade-in-up">
            <h2 className="text-base font-bold text-white mb-2">Delete Activity Log</h2>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Are you sure you want to delete this {activeTab === 'interviews' ? 'interview session' : activeTab === 'quizzes' ? 'quiz session' : 'resume match report'} log? 
              This will remove the metrics permanently from the database.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Audit Detail Inspector Modal */}
      {detailModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-955/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto flex flex-col fade-in-up">
            <button 
              onClick={() => setDetailModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title header */}
            <div className="mb-6 border-b border-zinc-800 pb-4">
              <span className="text-[9px] font-bold text-zinc-400 tracking-wider uppercase font-mono">
                {activeTab === 'interviews' ? 'Interview Arena Audit' : activeTab === 'quizzes' ? 'Quiz Session Audit' : 'Resume Match Report Audit'}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {activeTab === 'interviews' ? selectedSession.jobTitle : activeTab === 'quizzes' ? selectedSession.topic : selectedSession.jobTitle}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 mt-2">
                <span>User: <strong className="text-zinc-300 font-semibold">{selectedSession.userId?.username || 'Deleted User'}</strong> ({selectedSession.userId?.email || 'N/A'})</span>
                <span>Date: <strong className="text-zinc-300 font-semibold">{formatDate(selectedSession.createdAt)}</strong></span>
                {activeTab !== 'reports' && <span>Difficulty: <strong className="text-zinc-300 font-semibold">{selectedSession.difficulty}</strong></span>}
              </div>
            </div>

            {/* Modal Content body */}
            <div className="flex-grow space-y-6 overflow-y-auto pr-1">
              {activeTab === 'interviews' ? (
                /* Interview Arena Details */
                <>
                  {selectedSession.status === 'completed' && selectedSession.evaluation && (
                    <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-zinc-500" />
                          <span>AI Evaluation Result</span>
                        </h3>
                        <span className="text-base font-black text-white font-mono">{selectedSession.evaluation.score}% Score</span>
                      </div>
                      
                      {selectedSession.evaluation.recommendation && (
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          <strong>Decision Recommendation:</strong> {selectedSession.evaluation.recommendation}
                        </p>
                      )}
                      {selectedSession.evaluation.feedbackSummary && (
                        <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-2.5">
                          <strong>Summary Feedback:</strong> {selectedSession.evaluation.feedbackSummary}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Target Role Description</h4>
                    <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
                      {selectedSession.jobDescription}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Interaction Log ({selectedSession.questions?.length || 0} Questions)</h3>
                    
                    {selectedSession.questions && selectedSession.questions.map((q, idx) => (
                      <div key={idx} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-500 font-mono font-medium">Question {idx + 1} ({q.type})</span>
                            <p className="text-xs font-semibold text-white leading-relaxed">{q.question}</p>
                          </div>
                          {q.score > 0 && (
                            <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                              {q.score}/10
                            </span>
                          )}
                        </div>

                        {q.userAnswer && (
                          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                            <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wide mb-1">User Explanation</span>
                            <p className="text-zinc-400 leading-relaxed">{q.userAnswer}</p>
                          </div>
                        )}

                        {q.userCode && (
                          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono">
                            <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Submitted Code</span>
                            <pre className="text-zinc-400 overflow-x-auto text-[11px] leading-relaxed whitespace-pre">{q.userCode}</pre>
                          </div>
                        )}

                        {q.feedback && (
                          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs flex gap-2">
                            <MessageSquare className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wide mb-1">AI Critique</span>
                              <p className="text-zinc-400">{q.feedback}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : activeTab === 'quizzes' ? (
                /* Quiz Details */
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quiz Sheet ({selectedSession.questions?.length || 0} Questions)</h3>
                  
                  {selectedSession.questions && selectedSession.questions.map((q, idx) => {
                    const isCorrect = q.userAnswerIndex === q.correctOptionIndex;
                    return (
                      <div key={idx} className="p-4 bg-zinc-955/50 border border-zinc-800 rounded-lg space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs font-semibold text-white leading-relaxed">{idx + 1}. {q.question}</p>
                          <div className="flex items-center gap-1 font-mono uppercase text-[9px]">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full 
                              ${q.userAnswerIndex === -1 ? 'bg-zinc-700' : isCorrect ? 'bg-emerald-500' : 'bg-red-500'}
                            `}></span>
                            <span>{q.userAnswerIndex === -1 ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}</span>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options && q.options.map((opt, optIdx) => {
                            const selected = q.userAnswerIndex === optIdx;
                            const correct = q.correctOptionIndex === optIdx;
                            return (
                              <div 
                                key={optIdx} 
                                className={`p-2.5 rounded border text-xs leading-relaxed
                                  ${correct ? 'bg-zinc-950 border-zinc-800 text-emerald-400 font-semibold' :
                                    selected && !correct ? 'bg-zinc-950 border-zinc-800 text-red-400 font-semibold' :
                                    'bg-zinc-950 border-zinc-800 text-zinc-500'}
                                `}
                              >
                                <span className="font-semibold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs flex gap-2">
                            <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                            <p className="text-zinc-400 leading-relaxed font-semibold">
                              Explanation: <span className="font-normal text-zinc-400">{q.explanation}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Resume Report Details */
                <div className="space-y-6">
                  {/* Match Score Indicator Panel */}
                  <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-sky-400" />
                        <span>AI Match Evaluation</span>
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">Profile fit grade based on candidate resume and target role description.</p>
                    </div>
                    <span className={`text-2xl font-black font-mono px-4 py-2 rounded-xl border
                      ${selectedSession.matchScore >= 80 ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : 
                        selectedSession.matchScore >= 50 ? 'text-amber-400 border-amber-900/50 bg-amber-950/20' : 
                        'text-red-400 border-red-900/50 bg-red-950/20'}
                    `}>
                      {selectedSession.matchScore}% Fit
                    </span>
                  </div>

                  {/* Skill Gaps List */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Identified Skill Gaps ({selectedSession.skillGaps?.length || 0})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedSession.skillGaps && selectedSession.skillGaps.map((gap, idx) => (
                        <div key={idx} className="p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{gap.skill}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border
                            ${gap.severity === 'high' ? 'bg-red-950/20 text-red-400 border-red-900/40' : 
                              gap.severity === 'medium' ? 'bg-amber-950/20 text-amber-400 border-amber-900/40' : 
                              'bg-zinc-950 text-zinc-500 border-zinc-800'}
                          `}>
                            {gap.severity}
                          </span>
                        </div>
                      ))}
                      {(!selectedSession.skillGaps || selectedSession.skillGaps.length === 0) && (
                        <div className="col-span-2 text-center text-zinc-500 py-2 text-xs">No critical gaps detected.</div>
                      )}
                    </div>
                  </div>

                  {/* Technical & Behavioral Questions suggested */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Recommended Interview Questions</span>
                    </h3>
                    
                    {/* Tech list */}
                    {selectedSession.technicalQuestions && selectedSession.technicalQuestions.map((q, idx) => (
                      <div key={`tech-${idx}`} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-sky-400 uppercase text-[8px]">
                          <span>Tech Q {idx + 1}</span>
                        </div>
                        <p className="font-semibold text-white leading-relaxed">{q.question}</p>
                        <p className="text-[10px] text-zinc-400"><strong className="text-zinc-500">Intention:</strong> {q.intention}</p>
                        <p className="text-zinc-400 border-t border-zinc-800 pt-2 mt-2 leading-relaxed"><strong className="text-zinc-500">Suggested Answer:</strong> {q.answer}</p>
                      </div>
                    ))}

                    {/* Behavioral list */}
                    {selectedSession.behavioralQuestions && selectedSession.behavioralQuestions.map((q, idx) => (
                      <div key={`behav-${idx}`} className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-purple-400 uppercase text-[8px]">
                          <span>Behavioral Q {idx + 1}</span>
                        </div>
                        <p className="font-semibold text-white leading-relaxed">{q.question}</p>
                        <p className="text-[10px] text-zinc-400"><strong className="text-zinc-500">Intention:</strong> {q.intention}</p>
                        <p className="text-zinc-400 border-t border-zinc-800 pt-2 mt-2 leading-relaxed"><strong className="text-zinc-500">Suggested Answer:</strong> {q.answer}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actionable Prep Plan */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Custom Study roadmap</span>
                    </h3>
                    <div className="space-y-3">
                      {selectedSession.preparationPlan && selectedSession.preparationPlan.map((plan, idx) => (
                        <div key={idx} className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-lg space-y-2.5 text-xs">
                          <div className="flex justify-between font-bold text-white uppercase text-[9px] border-b border-zinc-800 pb-2">
                            <span>Day {plan.day}</span>
                            <span className="text-zinc-500 font-semibold">{plan.focus}</span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
                            {plan.tasks && plan.tasks.map((task, taskIdx) => (
                              <li key={taskIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume & Job Description Collapsible content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wide">Candidate Resume Raw</span>
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-400 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedSession.resume || 'No resume text uploaded.'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wide">Job Description details</span>
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-400 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedSession.jobDescription || 'No job details provided.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="mt-6 pt-4 border-t border-zinc-800 text-right">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 font-semibold text-xs px-5 py-2.5 rounded-lg transition cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
