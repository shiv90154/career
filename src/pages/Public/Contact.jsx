import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Mail, Phone, MapPin, Clock,
  Send, CheckCircle, AlertCircle,
  Facebook, Twitter, Instagram, Youtube,
  MessageSquare
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setSuccess(false);

    try {
      await api.post('/public/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Get in Touch</h1>
            <p className="hero-subtitle">
              Have questions about our courses or need guidance? 
              Our team is here to help you succeed.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info-cards">
            <div className="info-card">
              <div className="card-icon">
                <Phone size={24} />
              </div>
              <div className="card-content">
                <h3>Phone Support</h3>
                <p>Call us for immediate assistance</p>
                <a href="tel:+911234567890" className="contact-link">
                  +91 1234567890
                </a>
                <span className="timing">
                  <Clock size={14} />
                  Mon-Sat: 9 AM - 7 PM
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <Mail size={24} />
              </div>
              <div className="card-content">
                <h3>Email Support</h3>
                <p>Send us an email anytime</p>
                <a href="mailto:info@thecareerspathway.com" className="contact-link">
                  info@thecareerspathway.com
                </a>
                <span className="timing">
                  <Clock size={14} />
                  Response within 24 hours
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <MapPin size={24} />
              </div>
              <div className="card-content">
                <h3>Visit Our Center</h3>
                <p>Meet us in person</p>
                <address className="contact-link">
                  Shimla, Himachal Pradesh
                </address>
                <span className="timing">
                  <Clock size={14} />
                  Mon-Sat: 10 AM - 6 PM
                </span>
              </div>
            </div>
          </div>

          <div className="contact-main">
            {/* Left Side - Contact Form */}
            <div className="contact-form-section">
              <div className="section-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                {success && (
                  <div className="success-message">
                    <CheckCircle size={20} />
                    <div>
                      <h4>Message Sent Successfully!</h4>
                      <p>We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    <AlertCircle size={20} />
                    <div>
                      <h4>Error Sending Message</h4>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
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
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
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
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Select a subject</option>
                      <option value="course-info">Course Information</option>
                      <option value="admission">Admission Query</option>
                      <option value="technical">Technical Support</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows="6"
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Additional Info */}
            <div className="contact-info-section">
              {/* FAQ */}
              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                
                <div className="faq-list">
                  <div className="faq-item">
                    <h4>How do I enroll in a course?</h4>
                    <p>
                      Browse our courses, select the one you want, and click "Enroll Now". 
                      For paid courses, you'll be directed to the payment gateway.
                    </p>
                  </div>
                  
                  <div className="faq-item">
                    <h4>What is the refund policy?</h4>
                    <p>
                      We offer a 7-day refund policy for all courses. If you're not satisfied, 
                      contact us within 7 days of enrollment for a full refund.
                    </p>
                  </div>
                  
                  <div className="faq-item">
                    <h4>Do you provide study materials?</h4>
                    <p>
                      Yes, all courses include comprehensive study materials, 
                      practice questions, and mock tests.
                    </p>
                  </div>
                  
                  <div className="faq-item">
                    <h4>Is there mobile app access?</h4>
                    <p>
                      Yes, you can access all courses through our mobile-responsive website. 
                      No separate app installation required.
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h3>Connect With Us</h3>
                <p>Follow us for updates, tips, and success stories</p>
                
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <Facebook size={20} />
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="social-link twitter">
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                  <a href="#" className="social-link instagram">
                    <Instagram size={20} />
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="social-link youtube">
                    <Youtube size={20} />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

              {/* Live Chat */}
              <div className="live-chat-section">
                <div className="chat-header">
                  <MessageSquare size={20} />
                  <h3>Live Chat Support</h3>
                </div>
                <p>Get instant answers to your questions</p>
                <button className="btn btn-outline">
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>Our Location</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <MapPin size={48} />
                <p>Shimla, Himachal Pradesh</p>
              </div>
            </div>
            
            <div className="location-details">
              <div className="detail">
                <h4>Address</h4>
                <p>Shimla, Himachal Pradesh, India</p>
              </div>
              <div className="detail">
                <h4>Working Hours</h4>
                <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                <p>Sunday: 10:00 AM - 2:00 PM</p>
              </div>
              <div className="detail">
                <h4>Emergency Contact</h4>
                <p>+91 9876543210 (Available 24/7)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Preparation?</h2>
            <p>Join thousands of successful candidates who trusted Career Path Institute</p>
            <div className="cta-buttons">
              <Link to="/courses" className="btn btn-accent">
                Browse Courses
              </Link>
              <Link to="/register" className="btn btn-outline">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;