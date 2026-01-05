import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api  from '../../services/api';
import { 
  PlayCircle, Award, Users, 
  Clock, Star, TrendingUp,
  ArrowRight, CheckCircle
} from 'lucide-react';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [coursesRes, statsRes, testimonialsRes] = await Promise.all([
        api.get('/public/courses?featured=true&limit=6'),
        api.get('/public/stats'),
        api.get('/public/testimonials')
      ]);

      setFeaturedCourses(coursesRes.data);
      setStats(statsRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome to Career Path Institute, Shimla</h1>
              <p className="hero-subtitle">
                Premier coaching institute for competitive exam preparation. 
                Join thousands of successful candidates who achieved their dream government jobs.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <Users size={24} />
                  <div>
                    <h3>{stats?.total_students || '5000'}+</h3>
                    <p>Successful Students</p>
                  </div>
                </div>
                <div className="stat">
                  <Award size={24} />
                  <div>
                    <h3>{stats?.total_courses || '25'}+</h3>
                    <p>Expert Courses</p>
                  </div>
                </div>
                <div className="stat">
                  <TrendingUp size={24} />
                  <div>
                    <h3>{stats?.success_rate || '85'}%</h3>
                    <p>Success Rate</p>
                  </div>
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/courses" className="btn btn-primary">
                  Explore Courses
                  <ArrowRight size={20} />
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src="/hero-image.jpg" alt="Students Learning" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>Featured Courses</h2>
            <Link to="/courses" className="view-all">
              View All Courses
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="courses-grid">
            {featuredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail || '/default-course.jpg'} alt={course.title} />
                  <div className="course-badge">
                    <span className="badge featured">Featured</span>
                    <span className="badge level">{course.level}</span>
                  </div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.short_description}</p>
                  
                  <div className="course-meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{course.duration_days} days</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{course.enrollment_count} students</span>
                    </div>
                  </div>
                  
                  <div className="course-price">
                    {course.discount_price ? (
                      <>
                        <span className="original-price">₹{course.price}</span>
                        <span className="discounted-price">₹{course.discount_price}</span>
                      </>
                    ) : (
                      <span className="price">₹{course.price}</span>
                    )}
                  </div>
                </div>
                <div className="course-footer">
                  <Link to={`/courses/${course.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose Career Path Institute?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <PlayCircle size={32} />
              </div>
              <h3>Expert Video Lectures</h3>
              <p>High-quality video lectures by experienced faculty with interactive teaching methods.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Comprehensive Study Material</h3>
              <p>Curated study materials, practice questions, and mock tests updated regularly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Live Doubt Sessions</h3>
              <p>Regular live classes and doubt-clearing sessions with personal attention.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Performance Tracking</h3>
              <p>Detailed analytics and progress tracking to monitor your preparation journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Students Say</h2>
          <div className="testimonials-slider">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <p>{testimonial.message}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.student_initials}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.student_name}</h4>
                    <p>{testimonial.course_name}</p>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < testimonial.rating ? "#F7E600" : "#E2E8F0"} 
                          color={i < testimonial.rating ? "#F7E600" : "#E2E8F0"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Start Your Preparation Today</h2>
            <p>Join thousands of successful candidates and achieve your dream government job.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent">
                Enroll Now
              </Link>
              <Link to="/courses" className="btn btn-outline">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;