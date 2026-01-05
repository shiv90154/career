import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff,
  AlertCircle, User, Smartphone
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from);
    } else {
      setError(result.message || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          {/* Left Side - Form */}
          <div className="auth-form-container">
            <div className="auth-header">
              <Link to="/" className="logo">
                <img src="/logo.png" alt="Career Path Institute" />
                <div className="logo-text">
                  <h2>Career Path Institute</h2>
                  <span>Shimla</span>
                </div>
              </Link>
              
              <div className="header-content">
                <h1>Welcome Back</h1>
                <p>Sign in to continue your learning journey</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  Password
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="social-auth">
                <button type="button" className="social-btn google">
                  <img src="/google-icon.svg" alt="Google" />
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn facebook">
                  <img src="/facebook-icon.svg" alt="Facebook" />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="link">
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Side - Banner */}
          <div className="auth-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h2>Start Your Journey to Success</h2>
                <p>
                  Join thousands of successful candidates who achieved their dream 
                  government jobs through Career Path Institute.
                </p>
                
                <div className="features-list">
                  <div className="feature">
                    <User size={20} />
                    <span>Expert Faculty Guidance</span>
                  </div>
                  <div className="feature">
                    <Smartphone size={20} />
                    <span>Learn Anytime, Anywhere</span>
                  </div>
                  <div className="feature">
                    <AlertCircle size={20} />
                    <span>Regular Mock Tests</span>
                  </div>
                </div>
              </div>

              <div className="testimonial">
                <div className="quote">
                  "Career Path Institute helped me crack the Patwari exam in my first attempt. 
                  The structured course and regular tests made all the difference."
                </div>
                <div className="author">
                  <div className="author-avatar">RK</div>
                  <div className="author-info">
                    <h4>Rohit Kumar</h4>
                    <p>Patwari 2023, Rank 12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;