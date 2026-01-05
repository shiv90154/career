import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  PlayCircle, Clock, Users, Award,
  BookOpen, FileText, CheckCircle,
  IndianRupee, Tag, Calendar,
  Star, ChevronDown, ChevronUp,
  Share2, Download, User, BarChart
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseRes, instructorRes, curriculumRes, reviewsRes, relatedRes] = await Promise.all([
        api.get(`/public/courses/${id}`),
        api.get(`/public/courses/${id}/instructor`),
        api.get(`/public/courses/${id}/curriculum`),
        api.get(`/public/courses/${id}/reviews`),
        api.get(`/public/courses/${id}/related`)
      ]);

      setCourse(courseRes.data);
      setInstructor(instructorRes.data);
      setCurriculum(curriculumRes.data);
      setReviews(reviewsRes.data);
      setRelatedCourses(relatedRes.data);

      // Check if user is enrolled
      if (user) {
        const enrollmentRes = await api.get(`/student/courses/${id}/enrollment-status`);
        setIsEnrolled(enrollmentRes.data.is_enrolled);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { redirect: `/courses/${id}` } });
      return;
    }

    if (course.price === 0) {
      // Free course enrollment
      try {
        await api.post(`/student/courses/${id}/enroll`);
        setIsEnrolled(true);
        navigate(`/student/courses/${id}`);
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    } else {
      // Paid course - initiate payment
      navigate(`/checkout/${id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="course-detail">
      {/* Course Header */}
      <div className="course-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/courses">Courses</Link>
            <span>/</span>
            <span>{course.category}</span>
            <span>/</span>
            <span className="current">{course.title}</span>
          </div>

          <div className="header-content">
            <div className="header-left">
              <div className="course-badge">
                <span className={`level ${course.level}`}>
                  {course.level}
                </span>
                {course.is_featured && (
                  <span className="featured">
                    <Star size={12} />
                    Featured
                  </span>
                )}
              </div>
              
              <h1>{course.title}</h1>
              
              <p className="course-description">
                {course.short_description}
              </p>

              <div className="course-meta">
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.enrollment_count} students enrolled</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.duration_days} days • {course.total_hours} hours</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Last updated: {new Date(course.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="instructor-info">
                <div className="instructor-avatar">
                  {instructor?.profile_image ? (
                    <img src={instructor.profile_image} alt={instructor.full_name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="instructor-details">
                  <span className="instructor-label">Instructor</span>
                  <h4>{instructor?.full_name}</h4>
                  <p>{instructor?.title}</p>
                </div>
              </div>
            </div>

            <div className="header-right">
              <div className="course-card-preview">
                <div className="card-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="play-overlay">
                    <PlayCircle size={48} />
                  </div>
                </div>

                <div className="card-content">
                  <div className="price-section">
                    {course.price === 0 ? (
                      <div className="free-price">
                        <h2>Free</h2>
                        <p>Lifetime access</p>
                      </div>
                    ) : course.discount_price ? (
                      <div className="discount-price">
                        <div className="price-row">
                          <span className="original">{formatCurrency(course.price)}</span>
                          <span className="discounted">{formatCurrency(course.discount_price)}</span>
                        </div>
                        <p className="discount-text">
                          {Math.round((1 - course.discount_price / course.price) * 100)}% off
                        </p>
                      </div>
                    ) : (
                      <div className="regular-price">
                        <h2>{formatCurrency(course.price)}</h2>
                        <p>One-time payment</p>
                      </div>
                    )}
                  </div>

                  <div className="enrollment-action">
                    {isEnrolled ? (
                      <Link to={`/student/courses/${id}`} className="btn btn-primary">
                        Continue Learning
                      </Link>
                    ) : (
                      <button onClick={handleEnroll} className="btn btn-primary">
                        {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                      </button>
                    )}
                  </div>

                  <div className="guarantee">
                    <CheckCircle size={16} />
                    <span>30-day money-back guarantee</span>
                  </div>

                  <div className="card-features">
                    <div className="feature">
                      <PlayCircle size={16} />
                      <span>{course.video_count || 0} video lectures</span>
                    </div>
                    <div className="feature">
                      <FileText size={16} />
                      <span>{course.material_count || 0} study materials</span>
                    </div>
                    <div className="feature">
                      <BookOpen size={16} />
                      <span>{course.test_count || 0} practice tests</span>
                    </div>
                    <div className="feature">
                      <Award size={16} />
                      <span>Certificate of completion</span>
                    </div>
                  </div>

                  <button className="share-btn">
                    <Share2 size={16} />
                    Share this course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Tabs Navigation */}
        <div className="course-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Curriculum
          </button>
          <button 
            className={`tab ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Instructor
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={`tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-left">
                <h2>What you'll learn</h2>
                <div className="learning-objectives">
                  {course.learning_objectives?.map((objective, index) => (
                    <div key={index} className="objective">
                      <CheckCircle size={16} />
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>

                <h2>Course Description</h2>
                <div className="description" dangerouslySetInnerHTML={{ __html: course.description }} />

                <h2>Who this course is for</h2>
                <div className="target-audience">
                  {course.target_audience?.map((audience, index) => (
                    <div key={index} className="audience-item">
                      • {audience}
                    </div>
                  ))}
                </div>

                <h2>Course Requirements</h2>
                <ul className="requirements">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="overview-right">
                <div className="stats-card">
                  <h3>Course Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat">
                      <h4>{course.video_count || 0}</h4>
                      <p>Video Lectures</p>
                    </div>
                    <div className="stat">
                      <h4>{course.total_hours}</h4>
                      <p>Hours of Content</p>
                    </div>
                    <div className="stat">
                      <h4>{course.material_count || 0}</h4>
                      <p>Study Materials</p>
                    </div>
                    <div className="stat">
                      <h4>{course.test_count || 0}</h4>
                      <p>Practice Tests</p>
                    </div>
                  </div>
                </div>

                <div className="tags-card">
                  <h3>Course Tags</h3>
                  <div className="tags">
                    {course.tags?.map((tag, index) => (
                      <span key={index} className="tag">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="curriculum-content">
              <div className="curriculum-header">
                <h2>Course Curriculum</h2>
                <div className="curriculum-stats">
                  <span>{curriculum.length} modules</span>
                  <span>•</span>
                  <span>{course.total_hours} total hours</span>
                </div>
              </div>

              <div className="modules-list">
                {curriculum.map((module, index) => (
                  <div key={module.id} className="module-card">
                    <div 
                      className="module-header"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="module-title">
                        <div className="module-number">
                          Module {index + 1}
                        </div>
                        <h3>{module.title}</h3>
                      </div>
                      
                      <div className="module-meta">
                        <span>{module.lecture_count} lectures</span>
                        <span>{formatDuration(module.duration_minutes)}</span>
                        {expandedModules.has(module.id) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>

                    {expandedModules.has(module.id) && (
                      <div className="module-content">
                        {module.lectures.map((lecture, lectureIndex) => (
                          <div key={lecture.id} className="lecture-item">
                            <div className="lecture-info">
                              <div className="lecture-number">
                                {index + 1}.{lectureIndex + 1}
                              </div>
                              <div className="lecture-details">
                                <h4>{lecture.title}</h4>
                                <div className="lecture-meta">
                                  <span>{formatDuration(lecture.duration_minutes)}</span>
                                  {lecture.is_free && (
                                    <span className="free-badge">Free Preview</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="lecture-actions">
                              {lecture.is_free ? (
                                <button className="preview-btn">
                                  <PlayCircle size={16} />
                                  Preview
                                </button>
                              ) : (
                                <span className="locked">
                                  <Award size={16} />
                                  Enroll to access
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && instructor && (
            <div className="instructor-content">
              <div className="instructor-profile">
                <div className="instructor-avatar-large">
                  {instructor.profile_image ? (
                    <img src={instructor.profile_image} alt={instructor.full_name} />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                
                <div className="instructor-details-large">
                  <h2>{instructor.full_name}</h2>
                  <p className="instructor-title">{instructor.title}</p>
                  
                  <div className="instructor-stats">
                    <div className="stat">
                      <Users size={20} />
                      <div>
                        <h4>{instructor.student_count || 0}+</h4>
                        <p>Students</p>
                      </div>
                    </div>
                    <div className="stat">
                      <BookOpen size={20} />
                      <div>
                        <h4>{instructor.course_count || 0}</h4>
                        <p>Courses</p>
                      </div>
                    </div>
                    <div className="stat">
                      <Star size={20} />
                      <div>
                        <h4>{instructor.rating || 4.8}</h4>
                        <p>Rating</p>
                      </div>
                    </div>
                  </div>

                  <div className="instructor-bio">
                    <h3>About the Instructor</h3>
                    <p>{instructor.bio}</p>
                  </div>

                  <div className="instructor-expertise">
                    <h3>Areas of Expertise</h3>
                    <div className="expertise-tags">
                      {instructor.expertise?.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <div className="reviews-header">
                <div className="rating-overview">
                  <div className="overall-rating">
                    <h2>{course.rating || 4.5}</h2>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={20}
                          fill={i < Math.floor(course.rating || 4.5) ? "#F7E600" : "#E2E8F0"}
                          color={i < Math.floor(course.rating || 4.5) ? "#F7E600" : "#E2E8F0"}
                        />
                      ))}
                    </div>
                    <p>Course Rating</p>
                  </div>
                  
                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => Math.floor(r.rating) === star).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      
                      return (
                        <div key={star} className="rating-row">
                          <span className="star-count">{star} star</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="review-actions">
                  <button className="btn btn-primary">
                    Write a Review
                  </button>
                </div>
              </div>

              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer">
                        <div className="reviewer-avatar">
                          {review.student_initials}
                        </div>
                        <div className="reviewer-info">
                          <h4>{review.student_name}</h4>
                          <p>{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="review-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={16}
                              fill={i < review.rating ? "#F7E600" : "#E2E8F0"}
                              color={i < review.rating ? "#F7E600" : "#E2E8F0"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <h3>{review.title}</h3>
                      <p>{review.content}</p>
                    </div>
                    
                    {review.response && (
                      <div className="instructor-response">
                        <strong>Instructor Response:</strong>
                        <p>{review.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to review this course!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="faq-content">
              <h2>Frequently Asked Questions</h2>
              
              <div className="faq-list">
                {course.faqs?.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div 
                      className="faq-question"
                      onClick={() => toggleModule(`faq-${index}`)}
                    >
                      <h3>{faq.question}</h3>
                      {expandedModules.has(`faq-${index}`) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                    
                    {expandedModules.has(`faq-${index}`) && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="no-faqs">
                    <p>No FAQs available for this course yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div className="related-courses">
            <h2>Related Courses</h2>
            <div className="related-grid">
              {relatedCourses.map((relatedCourse) => (
                <Link 
                  key={relatedCourse.id}
                  to={`/courses/${relatedCourse.id}`}
                  className="related-card"
                >
                  <div className="related-thumbnail">
                    <img src={relatedCourse.thumbnail} alt={relatedCourse.title} />
                  </div>
                  <div className="related-content">
                    <h4>{relatedCourse.title}</h4>
                    <div className="related-meta">
                      <span>{relatedCourse.level}</span>
                      <span>•</span>
                      <span>{relatedCourse.duration_days} days</span>
                    </div>
                    <div className="related-price">
                      {relatedCourse.price === 0 ? (
                        <span className="free">Free</span>
                      ) : relatedCourse.discount_price ? (
                        <>
                          <span className="original">{formatCurrency(relatedCourse.price)}</span>
                          <span className="discounted">{formatCurrency(relatedCourse.discount_price)}</span>
                        </>
                      ) : (
                        <span className="price">{formatCurrency(relatedCourse.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="course-cta">
          <div className="cta-content">
            <h2>Ready to start learning?</h2>
            <p>Join {course.enrollment_count} other students who have already enrolled in this course.</p>
            {isEnrolled ? (
              <Link to={`/student/courses/${id}`} className="btn btn-accent">
                Continue Learning
              </Link>
            ) : (
              <button onClick={handleEnroll} className="btn btn-accent">
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;