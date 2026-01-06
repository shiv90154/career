import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  BookOpen, Clock, TrendingUp, 
  Calendar, Award, BarChart, 
  PlayCircle, FileText, 
  Clock as ClockIcon, Users
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {dashboardData?.student?.full_name}!
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Keep learning and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.stats?.enrolled_courses || 0}
            </h3>
            <p className="text-gray-600 text-sm">Enrolled Courses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.stats?.study_hours || 0}h
            </h3>
            <p className="text-gray-600 text-sm">Total Study Time</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.stats?.completion_rate || 0}%
            </h3>
            <p className="text-gray-600 text-sm">Overall Progress</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.stats?.tests_completed || 0}
            </h3>
            <p className="text-gray-600 text-sm">Tests Completed</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Course Progress</h2>
              <Link to="/student/courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_courses?.map((course) => (
                <div key={course.id} className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                    <p className="text-gray-500 text-sm">{course.course_code}</p>
                  </div>
                  
                  <div className="my-4">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{course.progress_percentage}% complete</span>
                      <span>{course.completed_videos}/{course.total_videos} videos</span>
                    </div>
                  </div>

                  <Link 
                    to={`/student/courses/${course.id}`}
                    className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Live Classes */}
          {dashboardData?.upcoming_live_classes?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h2>
                <Link to="/student/live-classes" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.upcoming_live_classes.map((liveClass) => (
                  <div key={liveClass.id} className="p-4 rounded-lg border border-gray-200 bg-blue-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar size={16} className="text-gray-500" />
                      <div className="flex flex-col">
                        <strong className="text-gray-900 font-medium">{formatDate(liveClass.scheduled_date)}</strong>
                        <span className="text-gray-500 text-sm">{formatTime(liveClass.scheduled_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{liveClass.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{liveClass.course_title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <ClockIcon size={14} />
                          <span>{liveClass.duration_minutes} mins</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{liveClass.attendance_count || 0} attending</span>
                        </span>
                      </div>
                    </div>
                    
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recent_activity?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    {activity.type === 'video' && <PlayCircle size={16} />}
                    {activity.type === 'test' && <BarChart size={16} />}
                    {activity.type === 'material' && <FileText size={16} />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm mb-1">{activity.description}</p>
                    <span className="text-gray-500 text-xs">
                      {new Date(activity.created_at).toLocaleDateString('en-IN', {
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
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Test Performance</h2>
              <Link to="/student/tests" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                View All
              </Link>
            </div>
            
            {dashboardData?.recent_tests?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_tests.map((test) => (
                  <div key={test.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{test.title}</h4>
                      <p className="text-gray-500 text-sm">
                        {new Date(test.completed_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mx-auto ${
                        test.passed ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                      }`}>
                        <span className="font-bold">{test.score || 0}%</span>
                      </div>
                      <span className="block text-xs mt-1">
                        {test.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No test results yet</p>
                <Link to="/student/courses" className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                  Take a Test
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link to="/student/courses" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <BookOpen size={20} className="text-gray-700" />
                <span className="font-medium text-gray-900">My Courses</span>
              </Link>
              <Link to="/student/tests" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <BarChart size={20} className="text-gray-700" />
                <span className="font-medium text-gray-900">Mock Tests</span>
              </Link>
              <Link to="/student/materials" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <FileText size={20} className="text-gray-700" />
                <span className="font-medium text-gray-900">Study Materials</span>
              </Link>
              <Link to="/student/live-classes" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Users size={20} className="text-gray-700" />
                <span className="font-medium text-gray-900">Live Classes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.continue_learning?.map((item) => (
            <Link 
              key={item.id}
              to={`/student/courses/${item.course_id}/learn`}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 block"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  {item.type === 'video' && <PlayCircle size={20} />}
                  {item.type === 'material' && <FileText size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.course_title}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${item.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-gray-600 text-sm whitespace-nowrap">{item.progress || 0}% complete</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;