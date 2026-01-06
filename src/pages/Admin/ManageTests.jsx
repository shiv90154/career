import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, Search, Filter, Clock, 
  Users, BarChart, Edit2, 
  Trash2, Play, FileText,
  Calendar, CheckCircle
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

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-tests">
      <div className="page-header">
        <h1>Manage Tests</h1>
        <Link to="/admin/tests/new" className="btn btn-primary">
          <Plus size={20} />
          Create New Test
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tests..."
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
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="tests-grid">
        {filteredTests.map((test) => {
          const status = getTestStatus(test);
          
          return (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <div className="test-status">
                  <span className={`status-badge ${status}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {test.is_active ? (
                    <CheckCircle size={16} color="#10B981" />
                  ) : (
                    <FileText size={16} color="#64748B" />
                  )}
                </div>
                <div className="test-actions">
                  <Link to={`/admin/tests/${test.id}/results`} className="icon-btn">
                    <BarChart size={16} />
                  </Link>
                  <Link to={`/admin/tests/edit/${test.id}`} className="icon-btn">
                    <Edit2 size={16} />
                  </Link>
                  <button 
                    className="icon-btn danger"
                    onClick={() => handleDelete(test.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="test-content">
                <h3>{test.title}</h3>
                <p className="test-description">{test.description}</p>
                
                <div className="test-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{test.duration_minutes} minutes</span>
                  </div>
                  <div className="meta-item">
                    <Play size={16} />
                    <span>{test.total_questions} questions</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{test.attempt_count || 0} attempts</span>
                  </div>
                </div>

                <div className="test-dates">
                  <div className="date-item">
                    <Calendar size={14} />
                    <span>Start: {formatDate(test.start_date)}</span>
                  </div>
                  <div className="date-item">
                    <Calendar size={14} />
                    <span>End: {formatDate(test.end_date)}</span>
                  </div>
                </div>

                <div className="test-course">
                  <span className="course-name">{test.course_title}</span>
                  <span className="category-name">{test.category_title}</span>
                </div>

                <div className="test-stats">
                  <div className="stat">
                    <span className="stat-label">Passing Score</span>
                    <span className="stat-value">{test.passing_score}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg. Score</span>
                    <span className="stat-value">{test.average_score || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="test-footer">
                <Link to={`/admin/tests/${test.id}/questions`} className="btn btn-outline">
                  Manage Questions
                </Link>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleToggleStatus(test.id, test.is_active)}
                >
                  {test.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="empty-state">
          <h3>No tests found</h3>
          <p>Create your first mock test</p>
          <Link to="/admin/tests/new" className="btn btn-primary">
            <Plus size={20} />
            Create Test
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageTests;