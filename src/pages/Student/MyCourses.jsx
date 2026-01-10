import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  PlayCircle, Clock, BookOpen, 
  TrendingUp, BarChart, Award,
  Search, Filter, Calendar,
  ChevronRight, CheckCircle,
  Star, Download, Eye,
  MoreVertical, Bookmark,
  Target, Zap, Users,
  X, AlertCircle, Sparkles,
  Trophy, TrendingDown, Bell,
  Clock as ClockIcon,
  Battery, BatteryCharging,
  ArrowUpRight, Shield,
  Video, FileText,
  Layers, BarChart2,
  CalendarDays, UserCheck
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [courses, searchTerm, sortBy]);

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'from-red-500 via-orange-500 to-amber-500';
    if (percentage < 70) return 'from-yellow-500 via-amber-500 to-orange-500';
    if (percentage < 90) return 'from-blue-500 via-cyan-500 to-sky-500';
    return 'from-emerald-500 via-green-500 to-teal-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': 
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 dark:shadow-emerald-900/30';
      case 'active': 
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200 dark:shadow-blue-900/30';
      case 'pending': 
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200 dark:shadow-amber-900/30';
      default: 
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200 dark:shadow-gray-900/30';
    }
  };

  const getDifficultyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white';
      case 'intermediate': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      case 'advanced': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'expert': return 'bg-gradient-to-r from-red-400 to-rose-500 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group animate-bounce-slow">
        <Sparkles className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {coursesCount.active || 0}
        </span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 blur-xl rounded-3xl"></div>
            <div className="relative">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                My Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Journey</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Track, learn, and grow with your enrolled courses
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/courses"
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl shadow-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-2 font-semibold">
                <BookOpen className="w-5 h-5" />
                Explore Courses
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
            
            <button className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Stats Overview with Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Courses',
              value: coursesCount.all,
              icon: BookOpen,
              color: 'from-blue-500 to-cyan-500',
              trend: '+2 this week'
            },
            {
              label: 'In Progress',
              value: coursesCount.active,
              icon: PlayCircle,
              color: 'from-amber-500 to-orange-500',
              trend: 'Active now'
            },
            {
              label: 'Completed',
              value: coursesCount.completed,
              icon: CheckCircle,
              color: 'from-emerald-500 to-teal-500',
              trend: `${Math.round((coursesCount.completed / coursesCount.all) * 100) || 0}% success`
            },
            {
              label: 'Overall Progress',
              value: `${overallProgress}%`,
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-500',
              trend: overallProgress > 50 ? 'Ahead of schedule' : 'Keep going!'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300">
                      {stat.trend}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>

                  {/* Progress bar for overall progress card */}
                  {stat.label === 'Overall Progress' && (
                    <div className="mt-4">
                      <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                          style={{ width: `${overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Search - Enhanced */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search Bar with Glassmorphism */}
          <div className="relative flex-1 w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="pl-12 pr-12 py-3.5 w-full bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white transition-all duration-300"
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
              >
                <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-xs text-gray-400 dark:text-gray-500">⌘K</span>
              </div>
            )}
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-gray-600/50'}`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select
                className="appearance-none bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm text-gray-900 dark:text-white cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="progress">Sort by Progress</option>
                <option value="recent">Sort by Recent</option>
                <option value="duration">Sort by Duration</option>
                <option value="rating">Sort by Rating</option>
                <option value="alphabetical">Sort A-Z</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none group-hover:rotate-0 transition-transform" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="group relative px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </span>
            </button>
          </div>
        </div>

        {/* Filter Tabs with Enhanced Design */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Courses', count: coursesCount.all, icon: BookOpen },
                { key: 'active', label: 'In Progress', count: coursesCount.active, icon: PlayCircle },
                { key: 'completed', label: 'Completed', count: coursesCount.completed, icon: CheckCircle },
                { key: 'pending', label: 'Pending', count: coursesCount.pending, icon: ClockIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`group relative px-5 py-3 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                    filter === tab.key
                      ? 'border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    filter === tab.key
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                  }`}>
                    <tab.icon className={`w-4 h-4 ${
                      filter === tab.key ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className={`text-sm ${
                      filter === tab.key ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {tab.count} courses
                    </div>
                  </div>
                  {filter === tab.key && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                      {tab.count}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filter !== 'all' && (
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              {filter === 'active' && <PlayCircle className="w-3 h-3" />}
              {filter === 'completed' && <CheckCircle className="w-3 h-3" />}
              {filter === 'pending' && <ClockIcon className="w-3 h-3" />}
              {filter === 'active' && 'In Progress'}
              {filter === 'completed' && 'Completed'}
              {filter === 'pending' && 'Pending'}
              <button 
                onClick={() => setFilter('all')}
                className="ml-2 hover:scale-125 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-500/10 to-gray-600/10 dark:from-gray-500/20 dark:to-gray-600/20 text-gray-700 dark:text-gray-300 rounded-lg text-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <Search className="w-3 h-3" />
              "{searchTerm}"
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 hover:scale-125 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sortBy !== 'progress' && (
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-pink-600/10 dark:from-purple-500/20 dark:to-pink-600/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
              <TrendingUp className="w-3 h-3" />
              Sorted by: {sortBy}
              <button 
                onClick={() => setSortBy('progress')}
                className="ml-2 hover:scale-125 transition-transform"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Courses Grid/List View */}
      {filteredAndSortedCourses.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {filteredAndSortedCourses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
          </div>
        )
      ) : (
        <EmptyState filter={filter} setFilter={setFilter} setSearchTerm={setSearchTerm} />
      )}

      {/* Recently Completed Section */}
      {courses.filter(c => c.enrollment_status === 'completed').length > 0 && (
        <RecentlyCompleted courses={courses.filter(c => c.enrollment_status === 'completed')} />
      )}

      {/* Study Recommendations */}
      <StudyRecommendations />
    </div>
  );
};

// Sub-components for better organization
const CourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 z-10"></div>
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Progress Circle */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-white/30"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-white transition-all duration-1000 ease-out"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - course.progress_percentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white drop-shadow-lg">
                {course.progress_percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Course Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(course.enrollment_status)}`}>
            {course.enrollment_status}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getDifficultyBadge(course.level)} shadow-lg`}>
            {course.level}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.course_code}</p>
          </div>
          {course.is_featured && (
            <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {course.short_description}
        </p>

        {/* Instructor */}
        {course.instructor_name && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {course.instructor_name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{course.instructor_name}</p>
            </div>
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{course.rating || 4.5}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Videos</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {course.completed_videos}/{course.total_videos}
            </p>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <BarChart className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Tests</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{course.tests_completed || 0}</p>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Hours</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{course.study_hours || 0}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {course.progress_percentage}%
            </span>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(course.progress_percentage)} transition-all duration-1000`}
              style={{ width: `${course.progress_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/student/courses/${course.id}`}
            className="group flex-1 relative px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 overflow-hidden text-center font-medium text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center justify-center gap-2">
              {course.progress_percentage > 0 ? 'Continue' : 'Start'}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Link>
          
          <div className="relative group">
            <button className="p-2.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <Link
                to={`/student/courses/${course.id}/tests`}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-xl"
              >
                <BarChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-white">Take Test</span>
              </Link>
              <Link
                to={`/student/courses/${course.id}/materials`}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
              >
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-900 dark:text-white">Materials</span>
              </Link>
              <button className="flex items-center gap-2 px-4 py-3 hover:bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-b-xl w-full text-left">
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-900 dark:text-white">Bookmark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseListItem = ({ course }) => {
  return (
    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-1/4 h-48 md:h-auto overflow-hidden">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20"></div>
          <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(course.enrollment_status)}`}>
            {course.enrollment_status}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyBadge(course.level)}`}>
                  {course.level}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {course.short_description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.completed_videos}/{course.total_videos} videos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.tests_completed || 0} tests
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.study_hours || 0} study hours
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{course.progress_percentage}%</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(course.progress_percentage)}`}
                    style={{ width: `${course.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                to={`/student/courses/${course.id}`}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center font-medium"
              >
                {course.progress_percentage > 0 ? 'Continue' : 'Start'}
              </Link>
              <Link
                to={`/student/courses/${course.id}/tests`}
                className="px-6 py-2.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors text-center text-sm"
              >
                Take Test
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ filter, setFilter, setSearchTerm }) => (
  <div className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full flex items-center justify-center">
      {filter === 'all' ? (
        <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      ) : (
        <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      {filter === 'all' ? 'No courses enrolled yet' : 'No courses found'}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
      {filter === 'all' 
        ? 'Start your learning journey by exploring our catalog of expert-designed courses.' 
        : 'Try changing your filters or search term to find what you\'re looking for.'}
    </p>
    {filter === 'all' ? (
      <Link
        to="/courses"
        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative flex items-center gap-2 font-semibold">
          <BookOpen className="w-5 h-5" />
          Browse Courses
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </span>
      </Link>
    ) : (
      <button
        onClick={() => {
          setFilter('all');
          setSearchTerm('');
        }}
        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative flex items-center gap-2 font-semibold">
          <X className="w-5 h-5" />
          Clear Filters
        </span>
      </button>
    )}
  </div>
);

const RecentlyCompleted = ({ courses }) => (
  <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/10 dark:to-teal-900/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 p-6 mb-8 shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {courses.length}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recently Completed</h2>
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">Your learning achievements</p>
        </div>
      </div>
      <Link
        to="/student/achievements"
        className="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 font-medium"
      >
        View All
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {courses.slice(0, 3).map((course) => (
        <div
          key={course.id}
          className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Completed</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{course.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {formatDate(course.completed_at)}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg mb-1 shadow-lg">
                {course.final_score || 85}%
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-300">Final Score</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Link
              to={`/student/courses/${course.id}/certificate`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Certificate
            </Link>
            <Link
              to={`/student/courses/${course.id}`}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Review
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StudyRecommendations = () => (
  <div className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Insights</h2>
          <p className="text-blue-700 dark:text-blue-300 text-sm">Personalized recommendations</p>
        </div>
      </div>
      <CalendarDays className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">Daily Goal</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Complete 30 minutes of study today to maintain your 14-day streak
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-bold text-gray-900 dark:text-white">65%</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-700 dark:to-cyan-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">Progress Streak</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          You're in the top 15% of learners for consistency this month
        </p>
        <div className="flex items-center gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-lg transition-all duration-300 ${
                i < 5 
                  ? 'bg-gradient-to-b from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700' 
                  : 'bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>

      <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">Peer Ranking</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          You're ranked #12 out of 150 students in your cohort
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Top 8%</span>
            <span className="font-bold text-gray-900 dark:text-white">#12</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MyCourses;