import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  BookOpen, Sparkles, Clock, ShieldCheck, Edit3, Save, AlertCircle 
} from 'lucide-react';
import api from '../api/axiosConfig';
import { ProfileSkeleton } from '../components/Skeleton';

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form Edit State
  const [editForm, setEditForm] = useState({
    college: '',
    course: '',
    skills: '',
    interests: '',
    availabilityDays: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/volunteer/profile');
      setProfile(response.data);
      setEditForm({
        college: response.data.college || '',
        course: response.data.course || '',
        skills: response.data.skills || '',
        interests: response.data.interests || '',
        availabilityDays: response.data.availabilityDays || '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile.');
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ROLE_VOLUNTEER') {
      localStorage.clear();
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/volunteer/profile-update', editForm);
      toast.success(response.data.message || 'Profile update requested!');
      // Update local storage status
      localStorage.setItem('status', 'PROFILE_UPDATE_PENDING');
      fetchProfile();
      setActiveTab('overview');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Profile update request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-28 px-4 max-w-4xl mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }

  const isPendingUpdate = profile?.status === 'PROFILE_UPDATE_PENDING';

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Pending Approval Banner */}
        {isPendingUpdate && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-gold-950/40 border border-gold-900/50 rounded-2xl text-gold-300"
          >
            <AlertCircle className="flex-shrink-0 mt-0.5 text-gold-400" size={18} />
            <div>
              <h4 className="font-bold text-sm">Profile Update Pending Admin Review</h4>
              <p className="text-xs text-gold-400/90 mt-1">
                You have submitted a request to edit your academic or skill details. You cannot submit another edit request until the admin approves or rejects the current one.
              </p>
            </div>
          </motion.div>
        )}

        {/* Dashboard Header / Profile Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ngo-600 to-emerald-500 flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-ngo-600/20">
              {profile?.firstname[0]}{profile?.lastname[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{profile?.firstname} {profile?.lastname}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium font-mono uppercase">
                  VOL-{String(profile?.userId).padStart(4, '0')}
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">{profile?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
              <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</span>
              <span className={`text-xs font-bold ${
                profile?.status === 'ACTIVE' 
                  ? 'text-emerald-400' 
                  : 'text-gold-400'
              }`}>
                {profile?.status}
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
              <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider">Batch</span>
              <span className="text-xs font-bold text-slate-350">{profile?.batch}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-900 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-ngo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'edit' 
                ? 'border-ngo-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'overview' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Personal Details */}
              <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-4">
                <h3 className="text-white font-bold text-sm border-b border-slate-900 pb-2 flex items-center gap-2">
                  <User size={16} className="text-ngo-400" />
                  <span>Personal Details</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Gender</span>
                    <span className="text-slate-200 font-semibold">{profile?.gender}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Date of Birth</span>
                    <span className="text-slate-200 font-semibold">{profile?.dob}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Mobile Number</span>
                    <span className="text-slate-200 font-semibold">{profile?.mobile}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">City</span>
                    <span className="text-slate-200 font-semibold">{profile?.city}</span>
                  </div>
                </div>
              </div>

              {/* Education & Engagement */}
              <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-4">
                <h3 className="text-white font-bold text-sm border-b border-slate-900 pb-2 flex items-center gap-2">
                  <BookOpen size={16} className="text-ngo-400" />
                  <span>Education & Academics</span>
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">College</span>
                    <span className="text-slate-200 font-semibold block truncate" title={profile?.college}>
                      {profile?.college}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Course</span>
                    <span className="text-slate-200 font-semibold">{profile?.course}</span>
                  </div>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-4 md:col-span-2">
                <h3 className="text-white font-bold text-sm border-b border-slate-900 pb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-gold-400" />
                  <span>Skills, Interests & Availability</span>
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills ? profile.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-350 text-xs rounded-lg font-medium">
                          {skill.trim()}
                        </span>
                      )) : <span className="text-slate-500 italic">No skills listed</span>}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Interests</span>
                    <div className="flex flex-wrap gap-2">
                      {profile?.interests ? profile.interests.split(',').map((interest, index) => (
                        <span key={index} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-350 text-xs rounded-lg font-medium">
                          {interest.trim()}
                        </span>
                      )) : <span className="text-slate-500 italic">No interests listed</span>}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 text-xs font-medium uppercase tracking-wider">Availability</span>
                    <div className="flex items-center gap-2 text-slate-300 font-semibold mt-1">
                      <Clock size={14} className="text-ngo-400" />
                      <span>{profile?.availabilityDays || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-850"
            >
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-2">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Edit3 size={18} className="text-ngo-400" />
                    <span>Edit Profile details</span>
                  </h3>
                  <span className="text-slate-500 text-xs italic">* Requires Admin Approval</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">College</label>
                    <input
                      type="text"
                      required
                      disabled={isPendingUpdate}
                      value={editForm.college}
                      onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Course</label>
                    <input
                      type="text"
                      required
                      disabled={isPendingUpdate}
                      value={editForm.course}
                      onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-350 text-xs font-semibold mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    disabled={isPendingUpdate}
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 text-xs font-semibold mb-2">Interests (comma-separated)</label>
                  <input
                    type="text"
                    disabled={isPendingUpdate}
                    value={editForm.interests}
                    onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                    className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-350 text-xs font-semibold mb-2">Availability (Days / Hours)</label>
                  <input
                    type="text"
                    disabled={isPendingUpdate}
                    value={editForm.availabilityDays}
                    onChange={(e) => setEditForm({ ...editForm, availabilityDays: e.target.value })}
                    className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm disabled:opacity-50"
                  />
                </div>

                <div className="pt-4 border-t border-slate-900 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || isPendingUpdate}
                    className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Submitting request...' : 'Request Update'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
