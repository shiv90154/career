import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  BookOpen, Clock, TrendingUp, 
  Calendar, Award, BarChart, 
  PlayCircle, FileText, 
  Clock as ClockIcon, Users,
  ChevronRight,
  Target,
  Zap,
  Bookmark,
  Star,
  TrendingDown
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/student/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats card configuration for better customization
  const statCards = [
    {
      title: 'Enrolled Courses',
      value: dashboardData?.stats?.enrolled_courses || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Study Hours',
      value: `${dashboardData?.stats?.study_hours || 0}h`,
      icon: Clock,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Progress Rate',
      value: `${dashboardData?.stats?.completion_rate || 0}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      trend: dashboardData?.stats?.progress_trend || 0
    },
    {
      title: 'Tests Completed',
      value: dashboardData?.stats?.tests_completed || 0,
      icon: Award,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {dashboardData?.student?.full_name}!</h1>
        <p className="welcome-message">
          Keep learning and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData?.stats?.enrolled_courses || 0}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData?.stats?.study_hours || 0}h</h3>
            <p>Total Study Time</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData?.stats?.completion_rate || 0}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData?.stats?.tests_completed || 0}</h3>
            <p>Tests Completed</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="left-column">
          {/* Course Progress */}
          <div className="section-card">
            <div className="section-header">
              <h2>Course Progress</h2>
              <Link to="/student/courses" className="view-all">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_courses?.map((course) => (
                <div key={course.id} className="course-progress-item">
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p className="course-code">{course.course_code}</p>
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span>{course.progress_percentage}% complete</span>
                      <span>{course.completed_videos}/{course.total_videos} videos</span>
                    </div>
                  </div>

                  <Link 
                    to={`/student/courses/${course.id}`}
                    className="btn btn-sm btn-outline"
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Live Classes */}
          {dashboardData?.upcoming_live_classes?.length > 0 && (
            <div className="section-card">
              <div className="section-header">
                <h2>Upcoming Live Classes</h2>
                <Link to="/student/live-classes" className="view-all">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.upcoming_live_classes.map((liveClass) => (
                  <div key={liveClass.id} className="live-class-item">
                    <div className="class-time">
                      <Calendar size={16} />
                      <div className="time-details">
                        <strong>{formatDate(liveClass.scheduled_date)}</strong>
                        <span>{formatTime(liveClass.scheduled_date)}</span>
                      </div>
                    </div>
                    
                    <div className="class-info">
                      <h4>{liveClass.title}</h4>
                      <p className="course-name">{liveClass.course_title}</p>
                      <div className="class-meta">
                        <span>
                          <ClockIcon size={14} />
                          {liveClass.duration_minutes} mins
                        </span>
                        <span>
                          <Users size={14} />
                          {liveClass.attendance_count || 0} attending
                        </span>
                      </div>
                      
                      <button className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium">
                        Join Class
                      </button>
                    </div>
                    
                    <button className="btn btn-sm btn-primary">
                      Join Class
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="section-card">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_activity?.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'video' && <PlayCircle size={16} />}
                    {activity.type === 'test' && <BarChart size={16} />}
                    {activity.type === 'material' && <FileText size={16} />}
                  </div>
                  
                  <div className="activity-content">
                    <p>{activity.description}</p>
                    <span className="activity-time">
                      {new Date(activity.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Performance */}
          <div className="section-card">
            <div className="section-header">
              <h2>Test Performance</h2>
              <Link to="/student/tests" className="view-all">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {dashboardData?.recent_tests?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_tests.map((test) => (
                  <div key={test.id} className="test-result">
                    <div className="test-info">
                      <h4>{test.title}</h4>
                      <p className="test-date">
                        {new Date(test.completed_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    
                    <div className="test-score">
                      <div className={`score-circle ${test.passed ? 'passed' : 'failed'}`}>
                        <span>{test.score || 0}%</span>
                      </div>
                      <span className="score-status">
                        {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <p>No test results yet</p>
                <Link to="/student/courses" className="btn btn-sm btn-outline">
                  Take a Test
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="section-card">
            <div className="section-header">
              <h2>Quick Links</h2>
            </div>
            
            <div className="quick-links">
              <Link to="/student/courses" className="quick-link">
                <BookOpen size={20} />
                <span>My Courses</span>
              </Link>
              <Link to="/student/tests" className="quick-link">
                <BarChart size={20} />
                <span>Mock Tests</span>
              </Link>
              <Link to="/student/materials" className="quick-link">
                <FileText size={20} />
                <span>Study Materials</span>
              </Link>
              <Link to="/student/live-classes" className="quick-link">
                <Users size={20} />
                <span>Live Classes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="section-card">
        <div className="section-header">
          <h2>Continue Learning</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.continue_learning?.map((item) => (
            <Link 
              key={item.id}
              to={`/student/courses/${item.course_id}/learn`}
              className="recommendation-card"
            >
              <div className="recommendation-header">
                <div className="recommendation-icon">
                  {item.type === 'video' && <PlayCircle size={20} />}
                  {item.type === 'material' && <FileText size={20} />}
                </div>
                <div className="recommendation-info">
                  <h4>{item.title}</h4>
                  <p className="course-name">{item.course_title}</p>
                </div>
              </div>
              
              <div className="progress-indicator">
                <div className="progress-bar small">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.progress || 0}%` }}
                  ></div>
                </div>
                <span>{item.progress || 0}% complete</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Daily Goal</p>
              <p className="text-2xl font-bold mt-1">2h 30m</p>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Streak</p>
              <p className="text-2xl font-bold mt-1">
                {dashboardData?.stats?.streak_days || 0} days
              </p>
            </div>
            <Zap className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Score</p>
              <p className="text-2xl font-bold mt-1">
                {dashboardData?.stats?.average_score || 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rank</p>
              <p className="text-2xl font-bold mt-1">
                #{dashboardData?.stats?.rank || '--'}
              </p>
            </div>
            <Award className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;