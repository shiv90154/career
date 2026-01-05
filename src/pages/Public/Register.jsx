import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff,
  Phone, MapPin, AlertCircle, CheckCircle
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
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
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

  const passwordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const strengthText = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const strengthColors = ['#EF4444', '#F97316', '#EAB308', '#84CC16', '#10B981', '#059669'];

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
                <h1>Create Account</h1>
                <p>Join thousands of successful candidates</p>
                
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Basic Info</span>
                  </div>
                  <div className="step-line"></div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Personal Details</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {step === 1 ? (
                <>
                  <div className="form-group">
                    <label htmlFor="full_name">
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      disabled={loading}
                    />
                  </div>

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
                        placeholder="Create a password"
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
                    
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="strength-segment"
                              style={{
                                backgroundColor: passwordStrength(formData.password) > i 
                                  ? strengthColors[passwordStrength(formData.password) - 1] 
                                  : '#E2E8F0'
                              }}
                            ></div>
                          ))}
                        </div>
                        <span className="strength-text">
                          {strengthText[passwordStrength(formData.password)]}
                        </span>
                      </div>
                    )}

                    <div className="password-requirements">
                      <p>Password must contain:</p>
                      <ul>
                        <li className={formData.password.length >= 8 ? 'valid' : ''}>
                          <CheckCircle size={12} />
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                          <CheckCircle size={12} />
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                          <CheckCircle size={12} />
                          One lowercase letter
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                          <CheckCircle size={12} />
                          One number
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm_password">
                      <Lock size={16} />
                      Confirm Password
                    </label>
                    <div className="password-input">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    {formData.confirm_password && formData.password !== formData.confirm_password && (
                      <div className="error-text">
                        <AlertCircle size={12} />
                        Passwords do not match
                      </div>
                    )}
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        name="terms" 
                        required 
                      />
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" className="link">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="link">Privacy Policy</Link>
                      </span>
                    </label>
                    
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        name="newsletter" 
                      />
                      <span>
                        Send me study tips and course updates
                      </span>
                    </label>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary auth-btn"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="phone">
                      <Phone size={16} />
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      <MapPin size={16} />
                      Address (Optional)
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      disabled={loading}
                    />
                  </div>

                  <div className="step-buttons">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Back
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </>
              )}

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="link">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Side - Banner */}
          <div className="auth-banner">
            <div className="banner-content">
              <div className="banner-text">
                <h2>Why Join Career Path Institute?</h2>
                
                <div className="benefits-list">
                  <div className="benefit">
                    <div className="benefit-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="benefit-content">
                      <h4>Expert Faculty</h4>
                      <p>Learn from experienced educators with proven track records</p>
                    </div>
                  </div>
                  
                  <div className="benefit">
                    <div className="benefit-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="benefit-content">
                      <h4>Comprehensive Curriculum</h4>
                      <p>Structured courses covering all exam topics and patterns</p>
                    </div>
                  </div>
                  
                  <div className="benefit">
                    <div className="benefit-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="benefit-content">
                      <h4>Regular Assessments</h4>
                      <p>Mock tests and quizzes to track your progress</p>
                    </div>
                  </div>
                  
                  <div className="benefit">
                    <div className="benefit-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="benefit-content">
                      <h4>Doubt Support</h4>
                      <p>24/7 doubt resolution through live sessions and forums</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-banner">
                <h3>Our Success Stories</h3>
                <div className="stats-grid">
                  <div className="stat">
                    <h4>5000+</h4>
                    <p>Successful Students</p>
                  </div>
                  <div className="stat">
                    <h4>100+</h4>
                    <p>Selection in 2023</p>
                  </div>
                  <div className="stat">
                    <h4>95%</h4>
                    <p>Course Satisfaction</p>
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

export default Register;