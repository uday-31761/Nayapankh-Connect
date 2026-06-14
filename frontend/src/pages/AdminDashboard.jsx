import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Users, UserCheck, ShieldAlert, Layers, BarChart3, 
  Search, Check, X, ShieldAlert as DemoteIcon, Trash2, Plus, ArrowUpRight, FileCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area,
  RadialBarChart, RadialBar, PolarGrid
} from 'recharts';
import api from '../api/axiosConfig';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';

const CHART_COLORS = ['#16a34a', '#ca8a04', '#0d9488', '#0284c7', '#4f46e5', '#db2777', '#ea580c', '#e11d48'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Stats / Analytics State
  const [stats, setStats] = useState(null);

  // Volunteers List
  const [volunteers, setVolunteers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all'); // all, name, email, college, skills, batch, status

  // Pending Applications
  const [pendingApps, setPendingApps] = useState([]);
  const [rejectionModalUser, setRejectionModalUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Profile Updates
  const [profileUpdates, setProfileUpdates] = useState([]);

  // Batches
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');

  // Assign Batch Modal/Overlay State
  const [assignBatchUser, setAssignBatchUser] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, volRes, pendRes, updatesRes, batchesRes] = await Promise.all([
        api.get('/api/admin/reports-dashboard'),
        api.get('/api/admin/volunteers'),
        api.get('/api/admin/pending-applications'),
        api.get('/api/admin/pending-profile-updates'),
        api.get('/api/admin/batches')
      ]);

      setStats(statsRes.data);
      setVolunteers(volRes.data);
      setPendingApps(pendRes.data);
      setProfileUpdates(updatesRes.data);
      setBatches(batchesRes.data);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin dashboard data.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ROLE_ADMIN') {
      localStorage.clear();
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  // Action: Approve Application
  const handleApproveApplication = async (userId) => {
    try {
      const response = await api.post(`/api/admin/approve-volunteer/${userId}`);
      toast.success(response.data.message || 'Volunteer approved!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve volunteer.');
    }
  };

  // Action: Reject Application
  const handleRejectApplication = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    try {
      const response = await api.post(`/api/admin/reject-volunteer/${rejectionModalUser.id}`, { reason: rejectionReason });
      toast.success(response.data.message || 'Volunteer rejected.');
      setRejectionModalUser(null);
      setRejectionReason('');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject volunteer.');
    }
  };

  // Action: Promote to Admin
  const handlePromoteAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this volunteer to Admin?')) return;
    try {
      const response = await api.post(`/api/admin/promote-admin/${userId}`);
      toast.success(response.data.message || 'Promoted to admin!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to promote volunteer.');
    }
  };

  // Action: Remove Volunteer
  const handleRemoveVolunteer = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this volunteer record?')) return;
    try {
      const response = await api.delete(`/api/admin/remove-volunteer/${userId}`);
      toast.success(response.data.message || 'Volunteer deleted.');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove volunteer.');
    }
  };

  // Action: Create Batch
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;
    try {
      const response = await api.post('/api/admin/batches', { batchName: newBatchName });
      toast.success(response.data.message || 'Batch created successfully!');
      setNewBatchName('');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create batch.');
    }
  };

  // Action: Assign Batch
  const handleAssignBatch = async (batchId) => {
    try {
      const response = await api.post('/api/admin/assign-batch', {
        userId: assignBatchUser.id,
        batchId: batchId
      });
      toast.success(response.data.message || 'Batch assigned successfully!');
      setAssignBatchUser(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign batch.');
    }
  };

  // Action: Approve Profile Update
  const handleApproveProfileUpdate = async (requestId) => {
    try {
      const response = await api.post(`/api/admin/approve-profile-update/${requestId}`);
      toast.success(response.data.message || 'Profile updates approved!');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve updates.');
    }
  };

  // Action: Reject Profile Update
  const handleRejectProfileUpdate = async (requestId) => {
    try {
      const response = await api.post(`/api/admin/reject-profile-update/${requestId}`);
      toast.success(response.data.message || 'Profile updates rejected.');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject updates.');
    }
  };

  // Filter volunteer records
  const filteredVolunteers = volunteers.filter(v => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const nameMatch = `${v.firstname} ${v.lastname}`.toLowerCase().includes(query);
    const emailMatch = v.email?.toLowerCase().includes(query);
    const collegeMatch = v.college?.toLowerCase().includes(query);
    const skillsMatch = v.skills?.toLowerCase().includes(query);
    const statusMatch = v.status?.toLowerCase().includes(query);
    const batchMatch = v.batch?.batchName?.toLowerCase().includes(query);

    switch(searchField) {
      case 'name': return nameMatch;
      case 'email': return emailMatch;
      case 'college': return collegeMatch;
      case 'skills': return skillsMatch;
      case 'batch': return batchMatch;
      case 'status': return statusMatch;
      default: return nameMatch || emailMatch || collegeMatch || skillsMatch || batchMatch || statusMatch;
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Operations</h1>
            <p className="text-slate-400 text-sm mt-1">Manage volunteers, batches, applications, and view analytics reports</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 border border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 text-xs rounded-xl font-semibold transition-all duration-200"
          >
            Refresh Data
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-2">
          {[
            { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
            { id: 'applications', label: `Applications (${pendingApps.length})`, icon: UserCheck },
            { id: 'volunteers', label: 'Volunteers List', icon: Users },
            { id: 'updates', label: `Profile Updates (${profileUpdates.length})`, icon: FileCheck },
            { id: 'batches', label: 'Batch Settings', icon: Layers },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-ngo-950 border border-ngo-850 text-ngo-400 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
            <TableSkeleton />
          </div>
        ) : (
          <div>
            {/* 1. ANALYTICS OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: "Total Volunteers", value: stats.totalVolunteers, icon: Users, color: "text-ngo-400", bg: "bg-ngo-950/20" },
                    { label: "Active Volunteers", value: stats.activeVolunteers, icon: Check, color: "text-emerald-400", bg: "bg-emerald-950/20" },
                    { label: "Pending Approvals", value: stats.pendingApplications, icon: ShieldAlert, color: "text-gold-400", bg: "bg-gold-950/20" },
                    { label: "Total Administrators", value: stats.totalAdmins, icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-950/20" },
                  ].map((kpi, idx) => (
                    <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-850 flex items-center justify-between">
                      <div>
                        <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{kpi.label}</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-white">{kpi.value}</span>
                      </div>
                      <div className={`p-3 rounded-xl ${kpi.bg}`}>
                        <kpi.icon className={kpi.color} size={22} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Monthly Registrations */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-850">
                    <h3 className="text-white font-bold text-sm mb-4">Registration Trend (Monthly)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.monthlyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                          <Area type="monotone" dataKey="value" stroke="#16a34a" fillOpacity={1} fill="url(#colorReg)" name="Registered" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Volunteers by City */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-850">
                    <h3 className="text-white font-bold text-sm mb-4">Volunteers by City</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.volunteersByCity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                          <Bar dataKey="value" fill="#ca8a04" radius={[4, 4, 0, 0]} name="Volunteers" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Volunteers by College */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-850">
                    <h3 className="text-white font-bold text-sm mb-4">Volunteers by College</h3>
                    <div className="h-72 flex justify-center items-center">
                      {stats.volunteersByCollege.length === 0 ? (
                        <span className="text-slate-500 italic text-sm">No college data available</span>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.volunteersByCollege}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {stats.volunteersByCollege.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                            <Legend formatter={(value, entry, index) => <span className="text-xs text-slate-350">{value}</span>} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Top Volunteer Skills */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-850">
                    <h3 className="text-white font-bold text-sm mb-4">Top Volunteer Skills</h3>
                    <div className="h-72">
                      {stats.volunteersBySkills.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
                          No skills listed by active volunteers
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart data={stats.volunteersBySkills} innerRadius="30%" outerRadius="100%" barSize={10} startAngle={180} endAngle={0}>
                            <PolarGrid stroke="#1e293b" />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f8fafc' }} />
                            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} background clockWise dataKey="value" />
                            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. PENDING APPLICATIONS */}
            {activeTab === 'applications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl border border-slate-850 overflow-hidden">
                <div className="p-6 border-b border-slate-900">
                  <h3 className="text-white font-bold text-sm">Pending Approval Applications</h3>
                </div>

                {pendingApps.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 italic text-sm">
                    No pending volunteer applications at this moment.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-400 text-xs font-semibold uppercase bg-slate-900/35">
                          <th className="py-4 px-6">Volunteer ID</th>
                          <th className="py-4 px-6">Name</th>
                          <th className="py-4 px-6">Details</th>
                          <th className="py-4 px-6">Education</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {pendingApps.map(app => (
                          <tr key={app.id} className="hover:bg-slate-900/10">
                            <td className="py-4 px-6 font-mono font-medium text-xs text-slate-400">
                              VOL-{String(app.id).padStart(4, '0')}
                            </td>
                            <td className="py-4 px-6">
                              <span className="block font-bold text-white">{app.firstname} {app.lastname}</span>
                              <span className="text-slate-500 text-xs block mt-0.5">{app.email}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-300 text-xs space-y-1">
                              <div><span className="text-slate-500">Gender:</span> {app.gender}</div>
                              <div><span className="text-slate-500">City:</span> {app.city}</div>
                              <div><span className="text-slate-500">Mobile:</span> {app.mobile}</div>
                            </td>
                            <td className="py-4 px-6 text-slate-350 text-xs">
                              <span className="font-bold text-slate-200 block truncate max-w-xs">{app.volunteerProfile?.college}</span>
                              <span className="block mt-0.5">{app.volunteerProfile?.course}</span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleApproveApplication(app.id)}
                                  className="p-2 bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/30 text-emerald-400 rounded-lg transition-colors"
                                  title="Approve Volunteer"
                                >
                                  <Check size={15} />
                                </button>
                                <button
                                  onClick={() => setRejectionModalUser(app)}
                                  className="p-2 bg-red-950/40 border border-red-900/50 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                                  title="Reject Volunteer"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. VOLUNTEERS LIST */}
            {activeTab === 'volunteers' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search volunteers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 focus:ring-1 focus:ring-ngo-600 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-ngo-600"
                    >
                      <option value="all">Search All</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="college">College</option>
                      <option value="skills">Skills</option>
                      <option value="batch">Batch</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>

                {/* Table list */}
                <div className="glass-card rounded-2xl border border-slate-850 overflow-hidden">
                  {filteredVolunteers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 italic text-sm">
                      No volunteers match your search filters.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 text-slate-400 text-xs font-semibold uppercase bg-slate-900/35">
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">College</th>
                            <th className="py-4 px-6">Batch</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60 text-xs">
                          {filteredVolunteers.map(vol => (
                            <tr key={vol.id} className="hover:bg-slate-900/10">
                              <td className="py-4 px-6 font-mono text-slate-450">
                                VOL-{String(vol.id).padStart(4, '0')}
                              </td>
                              <td className="py-4 px-6">
                                <span className="block font-bold text-white text-sm">{vol.firstname} {vol.lastname}</span>
                                <span className="text-slate-500 block mt-0.5">{vol.email} • {vol.mobile}</span>
                              </td>
                              <td className="py-4 px-6 text-slate-300">
                                <span className="block font-medium truncate max-w-xs" title={vol.college}>{vol.college || 'N/A'}</span>
                                {vol.skills && (
                                  <span className="text-slate-500 text-[10px] block mt-0.5 truncate max-w-xs">{vol.skills}</span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-350">
                                  {vol.batch ? vol.batch.batchName : 'Unassigned'}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`font-semibold ${vol.status === 'ACTIVE' ? 'text-emerald-400' : 'text-gold-400'}`}>
                                  {vol.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setAssignBatchUser(vol)}
                                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-colors font-medium text-[11px]"
                                    title="Assign Batch"
                                  >
                                    Assign Batch
                                  </button>
                                  <button
                                    onClick={() => handlePromoteAdmin(vol.id)}
                                    className="p-1.5 bg-indigo-950/40 border border-indigo-900/50 hover:bg-indigo-900/30 text-indigo-400 rounded-lg transition-colors"
                                    title="Promote to Admin"
                                  >
                                    <ArrowUpRight size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveVolunteer(vol.id)}
                                    className="p-1.5 bg-red-950/40 border border-red-900/50 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                                    title="Delete volunteer record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 4. PROFILE UPDATES */}
            {activeTab === 'updates' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {profileUpdates.length === 0 ? (
                  <div className="glass-card p-12 text-center text-slate-500 italic text-sm rounded-2xl border border-slate-850">
                    No pending profile update requests from active volunteers.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {profileUpdates.map(req => {
                      const updatedData = JSON.parse(req.updatedData);
                      const currentProfile = req.currentProfile || {};
                      
                      // Identify changed fields
                      const fields = [
                        { label: 'College', key: 'college' },
                        { label: 'Course', key: 'course' },
                        { label: 'Skills', key: 'skills' },
                        { label: 'Interests', key: 'interests' },
                        { label: 'Availability', key: 'availabilityDays' },
                      ];

                      return (
                        <div key={req.id} className="glass-card p-6 rounded-2xl border border-slate-850 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-900 pb-3">
                            <div>
                              <h4 className="font-bold text-white text-base">
                                {req.user.firstname} {req.user.lastname}
                              </h4>
                              <p className="text-xs text-slate-500">
                                VOL-{String(req.user.id).padStart(4, '0')} • Requested on {new Date(req.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveProfileUpdate(req.id)}
                                className="px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/30 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Check size={14} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectProfileUpdate(req.id)}
                                className="px-3.5 py-1.5 bg-red-950/40 border border-red-900/50 hover:bg-red-900/30 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <X size={14} />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>

                          {/* Diff Table Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                            <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl">
                              <h5 className="font-bold text-slate-400 mb-3 uppercase tracking-wider">Current Details</h5>
                              <div className="space-y-2.5">
                                {fields.map(f => (
                                  <div key={f.key}>
                                    <span className="block text-slate-600 font-semibold">{f.label}:</span>
                                    <span className="text-slate-300 block mt-0.5 truncate">{currentProfile[f.key] || 'N/A'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-ngo-950/10 border border-ngo-950/30 p-4 rounded-xl">
                              <h5 className="font-bold text-ngo-400 mb-3 uppercase tracking-wider">Proposed Changes</h5>
                              <div className="space-y-2.5">
                                {fields.map(f => {
                                  const isChanged = currentProfile[f.key] !== updatedData[f.key];
                                  return (
                                    <div key={f.key}>
                                      <span className="block text-slate-600 font-semibold">{f.label}:</span>
                                      <span className={`block mt-0.5 truncate ${isChanged ? 'text-emerald-400 font-bold' : 'text-slate-350'}`}>
                                        {updatedData[f.key] || 'N/A'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. BATCH MANAGEMENT */}
            {activeTab === 'batches' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Create Batch Form */}
                <div className="glass-card p-6 rounded-2xl border border-slate-850 h-fit space-y-4">
                  <h3 className="text-white font-bold text-sm border-b border-slate-900 pb-2.5">Create New Batch</h3>
                  <form onSubmit={handleCreateBatch} className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-2">Batch Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Spring Batch 2026"
                        value={newBatchName}
                        onChange={(e) => setNewBatchName(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-gradient py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Plus size={15} />
                      <span>Create Batch</span>
                    </button>
                  </form>
                </div>

                {/* List Batches */}
                <div className="glass-card p-6 rounded-2xl border border-slate-850 md:col-span-2 space-y-4">
                  <h3 className="text-white font-bold text-sm border-b border-slate-900 pb-2.5">Existing Batches</h3>
                  
                  {batches.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 italic text-xs">
                      No batches created yet. Set up one above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {batches.map(b => (
                        <div key={b.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white block text-sm">{b.batchName}</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {b.id}</span>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400">
                            Batch Profile
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </div>
        )}

      </div>

      {/* 1. REJECTION REASON MODAL */}
      <AnimatePresence>
        {rejectionModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Reject Registration Application</h3>
              <p className="text-slate-400 text-xs mb-6">
                Provide a reason for rejecting <strong className="text-slate-200">{rejectionModalUser.firstname} {rejectionModalUser.lastname}</strong>. An email notification will be generated and their record deleted.
              </p>

              <form onSubmit={handleRejectApplication} className="space-y-4">
                <div>
                  <label className="block text-slate-350 text-xs font-semibold mb-2">Rejection Reason</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details on missing skills, verification failure, or inappropriate details..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setRejectionModalUser(null); setRejectionReason(''); }}
                    className="flex-1 btn-outline py-2.5 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-700 hover:bg-red-650 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ASSIGN BATCH MODAL */}
      <AnimatePresence>
        {assignBatchUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Assign Batch</h3>
              <p className="text-slate-400 text-xs mb-6">
                Assign a batch for volunteer <strong className="text-slate-200">{assignBatchUser.firstname} {assignBatchUser.lastname}</strong>.
              </p>

              {batches.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 italic text-sm mb-4">No batches available to assign.</p>
                  <button 
                    onClick={() => { setAssignBatchUser(null); setActiveTab('batches'); }} 
                    className="btn-gradient px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Go Create a Batch
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {batches.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleAssignBatch(b.id)}
                      className="w-full p-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between text-left text-sm text-slate-250 transition-all duration-200 font-bold hover:text-white"
                    >
                      <span>{b.batchName}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Assign</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setAssignBatchUser(null)}
                    className="w-full py-2.5 mt-4 btn-outline rounded-xl text-xs font-semibold text-center"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
