import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import  api  from '../../services/api';
import {
  Mail, Phone, MapPin, Clock,
  Send, CheckCircle, AlertCircle,
  Facebook, Twitter, Instagram, Youtube,
  MessageSquare, User, ChevronRight,
  ExternalLink, Heart, Shield, Star,
  ThumbsUp, Navigation, Calendar,
  CheckCircle2, Globe, PhoneCall,
  Building, Users, HelpCircle, X
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkingHours, setIsWorkingHours] = useState(true);
  const [charCount, setCharCount] = useState(0);

  // SVG Pattern Component
  const PatternBackground = ({ opacity = 0.05 }) => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F7E600' fill-opacity='${opacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }}
    />
  );

  // Update current time and check working hours
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if current time is within working hours (9 AM - 7 PM, Mon-Sat)
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = now.getHours();
      setIsWorkingHours(day >= 1 && day <= 6 && hour >= 9 && hour < 19);
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.subject) errors.subject = 'Please select a subject';
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message must be at least 20 characters';
    } else if (formData.message.trim().length > 500) {
      errors.message = 'Message must be less than 500 characters';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update character count for message field
    if (name === 'message') {
      setCharCount(value.length);
    }
    
    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/public/contact', {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'website_contact_page'
      });
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      });
      setCharCount(0);
      
      // Auto-reset success message after 5 seconds
      const successTimer = setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      const errorTimer = setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const clearField = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
    if (fieldName === 'message') setCharCount(0);
  };

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Browse our courses, select the one you want, and click "Enroll Now". For paid courses, you\'ll be directed to the payment gateway. We accept all major payment methods including UPI, credit/debit cards, and net banking.'
    },
    {
      question: 'What is the refund policy?',
      answer: 'We offer a 7-day refund policy for all courses. If you\'re not satisfied, contact us within 7 days of enrollment for a full refund. Certain conditions may apply for downloaded materials.'
    },
    {
      question: 'Do you provide study materials?',
      answer: 'Yes, all courses include comprehensive study materials, practice questions, mock tests, and recorded lectures accessible 24/7 through our learning portal.'
    },
    {
      question: 'Is there mobile app access?',
      answer: 'Yes, you can access all courses through our mobile-responsive website. We also offer Android and iOS apps for better learning experience on the go.'
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Twitter, label: 'Twitter', url: '#', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: Instagram, label: 'Instagram', url: '#', color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' },
    { icon: Youtube, label: 'YouTube', url: '#', color: 'bg-red-600 hover:bg-red-700' }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCharCountColor = () => {
    if (charCount > 400) return 'text-red-600';
    if (charCount > 300) return 'text-yellow-600';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0B1C2D] to-[#1a365d] text-white overflow-hidden">
        <PatternBackground opacity="0.05" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-6">
              <Link to="/" className="hover:text-yellow-300 transition-colors flex items-center">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Contact Us</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-[#F7E600]">Touch</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have questions about our courses or need guidance? 
              Our dedicated team is here to help you succeed on your career path.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-[#F7E600]" />
                </div>
                <div>
                  <div className="text-sm opacity-80">Current Time</div>
                  <div className="font-semibold">{formatTime(currentTime)} IST</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isWorkingHours ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-[#F7E600]" />
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-80">Support Status</div>
                  <div className="font-semibold">{isWorkingHours ? 'Online Now' : 'Offline'}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#F7E600]" />
                </div>
                <div>
                  <div className="text-sm opacity-80">Response Time</div>
                  <div className="font-semibold">Under 2 Hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 lg:mb-16 -mt-8">
          {/* Phone Support Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-3">Call us for immediate assistance</p>
                <a href="tel:+911234567890" className="text-blue-600 hover:text-blue-800 font-semibold text-lg block mb-2 transition-colors">
                  +91 1234567890
                </a>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 9 AM - 7 PM</span>
                </div>
                <button className="mt-4 text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-800 transition-colors group">
                  <span>Call Now</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-3">Send us an email anytime</p>
                <a href="mailto:info@thecareerspathway.com" className="text-blue-600 hover:text-blue-800 font-semibold text-lg block mb-2 transition-colors break-all">
                  info@thecareerspathway.com
                </a>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Response within 2 hours</span>
                </div>
                <button className="mt-4 text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-800 transition-colors group">
                  <span>Compose Email</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Visit Center Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Center</h3>
                <p className="text-gray-600 mb-3">Meet us in person</p>
                <div className="text-blue-600 hover:text-blue-800 font-semibold text-lg block mb-2 transition-colors">
                  Shimla, Himachal Pradesh
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 10 AM - 6 PM</span>
                </div>
                <button className="mt-4 text-blue-600 font-medium flex items-center space-x-1 hover:text-blue-800 transition-colors group">
                  <span>Get Directions</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {success && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800">Message Sent Successfully!</h4>
                      <p className="text-green-700 text-sm">We'll get back to you within 24 hours. Check your email for confirmation.</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 animate-shake">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800">Error Sending Message</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                      {formErrors.name && <span className="text-red-600 text-sm ml-2">{formErrors.name}</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                      {formData.name && (
                        <button
                          type="button"
                          onClick={() => clearField('name')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                      {formErrors.email && <span className="text-red-600 text-sm ml-2">{formErrors.email}</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                      {formData.email && (
                        <button
                          type="button"
                          onClick={() => clearField('email')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                      {formErrors.phone && <span className="text-red-600 text-sm ml-2">{formErrors.phone}</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneCall className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50 transition-colors`}
                        placeholder="+91 9876543210"
                        disabled={loading}
                      />
                      {formData.phone && (
                        <button
                          type="button"
                          onClick={() => clearField('phone')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                      {formErrors.subject && <span className="text-red-600 text-sm ml-2">{formErrors.subject}</span>}
                    </label>
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.subject ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50 transition-colors appearance-none`}
                        disabled={loading}
                      >
                        <option value="">Select a subject</option>
                        <option value="course-info">Course Information</option>
                        <option value="admission">Admission Query</option>
                        <option value="technical">Technical Support</option>
                        <option value="payment">Payment Issue</option>
                        <option value="demo">Free Demo Request</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Email', 'Phone', 'WhatsApp'].map((method) => (
                      <label key={method} className="relative flex cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method.toLowerCase()}
                          checked={formData.preferredContact === method.toLowerCase()}
                          onChange={handleChange}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="w-full text-center px-4 py-3 rounded-lg border-2 transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 border-gray-300 hover:border-gray-400">
                          {method}
                        </div>
                        <div className="absolute top-2 right-2 w-3 h-3 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500"></div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                    {formErrors.message && <span className="text-red-600 text-sm ml-2">{formErrors.message}</span>}
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.message ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50 transition-colors resize-none`}
                      placeholder="How can we help you? Please provide details..."
                      disabled={loading}
                    ></textarea>
                    {formData.message && (
                      <button
                        type="button"
                        onClick={() => clearField('message')}
                        className="absolute top-3 right-3"
                      >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className={`text-sm ${getCharCountColor()}`}>
                      {charCount}/500 characters
                    </div>
                    <div className="text-xs text-gray-400">
                      {charCount < 20 ? `${20 - charCount} more characters needed` : 'Minimum 20 characters met'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Your data is secure and private</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium underline">
                    Privacy Policy
                  </Link>
                  {' '}and{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ${activeFAQ === index ? 'border-blue-300 shadow-sm' : 'hover:border-gray-300'}`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 pr-8">{faq.question}</h4>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${activeFAQ === index ? 'transform rotate-90' : ''}`} />
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-200 ${activeFAQ === index ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="p-4 pt-0">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link to="/faq" className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 group">
                  <span>View all FAQs</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect With Us</h3>
                <p className="text-gray-600">Follow us for updates, tips, and success stories</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`${social.color} text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Success Stories</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
                    </div>
                    <div className="text-sm text-gray-600">Active Community</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${isWorkingHours ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Live Chat Support</h3>
              </div>
              
              <p className="text-gray-600 mb-4">Get instant answers to your questions</p>
              
              <div className="flex items-center justify-between mb-6 text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online Now
                </span>
                <span className="text-gray-500">Avg. response: 2 min</span>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2 group">
                <MessageSquare className="w-5 h-5" />
                <span>Start Live Chat</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Available 9 AM - 9 PM, 7 days a week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-16">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Location</h2>
                <p className="text-gray-600">Visit us at our training center in Shimla</p>
              </div>
              <a 
                href="https://maps.google.com/?q=Shimla,+Himachal+Pradesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Navigation className="w-5 h-5" />
                <span>Get Directions</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="relative h-96 rounded-xl overflow-hidden mb-8 border-2 border-gray-200">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410.755722454896!2d77.17222341502149!3d31.10485098156254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d4e0f%3A0x5c6d6f5b0e5a5b0!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1648031234567!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Career Path Institute - Shimla Location"
                className="absolute inset-0"
              ></iframe>
              
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 animate-pulse">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Shimla, HP</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600 mb-3">Shimla, Himachal Pradesh, India</p>
                    <a href="https://maps.google.com/?q=Shimla,+Himachal+Pradesh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1">
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Working Hours</h4>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Weekdays:</span> Mon-Sat, 9:00 AM - 7:00 PM
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Weekend:</span> Sun, 10:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Emergency Contact</h4>
                    <p className="text-blue-600 font-semibold text-lg mb-2">+91 9876543210</p>
                    <p className="text-gray-500 text-sm">Available 24/7 for urgent matters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-[#0B1C2D] to-[#1a365d] text-white overflow-hidden">
        <PatternBackground opacity="0.1" />
        
        <div className="relative container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#F7E600] to-yellow-400 rounded-full mb-6 shadow-lg">
              <Star className="w-8 h-8 text-[#0B1C2D]" fill="#0B1C2D" />
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your <span className="text-[#F7E600]">Preparation</span>?
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful candidates who trusted Career Path Institute
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link 
                to="/courses" 
                className="bg-gradient-to-r from-[#F7E600] to-yellow-400 hover:from-yellow-400 hover:to-[#F7E600] text-[#0B1C2D] font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-2 group"
              >
                <span>Browse All Courses</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/register" 
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Create Free Account
              </Link>
              
              <Link
                to="/demo" 
                className="bg-transparent border-2 border-white/30 hover:border-white/50 hover:bg-white/5 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Book Free Demo
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F7E600] mb-2">10,000+</div>
                <div className="text-white/80">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F7E600] mb-2">95%</div>
                <div className="text-white/80">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F7E600] mb-2">24/7</div>
                <div className="text-white/80">Doubt Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl z-50 group"
        aria-label="Back to top"
      >
        <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
      </button>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
        
        .animate-shake {
          animation: shake 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default Contact;