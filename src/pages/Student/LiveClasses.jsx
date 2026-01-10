import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notification, setNotification] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

useEffect(() => {
  if (!Array.isArray(classes)) {
    setUpcomingClasses([]);
    setPastClasses([]);
    return;
  }

  const now = new Date();

  const upcoming = classes.filter(
    cls => cls?.schedule_time && new Date(cls.schedule_time) > now
  );

  const past = classes.filter(
    cls => cls?.schedule_time && new Date(cls.schedule_time) <= now
  );

  setUpcomingClasses(upcoming);
  setPastClasses(past);
}, [classes]);


  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

 const fetchClasses = async () => {
  try {
    const response = await axios.get('/api/student/live-classes');

    console.log('LIVE CLASSES API RESPONSE:', response.data);

    // ✅ Normalize → ALWAYS ARRAY
    const data =
      Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.classes)
        ? response.data.classes
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

    setClasses(data);
  } catch (err) {
    console.error(err);
    showNotification('Failed to load live classes', 'error');
    setClasses([]); // 🛡️ never allow non-array
  } finally {
    setLoading(false);
  }
};


  const joinClass = (classItem) => {
    if (classItem.meeting_link) {
      setNotification({ message: 'Redirecting to live class...', type: 'info' });
      window.open(classItem.meeting_link, '_blank');
    } else {
      showNotification('Meeting link not available', 'error');
    }
  };

  const viewClassDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowClassModal(true);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    if (diffMinutes > 0) return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    if (diffMs > 0) return 'now';
    return 'ago';
  };

  const getStatusBadge = (classItem) => {
    const now = new Date();
    const classTime = new Date(classItem.schedule_time);
    
    if (classItem.status === 'cancelled') {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
          Cancelled
        </span>
      );
    }
    
    if (classItem.status === 'ongoing') {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 animate-pulse">
          Live Now
        </span>
      );
    }
    
    if (classTime > now) {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Upcoming
        </span>
      );
    }
    
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
        Completed
      </span>
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'mathematics': 'bg-purple-100 text-purple-800 border-purple-200',
      'science': 'bg-green-100 text-green-800 border-green-200',
      'english': 'bg-blue-100 text-blue-800 border-blue-200',
      'history': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'computer': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'physics': 'bg-red-100 text-red-800 border-red-200',
      'chemistry': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[subject?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading live classes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : notification.type === 'info'
            ? 'bg-blue-50 border border-blue-200 text-blue-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'error' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'success' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
              <p className="mt-2 text-gray-600">Join interactive sessions and learn from instructors in real-time</p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {upcomingClasses.length} upcoming • {pastClasses.length} past
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Upcoming Classes</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {upcomingClasses.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Past Classes</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === 'past' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pastClasses.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Classes List */}
        {activeTab === 'upcoming' && (
          <>
            {upcomingClasses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming classes scheduled</h3>
                  <p className="text-gray-600 mb-6">Check back later or contact your instructor for upcoming sessions</p>
                  <button
                    onClick={fetchClasses}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingClasses.map((classItem) => {
                  const { date, time, relative } = formatDateTime(classItem.schedule_time);
                  
                  return (
                    <div key={classItem.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 overflow-hidden">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusBadge(classItem)}
                              {classItem.subject && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSubjectColor(classItem.subject)}`}>
                                  {classItem.subject}
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {classItem.title}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                          {classItem.description || 'Join this interactive session to learn and participate in real-time discussions.'}
                        </p>
                        
                        {/* Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{date}</div>
                              <div className="text-sm text-gray-500">{time}</div>
                              <div className="text-xs text-blue-600 font-medium mt-1">{relative}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <div className="text-sm text-gray-500">Instructor</div>
                              <div className="text-sm font-medium text-gray-900">{classItem.instructor_name}</div>
                            </div>
                          </div>
                          
                          {classItem.duration && (
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <div className="text-sm text-gray-500">Duration</div>
                                <div className="text-sm font-medium text-gray-900">{classItem.duration} minutes</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => viewClassDetails(classItem)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => joinClass(classItem)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Join Class
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {pastClasses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No past classes available</h3>
                  <p className="text-gray-600">Attended classes will appear here once completed</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {pastClasses.map((classItem) => {
                  const { date, time } = formatDateTime(classItem.schedule_time);
                  
                  return (
                    <div key={classItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Left Section - Class Info */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {getStatusBadge(classItem)}
                              {classItem.subject && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSubjectColor(classItem.subject)}`}>
                                  {classItem.subject}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              {classItem.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {classItem.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>{time}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{classItem.instructor_name}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Section - Actions */}
                          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                            {classItem.recording_url && (
                              <a
                                href={classItem.recording_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Watch Recording
                              </a>
                            )}
                            
                            {classItem.materials_url && (
                              <a
                                href={classItem.materials_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download Materials
                              </a>
                            )}
                            
                            <button
                              onClick={() => viewClassDetails(classItem)}
                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Quick Stats */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{upcomingClasses.length}</div>
                <div className="text-sm text-blue-600">Upcoming Classes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-700">{pastClasses.length}</div>
                <div className="text-sm text-green-600">Classes Attended</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-700">
                  {pastClasses.filter(c => c.recording_url).length}
                </div>
                <div className="text-sm text-purple-600">Recordings Available</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="text-2xl font-bold text-amber-700">
                  {pastClasses.filter(c => c.attendance_status === 'present').length}
                </div>
                <div className="text-sm text-amber-600">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Details Modal */}
      {showClassModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedClass.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(selectedClass)}
                    {selectedClass.subject && (
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSubjectColor(selectedClass.subject)}`}>
                        {selectedClass.subject}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowClassModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Class Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedClass.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-gray-700">Schedule</span>
                    </div>
                    <p className="text-gray-600 ml-8">
                      {formatDateTime(selectedClass.schedule_time).date} at {formatDateTime(selectedClass.schedule_time).time}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-gray-700">Instructor</span>
                    </div>
                    <p className="text-gray-600 ml-8">{selectedClass.instructor_name}</p>
                  </div>

                  {selectedClass.duration && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">Duration</span>
                      </div>
                      <p className="text-gray-600 ml-8">{selectedClass.duration} minutes</p>
                    </div>
                  )}

                  {selectedClass.platform && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">Platform</span>
                      </div>
                      <p className="text-gray-600 ml-8">{selectedClass.platform}</p>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {selectedClass.additional_info && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                      <p className="text-blue-800">{selectedClass.additional_info}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  {selectedClass.meeting_link && new Date(selectedClass.schedule_time) > new Date() && (
                    <button
                      onClick={() => {
                        joinClass(selectedClass);
                        setShowClassModal(false);
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Join Live Class
                    </button>
                  )}

                  {selectedClass.recording_url && (
                    <a
                      href={selectedClass.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-50 text-green-700 py-3 px-6 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center font-medium border border-green-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch Recording
                    </a>
                  )}

                  <button
                    onClick={() => setShowClassModal(false)}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClasses;