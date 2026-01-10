import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api  from '../../services/api';
import { 
  PlayCircle, Clock, BookOpen, 
  TrendingUp, BarChart, Award,
  Search, Filter, Calendar,
  ChevronRight, CheckCircle,
  Star, Download, Eye,
  MoreVertical, Bookmark,
  Target, Zap, Users,
  X, AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
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

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => b.progress_percentage - a.progress_percentage);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        break;
      case 'duration':
        filtered.sort((a, b) => b.duration_hours - a.duration_hours);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [courses, searchTerm, sortBy]);

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'from-red-500 to-orange-500';
    if (percentage < 70) return 'from-yellow-500 to-amber-500';
    if (percentage < 90) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'advanced': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'expert': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const overallProgress = useMemo(() => {
    if (courses.length === 0) return 0;
    const total = courses.reduce((acc, course) => acc + course.progress_percentage, 0);
    return Math.round(total / courses.length);
  }, [courses]);

  const coursesCount = useMemo(() => ({
    all: courses.length,
    active: courses.filter(c => c.enrollment_status === 'active').length,
    completed: courses.filter(c => c.enrollment_status === 'completed').length,
    pending: courses.filter(c => c.enrollment_status === 'pending').length
  }), [courses]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track your learning progress
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            <BookOpen className="w-4 h-4" />
            Browse New Courses
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{coursesCount.all}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{coursesCount.active}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50">
                <PlayCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{coursesCount.completed}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search courses by title, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="progress">Sort by Progress</option>
              <option value="recent">Sort by Recent</option>
              <option value="duration">Sort by Duration</option>
              <option value="alphabetical">Sort A-Z</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Tabs */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All Courses ({coursesCount.all})
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('active')}
              >
                In Progress ({coursesCount.active})
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'completed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed ({coursesCount.completed})
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'pending'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('pending')}
              >
                Pending ({coursesCount.pending})
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {filter === 'active' && 'In Progress'}
              {filter === 'completed' && 'Completed'}
              {filter === 'pending' && 'Pending'}
              <button onClick={() => setFilter('all')}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </span>
          )}
          {sortBy !== 'progress' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Sorted by: {sortBy}
              <button onClick={() => setSortBy('progress')}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAndSortedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Course Header with Thumbnail */}
              <div className="relative">
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Progress Circle */}
                <div className="absolute -bottom-6 right-6">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className={`text-blue-500 transition-all duration-1000 ease-out`}
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - course.progress_percentage / 100)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        {course.progress_percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.enrollment_status)}`}>
                    {course.enrollment_status}
                  </span>
                  {course.is_featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 pt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyBadge(course.level)}`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-sm font-medium">{course.rating || 4.5}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{course.course_code}</p>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.short_description}
                </p>

                {course.instructor_name && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {course.instructor_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="text-sm font-medium text-gray-900">{course.instructor_name}</p>
                    </div>
                  </div>
                )}

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <PlayCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Videos</p>
                    <p className="font-semibold text-gray-900">
                      {course.completed_videos}/{course.total_videos}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <BarChart className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Tests</p>
                    <p className="font-semibold text-gray-900">{course.tests_completed || 0}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Hours</p>
                    <p className="font-semibold text-gray-900">{course.study_hours || 0}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {course.progress_percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(course.progress_percentage)} transition-all duration-1000`}
                      style={{ width: `${course.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Dates */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Started: {formatDate(course.enrollment_date)}</span>
                  </div>
                  {course.completed_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed: {formatDate(course.completed_at)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl text-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                  >
                    {course.progress_percentage > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                  <div className="relative group">
                    <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <Link
                        to={`/student/courses/${course.id}/tests`}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-t-xl"
                      >
                        <BarChart className="w-4 h-4" />
                        <span>Take Test</span>
                      </Link>
                      <Link
                        to={`/student/courses/${course.id}/materials`}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Materials</span>
                      </Link>
                      <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-b-xl w-full text-left">
                        <Bookmark className="w-4 h-4" />
                        <span>Bookmark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            {filter === 'all' ? (
              <BookOpen className="w-12 h-12 text-gray-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {filter === 'all' ? 'No courses enrolled yet' : 'No courses found'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {filter === 'all' 
              ? 'Browse our catalog and start your learning journey today!' 
              : 'Try changing your filters or search term'}
          </p>
          {filter === 'all' ? (
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              Browse Available Courses
            </Link>
          ) : (
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Recently Completed Section */}
      {courses.filter(c => c.enrollment_status === 'completed').length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recently Completed</h2>
                <p className="text-gray-600 text-sm">Your successful course completions</p>
              </div>
            </div>
            <Link
              to="/student/achievements"
              className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
            >
              View All Achievements
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses
              .filter(c => c.enrollment_status === 'completed')
              .slice(0, 3)
              .map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl p-4 border border-green-200 hover:border-green-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Completed</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Completed on {formatDate(course.completed_at)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold mb-1">
                        {course.final_score || 85}%
                      </div>
                      <span className="text-xs text-gray-600">Score</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/student/courses/${course.id}/certificate`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Certificate
                    </Link>
                    <Link
                      to={`/student/courses/${course.id}`}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Study Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Learning Recommendations</h2>
              <p className="text-gray-600 text-sm">Based on your progress and interests</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Daily Learning Goal</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete at least 30 minutes of study today to maintain your streak
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-2/3 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>
              <span className="font-medium text-gray-900">65%</span>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Progress Streak</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You've studied for 14 consecutive days! Keep it up!
            </p>
            <div className="flex items-center gap-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full ${i < 5 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Peer Comparison</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You're in the top 25% of your batch in course completion rate
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="w-3/4 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">75%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;