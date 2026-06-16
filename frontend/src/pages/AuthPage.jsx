import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import api from '../api/axiosConfig';
import Captcha from '../components/Captcha';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');



  // Login State
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register State
  const [registerForm, setRegisterForm] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    dob: '',
    city: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    skills: '',
    interests: '',
    availabilityDays: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: input mobile, 2: input OTP, 3: input new password
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [devOtpNotice, setDevOtpNotice] = useState('');

  useEffect(() => {
    setActiveTab(tabParam);
    setCaptchaInput('');
  }, [tabParam]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast.error('Please enter all credentials.');
      return;
    }

    if (captchaInput !== captchaCode) {
      toast.error('Captcha code does not match.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await api.post('/api/auth/login', loginForm);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('firstname', data.firstname);
      localStorage.setItem('lastname', data.lastname);
      localStorage.setItem('role', data.role);
      localStorage.setItem('status', data.status);
      localStorage.setItem('email', data.email);

      toast.success(`Welcome back, ${data.firstname}!`);

      if (data.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/volunteer-dashboard');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg, { duration: 5000 });
      // Reset captcha
      setCaptchaInput('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const passwordChecks = {
    length: registerForm.password.length >= 8,
    uppercase: /[A-Z]/.test(registerForm.password),
    lowercase: /[a-z]/.test(registerForm.password),
    number: /[0-9]/.test(registerForm.password),
    special: /[^A-Za-z0-9]/.test(registerForm.password),
  };

  const passwordsMatch =
    registerForm.confirmPassword.length > 0 &&
    registerForm.password === registerForm.confirmPassword;

  const calculatePasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setPasswordStrength(score);
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Average";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!registerForm.firstname || !registerForm.lastname || !registerForm.gender ||
      !registerForm.dob || !registerForm.city || !registerForm.mobile ||
      !registerForm.email || !registerForm.password || !registerForm.college) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (captchaInput !== captchaCode) {
      toast.error('Captcha code does not match.');
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(registerForm.password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters."
      );
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsRegistering(true);
    try {
      await api.post('/api/auth/register', registerForm);
      toast.success('Registration successful! Please wait for admin approval.', { duration: 6000 });
      setActiveTab('login');
      setLoginForm({ username: registerForm.email, password: '' });
      setCaptchaInput('');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Registration failed.';
      toast.error(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  // Forgot password flow handlers
  const handleForgotMobileSubmit = async (e) => {
    e.preventDefault();
    if (!forgotMobile) {
      toast.error('Please enter your mobile number.');
      return;
    }
    setIsForgotLoading(true);
    try {
      const response = await api.post('/api/auth/forgot-password/otp', { mobile: forgotMobile });
      toast.success(response.data.message);
      // For development, we return the OTP in the JSON response, let's display it
      if (response.data.otp) {
        setDevOtpNotice(`[Dev Mode] Generated OTP is: ${response.data.otp}`);
      }
      setForgotStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification request failed.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotOtpSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp) {
      toast.error('Please enter the OTP code.');
      return;
    }
    setIsForgotLoading(true);
    try {
      await api.post('/api/auth/forgot-password/verify', { mobile: forgotMobile, otp: forgotOtp });
      toast.success('OTP Verified successfully!');
      setDevOtpNotice('');
      setForgotStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP code.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword || !forgotConfirmPassword) {
      toast.error('Please fill out all password fields.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsForgotLoading(true);
    try {
      await api.post('/api/auth/forgot-password/reset', { mobile: forgotMobile, newPassword: forgotNewPassword });
      toast.success('Password updated successfully! You can now log in.');
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotMobile('');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setLoginForm({ username: forgotMobile, password: '' });
      setActiveTab('login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password reset failed.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center py-20 px-4 sm:px-6">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-ngo-950/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold-950/15 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-2xl">
        {/* Brand Link */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-white">
              NayePankh <span className="text-ngo-500">Connect</span>
            </span>
          </div>
        </div>

        {/* Auth Tab Controllers */}
        <div className="flex border-b border-slate-800 mb-8 max-w-xs mx-auto justify-center bg-slate-900/60 p-1.5 rounded-2xl">
          <button
            onClick={() => { setActiveTab('login'); setCaptchaInput(''); }}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'login'
              ? 'bg-gradient-to-r from-ngo-700 to-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setCaptchaInput(''); }}
            className={`flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === 'register'
              ? 'bg-gradient-to-r from-ngo-700 to-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Register
          </button>
        </div>

        {/* Card Body */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h2>
                <p className="text-slate-400 text-sm text-center mb-8">Sign in to volunteer or access reports</p>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold uppercase tracking-wider mb-2">Email or Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter email or mobile number"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 focus:ring-1 focus:ring-ngo-600 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-slate-350 text-xs font-semibold uppercase tracking-wider">Password</label>
                      <button
                        type="button"
                        onClick={() => { setShowForgotModal(true); setForgotStep(1); }}
                        className="text-xs text-ngo-400 hover:text-ngo-300 font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="block w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 focus:ring-1 focus:ring-ngo-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* Captcha */}
                  <div className="pt-2 border-t border-slate-900 space-y-3">
                    <label className="block text-slate-350 text-xs font-semibold uppercase tracking-wider">Captcha Verification</label>
                    <Captcha onChange={setCaptchaCode} />
                    <input
                      type="text"
                      required
                      placeholder="Enter the captcha code above"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 focus:ring-1 focus:ring-ngo-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full btn-gradient py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Verifying credentials...' : 'Sign In'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Become a Volunteer</h2>
                <p className="text-slate-400 text-sm text-center mb-8">Register to start your leadership journey</p>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <h3 className="text-ngo-400 text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-2">1. Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={registerForm.firstname}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstname: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={registerForm.lastname}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastname: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">Gender *</label>
                      <select
                        required
                        value={registerForm.gender}
                        onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-ngo-600 text-sm"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">Date of Birth *</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={registerForm.dob}
                          onChange={(e) => setRegisterForm({ ...registerForm, dob: e.target.value })}
                          className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-ngo-600 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Delhi"
                        value={registerForm.city}
                        onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="9999999999"
                        value={registerForm.mobile}
                        onChange={(e) => setRegisterForm({ ...registerForm, mobile: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">
                        Password *
                      </label>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Create Password"
                          value={registerForm.password}
                          onChange={(e) => {
                            setRegisterForm({
                              ...registerForm,
                              password: e.target.value
                            });
                            calculatePasswordStrength(e.target.value);
                          }}
                          className="block w-full px-4 py-2.5 pr-12 bg-slate-900 border border-slate-800 rounded-xl text-white"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Strength Meter */}

                      <div className="mt-3">
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`
                            }}
                          />
                        </div>

                        <p className="text-xs mt-1">
                          Strength :
                          <span
                            className={`ml-2 font-bold ${passwordStrength <= 2
                              ? "text-red-400"
                              : passwordStrength <= 4
                                ? "text-yellow-400"
                                : "text-green-400"
                              }`}
                          >
                            {getStrengthLabel()}
                          </span>
                        </p>
                      </div>

                      {/* Requirements */}

                      <div className="mt-4 space-y-2 text-xs">

                        <div className={`flex items-center gap-2 ${passwordChecks.length ? "text-green-400" : "text-slate-400"}`}>
                          {passwordChecks.length ? <Check size={14} /> : <X size={14} />}
                          Minimum 8 characters
                        </div>

                        <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? "text-green-400" : "text-slate-400"}`}>
                          {passwordChecks.uppercase ? <Check size={14} /> : <X size={14} />}
                          One uppercase letter
                        </div>

                        <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? "text-green-400" : "text-slate-400"}`}>
                          {passwordChecks.lowercase ? <Check size={14} /> : <X size={14} />}
                          One lowercase letter
                        </div>

                        <div className={`flex items-center gap-2 ${passwordChecks.number ? "text-green-400" : "text-slate-400"}`}>
                          {passwordChecks.number ? <Check size={14} /> : <X size={14} />}
                          One number
                        </div>

                        <div className={`flex items-center gap-2 ${passwordChecks.special ? "text-green-400" : "text-slate-400"}`}>
                          {passwordChecks.special ? <Check size={14} /> : <X size={14} />}
                          One special character
                        </div>

                      </div>

                    </div>
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">
                        Confirm Password *
                      </label>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Confirm Password"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              confirmPassword: e.target.value
                            })
                          }
                          className="block w-full px-4 py-2.5 pr-12 bg-slate-900 border border-slate-800 rounded-xl text-white"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-slate-400"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {registerForm.confirmPassword.length > 0 && (
                        <div
                          className={`flex items-center gap-2 mt-2 text-xs ${passwordsMatch
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                        >
                          {passwordsMatch ? (
                            <Check size={14} />
                          ) : (
                            <X size={14} />
                          )}

                          {passwordsMatch
                            ? "Passwords Match"
                            : "Passwords Do Not Match"}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-ngo-400 text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-2 pt-4">2. Education & Profile details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">College *</label>
                      <input
                        type="text"
                        required
                        placeholder="University Name"
                        value={registerForm.college}
                        onChange={(e) => setRegisterForm({ ...registerForm, college: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-350 text-xs font-semibold mb-2">Course and Branch*</label>
                      <input
                        type="text"
                        placeholder="B.Tech - CSE / B.Sc - PCM"
                        value={registerForm.course}
                        onChange={(e) => setRegisterForm({ ...registerForm, course: e.target.value })}
                        className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Java, Spring Boot, React, Teaching"
                      value={registerForm.skills}
                      onChange={(e) => setRegisterForm({ ...registerForm, skills: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Interests (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Teaching, Awareness Campaigns, Social Work"
                      value={registerForm.interests}
                      onChange={(e) => setRegisterForm({ ...registerForm, interests: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Availability (in Days)</label>
                    <input
                      type="text"
                      placeholder="Weekends, Mon-Wed-Fri, 2 hours daily"
                      value={registerForm.availabilityDays}
                      onChange={(e) => setRegisterForm({ ...registerForm, availabilityDays: e.target.value })}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>

                  {/* Captcha */}
                  <div className="pt-2 border-t border-slate-900 space-y-3">
                    <label className="block text-slate-350 text-xs font-semibold uppercase tracking-wider">Captcha Verification</label>
                    <Captcha onChange={setCaptchaCode} />
                    <input
                      type="text"
                      required
                      placeholder="Enter the captcha code above"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full btn-gradient py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                  >
                    {isRegistering ? 'Submitting registration...' : 'Submit Application'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <KeyRound className="text-gold-400" size={22} />
                <span>Forgot Password</span>
              </h3>
              <p className="text-slate-400 text-xs mb-6">Reset your credentials using mobile verification</p>

              {devOtpNotice && (
                <div className="p-3 bg-ngo-950/40 border border-ngo-800 text-ngo-350 text-xs rounded-xl mb-4 font-mono">
                  {devOtpNotice}
                </div>
              )}

              {forgotStep === 1 && (
                <form onSubmit={handleForgotMobileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Registered Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="9999999999"
                        value={forgotMobile}
                        onChange={(e) => setForgotMobile(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => { setShowForgotModal(false); setDevOtpNotice(''); }}
                      className="flex-1 btn-outline py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="flex-1 btn-gradient py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                    >
                      {isForgotLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleForgotOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Enter 6-Digit OTP</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="000000"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="block w-full pl-11 pr-4 py-2.5 bg-slate-955 border border-slate-800 rounded-xl text-white text-center font-bold tracking-widest placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 btn-outline py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="flex-1 btn-gradient py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                    >
                      {isForgotLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleForgotResetSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Create New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-350 text-xs font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-ngo-600 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold mt-6 disabled:opacity-50"
                  >
                    {isForgotLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
