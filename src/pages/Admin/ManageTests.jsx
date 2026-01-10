import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, Search, Filter, Clock, 
  Users, BarChart, Edit2, 
  Trash2, Play, FileText,
  Calendar, CheckCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    course_id: 'all'
  });

  useEffect(() => {
    fetchTests();
  }, [filters]);

  const fetchTests = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.course_id !== 'all') params.append('course_id', filters.course_id);
      
      const response = await api.get(`/admin/tests?${params.toString()}`);
      setTests(response.data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    if (window.confirm('Delete this test and all associated questions? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/tests/${testId}`);
        setTests(tests.filter(test => test.id !== testId));
      } catch (error) {
        alert('Error deleting test: ' + error.response?.data?.message);
      }
    }
  };

  const handleToggleStatus = async (testId, currentStatus) => {
    try {
      await api.put(`/admin/tests/${testId}/status`, {
        is_active: !currentStatus
      });
      setTests(tests.map(test => 
        test.id === testId 
          ? { ...test, is_active: !currentStatus } 
          : test
      ));
    } catch (error) {
      alert('Error updating test status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getTestStatus = (test) => {
    const now = new Date();
    const startDate = test.start_date ? new Date(test.start_date) : null;
    const endDate = test.end_date ? new Date(test.end_date) : null;

    if (!test.is_active) return 'inactive';
    if (startDate && now < startDate) return 'scheduled';
    if (endDate && now > endDate) return 'expired';
    if (startDate && endDate && now >= startDate && now <= endDate) return 'active';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Tests</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your mock tests</p>
          </div>
          <Link 
            to="/admin/tests/new" 
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={20} />
            Create New Test
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tests by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <Filter size={18} className="text-gray-500" />
                <select 
                  value={filters.status} 
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="bg-transparent text-gray-700 font-medium focus:outline-none focus:ring-0"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTests.map((test) => {
            const status = getTestStatus(test);
            
            return (
              <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {test.is_active ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <FileText size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link 
                        to={`/admin/tests/${test.id}/results`} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Results"
                      >
                        <BarChart size={18} />
                      </Link>
                      <Link 
                        to={`/admin/tests/edit/${test.id}`} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Test"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        onClick={() => handleDelete(test.id)}
                        title="Delete Test"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
                  
                  {/* Meta Information */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-700">{test.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Play size={16} className="text-gray-400" />
                        <span className="text-gray-700">{test.total_questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-gray-700">{test.attempt_count || 0} attempts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-700">{formatDate(test.start_date)}</span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{test.course_title}</span>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                          {test.category_title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{test.passing_score}%</div>
                        <div className="text-xs text-gray-500">Passing Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{test.average_score || 0}%</div>
                        <div className="text-xs text-gray-500">Average Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      to={`/admin/tests/${test.id}/questions`} 
                      className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Manage Questions
                    </Link>
                    <button 
                      onClick={() => handleToggleStatus(test.id, test.is_active)}
                      className={`flex-1 px-4 py-2 font-medium rounded-lg transition duration-200 ${
                        test.is_active 
                          ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' 
                          : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      }`}
                    >
                      {test.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No tests match your search criteria.' : 'Get started by creating your first mock test.'}
            </p>
            <Link 
              to="/admin/tests/new" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              <Plus size={20} />
              Create Your First Test
            </Link>
          </div>
        </div>
      )}

      {/* Test Count */}
      {filteredTests.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          Showing {filteredTests.length} of {tests.length} tests
        </div>
      )}
    </div>
  );
};

export default ManageTests;