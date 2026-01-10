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
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  ArrowRight
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

  // Enhanced stats card configuration with gradients
  const statCards = [
    {
      title: 'Enrolled Courses',
      value: dashboardData?.stats?.enrolled_courses || 0,
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      trend: '+2 this week',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Study Hours',
      value: `${dashboardData?.stats?.study_hours || 0}h`,
      icon: Clock,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      trend: '+5h from last week',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Progress Rate',
      value: `${dashboardData?.stats?.completion_rate || 0}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      trend: dashboardData?.stats?.progress_trend > 0 ? `+${dashboardData.stats.progress_trend}%` : `${dashboardData?.stats?.progress_trend || 0}%`,
      trendColor: dashboardData?.stats?.progress_trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
    },
    {
      title: 'Tests Completed',
      value: dashboardData?.stats?.tests_completed || 0,
      icon: Award,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      trend: 'Avg. 85% score',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{dashboardData?.student?.full_name}!</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Keep learning and track your progress. You're doing great!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Current streak</span>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {dashboardData?.stats?.streak_days || 0} days
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-2xl ${stat.bgColor} p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className={`text-xs font-medium ${stat.trendColor} flex items-center gap-1`}>
                    {stat.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Course Progress & Live Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Course Progress
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your learning journey</p>
                </div>
                <Link 
                  to="/student/courses" 
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {dashboardData?.recent_courses?.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{course.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{course.course_code}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{course.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${course.progress_percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{course.completed_videos} of {course.total_videos} videos completed</span>
                          <span>{Math.round(course.progress_percentage / 100 * course.total_hours || 0)}h of {course.total_hours}h</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/student/courses/${course.id}`}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-medium whitespace-nowrap"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Live Classes */}
          {dashboardData?.upcoming_live_classes?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Upcoming Live Classes
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join interactive sessions</p>
                  </div>
                  <Link 
                    to="/student/live-classes" 
                    className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.upcoming_live_classes.map((liveClass) => (
                    <div key={liveClass.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{liveClass.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{liveClass.course_title}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <ClockIcon className="w-4 h-4" />
                              {formatDate(liveClass.scheduled_date)} • {formatTime(liveClass.scheduled_date)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4" />
                              {liveClass.duration_minutes} minutes
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Users className="w-4 h-4" />
                              {liveClass.attendance_count || 0} attending
                            </div>
                          </div>
                        </div>
                        
                        <button className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm font-medium whitespace-nowrap">
                          Join Class
                          <PlayCircle className="w-4 h-4 ml-2 inline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Recent Activity
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData?.recent_activity?.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'test' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {activity.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'test' && <BarChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {activity.type === 'material' && <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
          </div>

          {/* Test Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-emerald-600" />
                  Test Performance
                </h2>
                <Link 
                  to="/student/tests" 
                  className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData?.recent_tests?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recent_tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{test.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(test.completed_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end ml-4">
                        <div className={`relative w-14 h-14 rounded-full ${
                          test.passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'
                        } flex items-center justify-center`}>
                          <span className={`text-lg font-bold ${
                            test.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}>
                            {test.score || 0}%
                          </span>
                        </div>
                        <span className={`text-xs font-medium mt-2 ${
                          test.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {test.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <BarChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No test results yet</p>
                  <Link 
                    to="/student/courses" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 text-sm font-medium"
                  >
                    Take a Test
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Links</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BookOpen, label: 'My Courses', color: 'blue', to: '/student/courses' },
                  { icon: BarChart, label: 'Mock Tests', color: 'emerald', to: '/student/tests' },
                  { icon: FileText, label: 'Study Materials', color: 'purple', to: '/student/materials' },
                  { icon: Users, label: 'Live Classes', color: 'pink', to: '/student/live-classes' },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 border border-${link.color}-100 dark:border-${link.color}-800 hover:bg-${link.color}-100 dark:hover:bg-${link.color}-900/30 transition-all duration-300 hover:scale-105`}
                    >
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-${link.color}-500 to-${link.color}-600 mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                Continue Learning
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pick up where you left off</p>
            </div>
            <Link 
              to="/student/courses" 
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Browse all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData?.continue_learning?.map((item) => (
              <Link 
                key={item.id}
                to={`/student/courses/${item.course_id}/learn`}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'video' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {item.type === 'video' ? (
                      <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.course_title}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${item.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Continue watching</span>
                    <span>{item.duration || '15m'} left</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Daily Goal',
            value: '2h 30m',
            icon: Target,
            gradient: 'from-blue-500 to-blue-600',
            progress: 75,
            color: 'blue'
          },
          {
            title: 'Learning Streak',
            value: `${dashboardData?.stats?.streak_days || 0} days`,
            icon: Zap,
            gradient: 'from-emerald-500 to-emerald-600',
            progress: 90,
            color: 'emerald'
          },
          {
            title: 'Average Score',
            value: `${dashboardData?.stats?.average_score || 0}%`,
            icon: TrendingUp,
            gradient: 'from-purple-500 to-purple-600',
            progress: dashboardData?.stats?.average_score || 0,
            color: 'purple'
          },
          {
            title: 'Class Rank',
            value: `#${dashboardData?.stats?.rank || '--'}`,
            icon: Award,
            gradient: 'from-amber-500 to-amber-600',
            progress: 85,
            color: 'amber'
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{metric.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600`}
                      style={{ width: `${metric.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;