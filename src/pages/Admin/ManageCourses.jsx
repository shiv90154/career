import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, Search, Filter, Edit2, 
  Trash2, Eye, EyeOff, 
  IndianRupee, Clock, Users,
  ChevronDown, MoreVertical,
  BookOpen, BarChart3,
  Tag, Layers
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    level: 'all',
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [filters, sortBy]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.level !== 'all') params.append('level', filters.level);
      if (filters.category !== 'all') params.append('category', filters.category);
      params.append('sort', sortBy);
      
      const response = await api.get(`/admin/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/courses/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
        setSelectedCourses(selectedCourses.filter(id => id !== courseId));
      } catch (error) {
        alert('Error deleting course: ' + error.response?.data?.message);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) {
      try {
        await api.post('/admin/courses/bulk-delete', { courseIds: selectedCourses });
        setCourses(courses.filter(course => !selectedCourses.includes(course.id)));
        setSelectedCourses([]);
      } catch (error) {
        alert('Error deleting courses: ' + error.response?.data?.message);
      }
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await api.post('/admin/courses/bulk-status', { 
        courseIds: selectedCourses, 
        is_active: status 
      });
      setCourses(courses.map(course => 
        selectedCourses.includes(course.id) 
          ? { ...course, is_active: status } 
          : course
      ));
      setSelectedCourses([]);
    } catch (error) {
      alert('Error updating course status');
    }
  };

  const handleToggleStatus = async (courseId, currentStatus) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, {
        is_active: !currentStatus
      });
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, is_active: !currentStatus } 
          : course
      ));
    } catch (error) {
      alert('Error updating course status');
    }
  };

  const toggleSelectCourse = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage your course catalog</p>
          </div>
          <Link 
            to="/admin/courses/new" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Course
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {courses.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                <IndianRupee className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(courses.reduce((sum, course) => sum + (course.total_revenue || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="revenue">Highest Revenue</option>
                <option value="name">A to Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select 
            value={filters.level} 
            onChange={(e) => setFilters({...filters, level: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="web-dev">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <input
                  type="checkbox"
                  checked={selectedCourses.length === filteredCourses.length}
                  onChange={selectAllCourses}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 font-medium text-gray-700">
                  {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courses Grid/Table */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters' 
                : 'Create your first course to get started'}
            </p>
            <Link 
              to="/admin/courses/new" 
              className="inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => toggleSelectCourse(course.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="font-mono">{course.course_code}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.instructor_name}</p>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{course.short_description}</p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <IndianRupee className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-600">Price</span>
                    </div>
                    <div className="flex items-center">
                      {course.discount_price ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(course.discount_price)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatCurrency(course.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(course.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-600">Enrolled</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{course.enrollment_count || 0}</p>
                  </div>
                </div>

                {/* Course Meta */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration_days} days</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Layers className="w-4 h-4 mr-1" />
                    <span>{course.module_count || 0} modules</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span>{course.rating || 'N/A'}/5</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to={`/admin/courses/${course.id}/content`}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium text-sm"
                  >
                    Manage Content
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(course.id, course.is_active)}
                      className={`p-2 rounded-lg ${course.is_active ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                      title={course.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {course.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link
                      to={`/admin/courses/edit/${course.id}`}
                      className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Footer */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Updated {new Date(course.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <Link 
                    to={`/admin/enrollments?course=${course.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Enrollments →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;