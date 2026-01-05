import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Users, TrendingUp, Clock,
  BookOpen, Target, Shield, Globe,
  CheckCircle, Star, Heart
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users size={32} />, value: '5000+', label: 'Successful Students' },
    { icon: <Award size={32} />, value: '100+', label: 'Selections in 2023' },
    { icon: <BookOpen size={32} />, value: '50+', label: 'Expert Courses' },
    { icon: <TrendingUp size={32} />, value: '95%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: <Target size={32} />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course design to student support.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Student Success',
      description: 'Our success is measured by the success of our students in achieving their goals.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity and transparency in all our operations.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Innovation',
      description: 'We continuously innovate our teaching methods and course materials.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Founder & Director',
      bio: '15+ years of experience in competitive exam coaching. Former civil servant.',
      expertise: ['UPSC', 'HPPSC', 'General Studies']
    },
    {
      name: 'Ms. Priya Singh',
      role: 'Academic Head',
      bio: 'Expert in Mathematics and Reasoning. 10+ years of teaching experience.',
      expertise: ['Quantitative Aptitude', 'Logical Reasoning', 'Banking Exams']
    },
    {
      name: 'Mr. Amit Kumar',
      role: 'English Faculty',
      bio: 'Specialized in English Grammar and Comprehension. Published author.',
      expertise: ['English Language', 'Vocabulary', 'Reading Comprehension']
    },
    {
      name: 'Ms. Neha Verma',
      role: 'Student Support Head',
      bio: 'Dedicated to providing exceptional student support and career guidance.',
      expertise: ['Career Counseling', 'Student Mentorship', 'Exam Strategy']
    }
  ];

  const testimonials = [
    {
      name: 'Rohit Kumar',
      course: 'Patwari Exam 2023',
      result: 'Rank 12',
      text: 'Career Path Institute transformed my preparation strategy. The structured approach and regular tests helped me crack the exam in my first attempt.'
    },
    {
      name: 'Priya Sharma',
      course: 'SSC CGL',
      result: 'Selected',
      text: 'The faculty\'s dedication and comprehensive study materials made all the difference. I highly recommend CPI to all serious aspirants.'
    },
    {
      name: 'Amit Singh',
      course: 'Banking Exams',
      result: 'PO Selected',
      text: 'The mock tests were exactly like the actual exam. The detailed analysis helped me improve my score significantly.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>About Career Path Institute</h1>
              <p className="hero-subtitle">
                Empowering aspirants to achieve their dream government jobs through 
                quality education, expert guidance, and comprehensive preparation.
              </p>
              
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat">
                    {stat.icon}
                    <div>
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hero-image">
              <img src="/about-hero.jpg" alt="Career Path Institute" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div className="section-header">
            <h2>Our Story</h2>
            <p className="section-subtitle">
              Founded in 2010 with a vision to revolutionize competitive exam preparation
            </p>
          </div>
          
          <div className="story-content">
            <div className="story-text">
              <p>
                Career Path Institute was born from a simple observation: most competitive 
                exam aspirants in Himachal Pradesh lacked access to quality, structured 
                coaching that addressed their specific needs.
              </p>
              
              <p>
                What started as a small coaching center in Shimla has now transformed into 
                a premier institute serving thousands of students across North India. Our 
                journey has been guided by a commitment to excellence and a deep 
                understanding of what it takes to succeed in competitive exams.
              </p>
              
              <p>
                Today, we combine traditional teaching wisdom with modern technology to 
                create a learning experience that is effective, engaging, and accessible 
                to everyone.
              </p>
              
              <div className="story-highlights">
                <div className="highlight">
                  <CheckCircle size={20} />
                  <span>Founded in 2010 in Shimla</span>
                </div>
                <div className="highlight">
                  <CheckCircle size={20} />
                  <span>1000+ selections in government jobs</span>
                </div>
                <div className="highlight">
                  <CheckCircle size={20} />
                  <span>Expanded to online platform in 2018</span>
                </div>
                <div className="highlight">
                  <CheckCircle size={20} />
                  <span>50+ expert faculty members</span>
                </div>
              </div>
            </div>
            
            <div className="story-image">
              <img src="/story-image.jpg" alt="Our Story" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission">
              <div className="mv-icon">
                <Target size={40} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide accessible, high-quality education that empowers every 
                aspirant to achieve their dream government job through innovative 
                teaching methods and comprehensive support.
              </p>
            </div>
            
            <div className="mv-card vision">
              <div className="mv-icon">
                <Globe size={40} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become the most trusted and effective competitive exam preparation 
                institute in North India, transforming lives through education and 
                creating successful civil servants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="our-team">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Expert Faculty</h2>
            <p className="section-subtitle">
              Experienced educators dedicated to your success
            </p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <div className="avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div className="team-content">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  
                  <div className="team-expertise">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="methodology">
        <div className="container">
          <div className="section-header">
            <h2>Our Teaching Methodology</h2>
            <p className="section-subtitle">
              A proven approach to exam success
            </p>
          </div>
          
          <div className="methodology-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Structured Curriculum</h3>
                <p>Comprehensive coverage of all topics with a focus on exam patterns</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Concept Clarity</h3>
                <p>Building strong fundamentals through interactive video lectures</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Regular Practice</h3>
                <p>Daily quizzes and weekly tests to reinforce learning</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Performance Analysis</h3>
                <p>Detailed feedback and personalized improvement plans</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Exam Simulation</h3>
                <p>Full-length mock tests that replicate actual exam conditions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="success-stories">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p className="section-subtitle">
              Hear from our students who achieved their dreams
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="student-avatar">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="student-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.course}</p>
                    <span className="result">{testimonial.result}</span>
                  </div>
                </div>
                
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                </div>
                
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F7E600" color="#F7E600" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Career Path Institute?</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h3>Flexible Learning</h3>
              <p>Learn at your own pace with 24/7 access to all course materials</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <BookOpen size={32} />
              </div>
              <h3>Updated Content</h3>
              <p>Regularly updated study materials based on latest exam patterns</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Expert Faculty</h3>
              <p>Learn from experienced educators with proven track records</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Doubt Support</h3>
              <p>24/7 doubt resolution through live sessions and forums</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Performance Tracking</h3>
              <p>Detailed analytics to monitor your progress and improvement</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <Heart size={32} />
              </div>
              <h3>Personal Mentorship</h3>
              <p>One-on-one guidance and personalized study plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Start Your Journey with Us</h2>
            <p>Join thousands of successful candidates who trusted Career Path Institute</p>
            <div className="cta-buttons">
              <Link to="/courses" className="btn btn-accent">
                Browse Courses
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;