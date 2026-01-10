import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { 
  Search, Filter, User, Mail, 
  Phone, Calendar, CheckCircle, 
  XCircle, Eye, Edit2, Download,
  ChevronLeft, ChevronRight,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    status: 'all',
    email_verified: 'all',
    enrollment_status: 'all'
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.email_verified !== 'all') params.append('email_verified', filters.email_verified);
      if (filters.enrollment_status !== 'all') params.append('enrollment_status', filters.enrollment_status);
      
      const response = await api.get(`/admin/students?${params.toString()}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, currentStatus) => {
    try {
      await api.put(`/admin/students/${studentId}/status`, {
        is_active: !currentStatus
      });
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, is_active: !currentStatus } 
          : student
      ));
    } catch (error) {
      alert('Error updating student status');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/students/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting students:', error);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm) ||
      student.id?.toString().includes(searchTerm)
    );
  }, [students, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(new Set(paginatedStudents.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkAction = async (action) => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }

    try {
      if (action === 'activate') {
        await api.post('/admin/students/bulk-activate', {
          student_ids: Array.from(selectedStudents)
        });
      } else if (action === 'deactivate') {
        await api.post('/admin/students/bulk-deactivate', {
          student_ids: Array.from(selectedStudents)
        });
      }
      
      // Refresh the list
      fetchStudents();
      setSelectedStudents(new Set());
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
              <p className="text-gray-600 mt-1">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedStudents.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedStudents.size} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
              )}
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={handleExport}
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or ID..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <select
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={filters.email_verified}
                onChange={(e) => setFilters({...filters, email_verified: e.target.value})}
              >
                <option value="all">All Verification</option>
                <option value="true">Email Verified</option>
                <option value="false">Not Verified</option>
              </select>

              <select
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={filters.enrollment_status}
                onChange={(e) => setFilters({...filters, enrollment_status: e.target.value})}
              >
                <option value="all">All Enrollments</option>
                <option value="enrolled">Enrolled</option>
                <option value="not_enrolled">Not Enrolled</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => {
                  setFilters({ status: 'all', email_verified: 'all', enrollment_status: 'all' });
                  setSearchTerm('');
                }}
                className="px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={paginatedStudents.length > 0 && paginatedStudents.every(s => selectedStudents.has(s.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {student.profile_image ? (
                              <img 
                                src={student.profile_image} 
                                alt={student.full_name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="text-blue-600" size={20} />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.full_name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <span>ID:</span>
                            <span className="font-mono">{student.id}</span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            Joined {formatDate(student.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm">{student.email}</span>
                          {student.email_verified ? (
                            <CheckCircle size={12} className="text-green-500" />
                          ) : (
                            <XCircle size={12} className="text-red-500" />
                          )}
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm">{student.phone}</span>
                          </div>
                        )}
                        {(student.city || student.state) && (
                          <div className="text-xs text-gray-500">
                            {student.city}{student.city && student.state ? ', ' : ''}{student.state}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                            {student.course_count || 0} courses
                          </div>
                          {student.course_count > 0 && (
                            <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                              {student.completion_rate || 0}% complete
                            </div>
                          )}
                        </div>
                        {student.course_count > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${student.completion_rate || 0}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.last_login ? (
                        <div>
                          <div className="text-sm text-gray-900">{formatDate(student.last_login)}</div>
                          <div className="text-xs text-gray-500">{formatTime(student.last_login)}</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <AlertCircle size={14} />
                          <span className="text-sm">Never logged in</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleStatusChange(student.id, student.is_active)}
                          className={`text-xs font-medium ${
                            student.is_active 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {student.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          title="More options"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <AlertCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredStudents.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg border ${
                      currentPage === 1
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg border ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg border ${
                      currentPage === totalPages
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600">Total Students</div>
            <div className="text-2xl font-bold text-gray-900">{students.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600">Active Students</div>
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.is_active).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600">Verified Email</div>
            <div className="text-2xl font-bold text-blue-600">
              {students.filter(s => s.email_verified).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600">Avg. Completion</div>
            <div className="text-2xl font-bold text-purple-600">
              {students.length > 0 
                ? Math.round(students.reduce((sum, s) => sum + (s.completion_rate || 0), 0) / students.length)
                : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;