import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff,
  AlertCircle, User, Smartphone,
  ArrowRight, CheckCircle, Sparkles,
  Shield, Award, BookOpen, Clock,
  TrendingUp, GraduationCap, Target,
  X, Instagram, Facebook, Youtube,
  Linkedin
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      navigate(from);
    } else {
      setError(result.message || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

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
                  <h1 className="text-4xl font-bold text-white leading-tight">
                    Start Your Journey to
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                      Government Success
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Join thousands of successful candidates who achieved their dream 
                    government jobs through Career Path Institute.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium">Expert Faculty Guidance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium">Comprehensive Study Material</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium">Regular Mock Tests & Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <span className="text-white font-medium">95% Success Rate</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">5000+</div>
                    <div className="text-sm text-gray-300">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">100+</div>
                    <div className="text-sm text-gray-300">Selections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">8+</div>
                    <div className="text-sm text-gray-300">Years</div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-gray-900 font-bold text-lg">
                      RK
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
                        "Career Path Institute helped me crack the Patwari exam in my first attempt. 
                        The structured course and regular tests made all the difference."
                      </p>
                      <div className="mt-4">
                        <h4 className="font-bold text-white">Rohit Kumar</h4>
                        <p className="text-sm text-gray-400">Patwari 2023, Rank 12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center justify-center space-x-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Youtube size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
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
            <div className="text-center mb-10">
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 rounded-full text-sm font-semibold mb-4">
                <Sparkles size={14} />
                <span>Welcome Back!</span>
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Sign in to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
                  Continue Learning
                </span>
              </h1>
              <p className="text-gray-600">
                Sign in to access your courses, progress, and exclusive content
              </p>
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

              {/* Email Field */}
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

              {/* Password Field */}
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
                    placeholder="Enter your password"
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
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border rounded-md flex items-center justify-center ${rememberMe ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'}`}>
                      {rememberMe && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  className="flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Google</span>
                </button>
                
                <button 
                  type="button" 
                  className="flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-medium text-gray-700">Facebook</span>
                </button>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-yellow-600 hover:text-yellow-700 font-semibold inline-flex items-center space-x-1 group"
                  >
                    <span>Create account</span>
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
                      Your login is secured with SSL encryption. We never share your data.
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* Mobile CTA */}
            <div className="lg:hidden mt-8 text-center">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Contact our support team for assistance
                </p>
                <Link 
                  to="/contact" 
                  className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;