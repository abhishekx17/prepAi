import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/Card';
import { 
  Search, 
  UserCog, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  X,
  Shield,
  Calendar,
  Layers,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 }); // Show 9 items per page (3x3 grid)

  // Modal Control States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', tier: 'Free', isVerified: false });
  const [updating, setUpdating] = useState(false);

  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [usageForm, setUsageForm] = useState({ resumesAnalyzed: 0, interviewsStarted: 0, quizzesTaken: 0 });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        limit: 9,
        search,
        tier,
        isVerified
      };
      const response = await api.get('/api/admin/users', { params });
      if (response.data?.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error(err);
      setActionError('Error loading users database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [tier, isVerified]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      tier: user.tier || 'Free',
      isVerified: !!user.isVerified
    });
    setActionError('');
    setActionSuccess('');
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setActionError('');
    try {
      const response = await api.put(`/api/admin/users/${selectedUser._id}`, editForm);
      if (response.data?.success) {
        setActionSuccess('User account updated successfully.');
        setEditModalOpen(false);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error updating user.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleLimits = async (user, enableUnlimited) => {
    setLoading(true);
    setActionError('');
    setActionSuccess('');
    try {
      const updatedTier = enableUnlimited ? 'Pro' : 'Free';
      const response = await api.put(`/api/admin/users/${user._id}`, {
        tier: updatedTier
      });
      if (response.data?.success) {
        setActionSuccess(`Tier adjusted: ${user.username} is now set to ${updatedTier}.`);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error toggling limits.');
      setLoading(false);
    }
  };

  const handleUsageClick = (user) => {
    setSelectedUser(user);
    setUsageForm({
      resumesAnalyzed: user.usage?.resumesAnalyzed || 0,
      interviewsStarted: user.usage?.interviewsStarted || 0,
      quizzesTaken: user.usage?.quizzesTaken || 0
    });
    setActionError('');
    setActionSuccess('');
    setUsageModalOpen(true);
  };

  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setActionError('');
    try {
      const response = await api.put(`/api/admin/users/${selectedUser._id}/reset-usage`, usageForm);
      if (response.data?.success) {
        setActionSuccess('User usage metrics updated successfully.');
        setUsageModalOpen(false);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error overriding usage.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setActionError('');
    setActionSuccess('');
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setActionError('');
    try {
      const response = await api.delete(`/api/admin/users/${userToDelete._id}`);
      if (response.data?.success) {
        setActionSuccess('User account and all cascading records deleted successfully.');
        setDeleteModalOpen(false);
        fetchUsers(pagination.page === 1 ? 1 : pagination.page);
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting user.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6 fade-in-up text-zinc-300 font-sans">
      {/* Top Banner and Messages */}
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5 sm:pb-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white tracking-tight">User Database Control</h1>
          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Configure license scopes, edit user credentials, override credits, or purge accounts</p>
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

      {/* Query Filters Control Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 sm:p-4 flex flex-col xl:flex-row gap-3 sm:gap-4 justify-between items-stretch xl:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>
          <button type="submit" className="h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold px-4 rounded-lg transition cursor-pointer sm:w-auto">
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap">
          <select 
            value={tier} 
            onChange={(e) => setTier(e.target.value)}
            className="h-9 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-300 outline-none focus:border-zinc-700"
          >
            <option value="">All Tiers</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <select 
            value={isVerified} 
            onChange={(e) => setIsVerified(e.target.value)}
            className="h-9 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-300 outline-none focus:border-zinc-700"
          >
            <option value="">All Statuses</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Database User Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <RotateCcw className="w-6 h-6 animate-spin text-sky-400 mb-3" />
          <p className="text-xs font-medium">Fetching accounts database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.length > 0 ? (
              users.map((u) => {
                const isSystemAdmin = u.email === 'abhishek.0x17@gmail.com';
                const hasUnlimited = u.tier === 'Pro' || u.tier === 'Enterprise';

                return (
                  <Card key={u._id} className="border-zinc-800 p-4 sm:p-5 bg-zinc-900/40 hover:border-zinc-700 transition flex min-h-[17rem] flex-col justify-between">
                    <div>
                      {/* Card Header (Username & Tier badge) */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white flex min-w-0 flex-wrap items-center gap-1.5">
                            <span className="truncate">{u.username}</span>
                            {isSystemAdmin && (
                              <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-900/35 text-[7px] font-black text-sky-400 uppercase tracking-wide">
                                Owner
                              </span>
                            )}
                          </h3>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{u.email}</p>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border shrink-0
                          ${u.tier === 'Enterprise' ? 'bg-purple-950/20 text-purple-400 border-purple-900/40' :
                            u.tier === 'Pro' ? 'bg-sky-955/20 text-sky-400 border-sky-900/40' :
                            'bg-zinc-950 text-zinc-500 border-zinc-800'}
                        `}>
                          {u.tier}
                        </span>
                      </div>

                      {/* Info & Verification indicators */}
                      <div className="flex flex-col gap-2 text-[10px] text-zinc-500 border-b border-zinc-800/60 pb-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Joined: {formatDate(u.createdAt)}</span>
                        </div>
                        {u.isVerified ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-zinc-500 font-semibold">
                            <XCircle className="w-3.5 h-3.5 text-zinc-700" />
                            <span>Pending OTP</span>
                          </span>
                        )}
                      </div>

                      {/* Usage meters list */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500">Resume Scans</span>
                          <span className="text-white font-semibold font-mono">
                            {u.usage?.resumesAnalyzed || 0}{!hasUnlimited && !isSystemAdmin ? '/5' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500">Mock Interviews</span>
                          <span className="text-emerald-450 font-semibold font-mono">
                            {u.usage?.interviewsStarted || 0}{!hasUnlimited && !isSystemAdmin ? '/1' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500">Trivia Quizzes Played</span>
                          <span className="text-purple-400 font-semibold font-mono">
                            {u.usage?.quizzesTaken || 0}{!hasUnlimited && !isSystemAdmin ? '/3' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom limits and actions control strip */}
                    <div className="border-t border-zinc-800/80 pt-3 mt-4 flex flex-col gap-3 shrink-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        {isSystemAdmin ? (
                          <span className="text-[10px] text-zinc-500 font-medium">Bypassed limits</span>
                        ) : hasUnlimited ? (
                          <button
                            onClick={() => handleToggleLimits(u, false)}
                            className="text-[10px] bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-red-900/40 text-zinc-300 hover:text-red-400 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <ArrowDownCircle className="w-3.5 h-3.5" />
                            <span>Enforce Limits</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleLimits(u, true)}
                            className="text-[10px] bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-900/40 text-zinc-300 hover:text-sky-400 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>End Limits (Pro)</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <button
                          disabled={isSystemAdmin}
                          onClick={() => handleEditClick(u)}
                          title="Modify Account Details"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isSystemAdmin}
                          onClick={() => handleUsageClick(u)}
                          title="Reset Usage Metrics"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isSystemAdmin}
                          onClick={() => handleDeleteClick(u)}
                          title="Cascade Delete User"
                          className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-zinc-500 text-xs">No accounts match selected filters.</div>
            )}
          </div>

          {/* Pagination controls footer */}
          {!loading && pagination.totalPages > 1 && (
            <div className="p-3 sm:p-4 border border-zinc-800 rounded-lg bg-zinc-900/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-zinc-500 text-xs">
                Page <strong className="text-white">{pagination.page}</strong> of <strong className="text-white">{pagination.totalPages}</strong> (Total {pagination.total})
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  className="p-1 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-lg p-5 sm:p-6 shadow-2xl relative fade-in-up">
            <button 
              onClick={() => setEditModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <UserCog className="w-4.5 h-4.5 text-zinc-400" />
              <span>Modify User Account</span>
            </h2>
            <p className="text-zinc-500 text-xs mb-6">Modify fields for user: <strong className="text-zinc-300">{selectedUser?.username}</strong></p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Username</label>
                <input 
                  type="text" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Email address</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Licensing Plan</label>
                <select 
                  value={editForm.tier}
                  onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="isVerified"
                  checked={editForm.isVerified}
                  onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                  className="w-4 h-4 bg-zinc-950 border border-zinc-800 text-sky-500 rounded focus:ring-0 outline-none"
                />
                <label htmlFor="isVerified" className="text-xs font-semibold text-zinc-400 select-none cursor-pointer">
                  Mark user account as verified (Skip OTP verification)
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Usage Modal */}
      {usageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-lg p-5 sm:p-6 shadow-2xl relative fade-in-up">
            <button 
              onClick={() => setUsageModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <RotateCcw className="w-4.5 h-4.5 text-zinc-400" />
              <span>Override Usage metrics</span>
            </h2>
            <p className="text-zinc-500 text-xs mb-6">Modify usage database counters for: <strong className="text-zinc-300">{selectedUser?.username}</strong></p>

            <form onSubmit={handleUsageSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Resumes Scanned</label>
                <input 
                  type="number" 
                  min="0"
                  value={usageForm.resumesAnalyzed}
                  onChange={(e) => setUsageForm({ ...usageForm, resumesAnalyzed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Interviews Begun</label>
                <input 
                  type="number" 
                  min="0"
                  value={usageForm.interviewsStarted}
                  onChange={(e) => setUsageForm({ ...usageForm, interviewsStarted: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Quizzes Played</label>
                <input 
                  type="number" 
                  min="0"
                  value={usageForm.quizzesTaken}
                  onChange={(e) => setUsageForm({ ...usageForm, quizzesTaken: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setUsageModalOpen(false)}
                  className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-semibold text-xs py-2.5 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {updating ? 'Overriding...' : 'Save Usage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg p-5 sm:p-6 shadow-2xl relative fade-in-up">
            <div className="flex items-center gap-3 text-white mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <h2 className="text-base font-bold">Confirm Account Deletion</h2>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              You are about to delete user <strong className="text-white">"{userToDelete?.username}"</strong> ({userToDelete?.email}). 
              This will permanently purge this account and cascade delete all associated quiz logs, mock interviews, and match reports.
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
                className="flex-1 bg-red-900/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 hover:text-white font-semibold text-xs py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
