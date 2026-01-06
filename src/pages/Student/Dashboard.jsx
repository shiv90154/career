import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{dashboardData?.student?.full_name}!</span>
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Keep learning and track your progress
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium">
              {dashboardData?.student?.batch || 'Batch 2024'}
            </span>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {statCards.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 mt-2 ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(stat.trend)}% from last week</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Course Progress
                </h2>
                <p className="text-gray-600 text-sm mt-1">Track your learning journey</p>
              </div>
              <Link 
                to="/student/courses" 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_courses?.map((course) => (
                <div 
                  key={course.id} 
                  className="group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{course.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{course.course_code}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {course.progress_percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress_percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {course.completed_videos} of {course.total_videos} videos completed
                          </span>
                          {course.last_accessed && (
                            <span className="text-xs text-gray-500">
                              Last accessed: {formatDate(course.last_accessed)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/student/courses/${course.id}`}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Live Classes */}
          {dashboardData?.upcoming_live_classes?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Upcoming Live Classes
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Join interactive sessions</p>
                </div>
                <Link 
                  to="/student/live-classes" 
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.upcoming_live_classes.map((liveClass) => (
                  <div 
                    key={liveClass.id} 
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-200 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{liveClass.title}</h4>
                            <p className="text-gray-600 text-sm">{liveClass.course_title}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(liveClass.scheduled_date)} • {formatTime(liveClass.scheduled_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{liveClass.duration_minutes} mins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{liveClass.attendance_count || 0} attending</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 text-sm font-medium">
                        Join Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Recent Activity
              </h2>
              <p className="text-gray-600 text-sm mt-1">Your learning timeline</p>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_activity?.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'video' ? 'bg-blue-100' : 
                    activity.type === 'test' ? 'bg-amber-100' : 
                    'bg-green-100'
                  }`}>
                    {activity.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'test' && <BarChart className="w-4 h-4 text-amber-600" />}
                    {activity.type === 'material' && <FileText className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
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
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-amber-600" />
                  Test Performance
                </h2>
                <p className="text-gray-600 text-sm mt-1">Recent assessment results</p>
              </div>
              <Link 
                to="/student/tests" 
                className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {dashboardData?.recent_tests?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{test.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(test.completed_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                        test.passed 
                          ? 'border-green-200 bg-green-50 text-green-700' 
                          : 'border-red-200 bg-red-50 text-red-700'
                      }`}>
                        <span className="font-bold text-lg">{test.score || 0}%</span>
                      </div>
                      <span className={`text-xs font-medium mt-1 ${
                        test.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No test results yet</p>
                <Link 
                  to="/student/courses" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                >
                  Take a Test
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
              <p className="text-gray-600 text-sm mt-1">Access important sections</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/student/courses" 
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">My Courses</span>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/student/tests" 
                className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3">
                  <BarChart className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Mock Tests</span>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/student/materials" 
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Study Materials</span>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/student/live-classes" 
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Live Classes</span>
                <ChevronRight className="w-4 h-4 text-gray-400 mt-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-red-600" />
              Continue Learning
            </h2>
            <p className="text-gray-600 text-sm mt-1">Pick up where you left off</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.continue_learning?.map((item) => (
            <Link 
              key={item.id}
              to={`/student/courses/${item.course_id}/learn`}
              className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  item.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {item.type === 'video' ? (
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{item.course_title}</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.progress || 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress || 0}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {item.type === 'video' ? 'Video Lesson' : 'Study Material'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="text-xs font-medium">{item.difficulty || 'Beginner'}</span>
                  </div>
                </div>
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