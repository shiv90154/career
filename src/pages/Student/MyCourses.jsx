import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api  from '../../services/api';
import { 
  PlayCircle, Clock, BookOpen, 
  TrendingUp, BarChart, Award,
  Search, Filter, Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const response = await api.get(`/student/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="my-courses">
      <div className="page-header">
        <h1>My Courses</h1>
        <div className="header-stats">
          <div className="stat">
            <BookOpen size={20} />
            <span>{courses.length} Courses</span>
          </div>
          <div className="stat">
            <TrendingUp size={20} />
            <span>
              {Math.round(courses.reduce((acc, course) => acc + course.progress_percentage, 0) / courses.length) || 0}% 
              Overall Progress
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          <button 
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            In Progress
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <div className="course-thumbnail">
                  <img 
                    src={course.thumbnail || '/default-course.jpg'} 
                    alt={course.title}
                  />
                  <div className="course-progress-overlay">
                    <div className="progress-circle">
                      <span>{course.progress_percentage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="course-badge">
                  <span className={`badge ${course.enrollment_status}`}>
                    {course.enrollment_status}
                  </span>
                  {course.is_featured && (
                    <span className="badge featured">Featured</span>
                  )}
                </div>
              </div>

              <div className="course-content">
                <div className="course-meta">
                  <span className="course-code">{course.course_code}</span>
                  <span className="course-level">{course.level}</span>
                </div>
                
                <h3>{course.title}</h3>
                <p className="course-description">{course.short_description}</p>
                
                <div className="course-stats">
                  <div className="stat-item">
                    <PlayCircle size={16} />
                    <span>{course.completed_videos}/{course.total_videos} videos</span>
                  </div>
                  <div className="stat-item">
                    <BarChart size={16} />
                    <span>{course.tests_completed || 0} tests taken</span>
                  </div>
                  <div className="stat-item">
                    <Clock size={16} />
                    <span>{course.study_hours || 0}h studied</span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Your Progress</span>
                    <span>{course.progress_percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress_percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-dates">
                    <span>Started: {formatDate(course.enrollment_date)}</span>
                    {course.completed_at && (
                      <span>Completed: {formatDate(course.completed_at)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="course-actions">
                <Link 
                  to={`/student/courses/${course.id}`}
                  className="btn btn-primary"
                >
                  {course.progress_percentage > 0 ? 'Continue' : 'Start'}
                </Link>
                <Link 
                  to={`/student/courses/${course.id}/tests`}
                  className="btn btn-outline"
                >
                  Take Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {filter === 'all' ? (
            <>
              <h3>No courses enrolled yet</h3>
              <p>Browse our courses and start learning today!</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </>
          ) : (
            <>
              <h3>No courses found</h3>
              <p>Try changing your filter or search term</p>
            </>
          )}
        </div>
      )}

      {/* Recently Completed */}
      {filteredCourses.filter(c => c.enrollment_status === 'completed').length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <h2>Recently Completed</h2>
            <Award size={24} color="#F7E600" />
          </div>
          
          <div className="completed-courses">
            {filteredCourses
              .filter(c => c.enrollment_status === 'completed')
              .slice(0, 3)
              .map((course) => (
                <div key={course.id} className="completed-course">
                  <div className="completion-info">
                    <h4>{course.title}</h4>
                    <p>Completed on {formatDate(course.completed_at)}</p>
                  </div>
                  <div className="completion-score">
                    <div className="score-badge">
                      <span>{course.final_score || 85}%</span>
                    </div>
                    <Link 
                      to={`/student/courses/${course.id}/certificate`}
                      className="btn btn-sm btn-outline"
                    >
                      View Certificate
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;