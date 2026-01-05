import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Search, Filter, User, Mail, 
  Phone, Calendar, CheckCircle, 
  XCircle, Eye, Edit2, Download
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    email_verified: 'all'
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.email_verified !== 'all') params.append('email_verified', filters.email_verified);
      
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

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-students">
      <div className="page-header">
        <h1>Manage Students</h1>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search students by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={filters.email_verified} 
              onChange={(e) => setFilters({...filters, email_verified: e.target.value})}
            >
              <option value="all">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Contact</th>
              <th>Enrollments</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {student.profile_image ? (
                        <img src={student.profile_image} alt={student.full_name} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="student-details">
                      <h4>{student.full_name}</h4>
                      <p className="student-id">ID: {student.id}</p>
                      <p className="join-date">
                        <Calendar size={12} />
                        Joined: {formatDate(student.created_at)}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div className="contact-item">
                      <Mail size={14} />
                      <span>{student.email}</span>
                      {student.email_verified ? (
                        <CheckCircle size={12} color="#10B981" />
                      ) : (
                        <XCircle size={12} color="#EF4444" />
                      )}
                    </div>
                    {student.phone && (
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    <div className="contact-item">
                      <span>{student.city}, {student.state}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="enrollment-info">
                    <div className="enrollment-count">
                      <span className="count">{student.course_count || 0}</span>
                      <span>courses</span>
                    </div>
                    <div className="completion-rate">
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${student.completion_rate || 0}%` }}
                        ></div>
                      </div>
                      <span>{student.completion_rate || 0}% complete</span>
                    </div>
                  </div>
                </td>
                <td>
                  {student.last_login ? (
                    <div className="last-login">
                      <span>{formatDate(student.last_login)}</span>
                      <small>
                        {new Date(student.last_login).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </small>
                    </div>
                  ) : (
                    <span className="text-muted">Never logged in</span>
                  )}
                </td>
                <td>
                  <div className="status-cell">
                    <span className={`status-badge ${student.is_active ? 'active' : 'inactive'}`}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button 
                      className="status-toggle"
                      onClick={() => handleStatusChange(student.id, student.is_active)}
                    >
                      {student.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View Details">
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn" title="Edit">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <h3>No students found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {students.length > 0 && (
        <div className="pagination">
          <button className="pagination-btn" disabled>
            Previous
          </button>
          <div className="page-numbers">
            <span className="current-page">1</span>
            <span>of</span>
            <span className="total-pages">1</span>
          </div>
          <button className="pagination-btn">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;