import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff,
  Phone, MapPin, AlertCircle, CheckCircle,
  ArrowRight, Sparkles, Shield, Award,
  BookOpen, Users, TrendingUp, GraduationCap,
  Target, Calendar, Clock, ArrowLeft,
  Map, Smartphone, MessageCircle
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    address: '',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    pincode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    setError('');
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  };

  const validateStep1 = () => {
    const errors = [];
    
    if (!formData.full_name.trim()) errors.push('Full name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.password) errors.push('Password is required');
    if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    if (formData.password !== formData.confirm_password) errors.push('Passwords do not match');
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep1();
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }
    setStep(2);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  const strengthText = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const strengthColors = ['from-red-500 to-red-600', 'from-orange-500 to-orange-600', 
                          'from-yellow-500 to-yellow-600', 'from-lime-500 to-lime-600', 
                          'from-green-500 to-green-600', 'from-emerald-600 to-emerald-700'];

  const benefits = [
    {
      icon: <GraduationCap size={24} />,
      title: 'Expert Faculty',
      description: 'Learn from experienced educators with proven track records',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Comprehensive Curriculum',
      description: 'Structured courses covering all exam topics and patterns',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Target size={24} />,
      title: 'Regular Assessments',
      description: 'Mock tests and quizzes to track your progress',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Doubt Support',
      description: '24/7 doubt resolution through live sessions',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Performance Analytics',
      description: 'Detailed progress tracking and improvement suggestions',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Users size={24} />,
      title: 'Peer Community',
      description: 'Connect with thousands of fellow aspirants',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500"></div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Banner */}
          <div className="hidden lg:block">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {/* Logo */}
              <div className="relative mb-12">
                <Link to="/" className="inline-flex items-center space-x-4 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <img 
                      src="/logo.png" 
                      alt="Career Path Institute" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-white">Career Path Institute</h2>
                    <span className="text-yellow-400 text-sm font-medium tracking-wide">Shimla</span>
                  </div>
                </Link>
              </div>

              {/* Banner Content */}
              <div className="relative space-y-8">
                <div className="space-y-4">
                  <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-semibold">
                    <Sparkles size={16} />
                    <span>Start Your Success Journey</span>
                  </span>
                  
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    Join
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                      5000+ Successful Students
                    </span>
                  </h1>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Create your account and unlock access to expert-led courses, 
                    comprehensive study materials, and proven success strategies.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center mb-3`}>
                        {benefit.icon}
                      </div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-gray-300 text-sm">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-2xl p-6 border border-yellow-500/20">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">5000+</div>
                      <div className="text-sm text-gray-300">Successful Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">100+</div>
                      <div className="text-sm text-gray-300">Selections in 2023</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">95%</div>
                      <div className="text-sm text-gray-300">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-gray-900 font-bold text-lg">
                      PS
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-300 italic">
                        "The structured course material and regular mock tests helped me 
                        secure my dream government job. Best decision of my career!"
                      </p>
                      <div className="mt-4">
                        <h4 className="font-bold text-white">Priya Sharma</h4>
                        <p className="text-sm text-gray-400">SSC CGL 2023, Selected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="absolute bottom-8 right-8">
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                  <Shield size={16} className="text-green-400" />
                  <span className="text-sm text-green-300">SSL Secured Registration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <Link to="/" className="inline-flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Career Path Institute" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Career Path Institute</h2>
                  <span className="text-yellow-600 text-sm">Shimla</span>
                </div>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                <Sparkles size={14} />
                <span>Create Your Account</span>
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Join
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
                  Career Path Institute
                </span>
              </h1>
              
              <p className="text-gray-600 mb-6">
                Create your account to access premium courses and start your journey to success
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex flex-col items-center space-y-2 ${step >= 1 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300 bg-gray-100'}`}>
                      <span className={`text-lg font-bold ${step >= 1 ? 'text-yellow-600' : 'text-gray-500'}`}>1</span>
                    </div>
                    <span className="text-sm font-medium">Basic Info</span>
                  </div>
                  
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  
                  <div className={`flex flex-col items-center space-y-2 ${step >= 2 ? 'text-yellow-600' : 'text-gray-400'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300 bg-gray-100'}`}>
                      <span className={`text-lg font-bold ${step >= 2 ? 'text-yellow-600' : 'text-gray-500'}`}>2</span>
                    </div>
                    <span className="text-sm font-medium">Personal Details</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <div className="text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 ? (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-500" />
                        <span>Full Name</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-gray-500" />
                        <span>Email Address</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Lock size={16} className="text-gray-500" />
                        <span>Password</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Password strength</span>
                          <span className={`text-sm font-medium ${passwordStrength > 3 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {strengthText[passwordStrength]}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${strengthColors[passwordStrength]} transition-all duration-300`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Password Requirements */}
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Password must contain:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { text: 'At least 8 characters', valid: formData.password.length >= 8 },
                          { text: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                          { text: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                          { text: 'One number', valid: /[0-9]/.test(formData.password) },
                          { text: 'One special character', valid: /[^A-Za-z0-9]/.test(formData.password) },
                        ].map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.valid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              <CheckCircle size={12} />
                            </div>
                            <span className={`text-sm ${req.valid ? 'text-green-600' : 'text-gray-500'}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Lock size={16} className="text-gray-500" />
                        <span>Confirm Password</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`w-full px-4 py-3 pl-12 pr-12 border ${formData.confirm_password && formData.password !== formData.confirm_password ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300`}
                        disabled={loading}
                        required
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    {formData.confirm_password && formData.password !== formData.confirm_password && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle size={14} />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          required
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border border-gray-300 rounded-md flex items-center justify-center">
                          <CheckCircle size={14} className="text-white hidden" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-yellow-600 hover:text-yellow-700 font-medium">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-yellow-600 hover:text-yellow-700 font-medium">
                          Privacy Policy
                        </Link>
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          name="newsletter"
                          className="sr-only"
                        />
                        <div className="w-5 h-5 border border-gray-300 rounded-md flex items-center justify-center">
                          <CheckCircle size={14} className="text-white hidden" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Send me study tips, course updates, and exam notifications
                      </div>
                    </label>
                  </div>

                  {/* Next Button */}
                  <button 
                    type="button" 
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Personal Details</span>
                    <ArrowRight size={20} />
                  </button>
                </>
              ) : (
                <>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-gray-500" />
                        <span>Phone Number</span>
                        <span className="text-gray-500 text-sm">(Optional)</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Phone size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span>Address</span>
                        <span className="text-gray-500 text-sm">(Optional)</span>
                      </div>
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your complete address"
                        rows="3"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                        disabled={loading}
                      />
                      <div className="absolute left-4 top-4">
                        <MapPin size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      disabled={loading}
                    />
                  </div>

                  {/* Step Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50"
                    >
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </button>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-yellow-600 hover:text-yellow-700 font-semibold inline-flex items-center space-x-1 group"
                  >
                    <span>Sign in instead</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>

              {/* Security Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mt-8">
                <div className="flex items-center space-x-3">
                  <Shield size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-700">
                      Your information is secure with 256-bit SSL encryption. We never share your data.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Mobile CTA */}
            <div className="lg:hidden mt-8 text-center">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Our admission counselors are here to help you
                </p>
                <Link 
                  to="/contact" 
                  className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;