import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Plus, Search, Filter, Edit2, 
  Trash2, Eye, EyeOff, 
  IndianRupee, Clock, Users
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    level: 'all'
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.level !== 'all') params.append('level', filters.level);
      
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
      } catch (error) {
        alert('Error deleting course: ' + error.response?.data?.message);
      }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-courses">
      <div className="page-header">
        <h1>Manage Courses</h1>
        <Link to="/admin/courses/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Course
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search courses by title or code..."
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
              value={filters.level} 
              onChange={(e) => setFilters({...filters, level: e.target.value})}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <div className="course-status">
                <span className={`status-badge ${course.is_active ? 'active' : 'inactive'}`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="course-code">{course.course_code}</span>
              </div>
              <div className="course-actions">
                <button 
                  onClick={() => handleToggleStatus(course.id, course.is_active)}
                  className="icon-btn"
                  title={course.is_active ? 'Deactivate' : 'Activate'}
                >
                  {course.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Link to={`/admin/courses/edit/${course.id}`} className="icon-btn">
                  <Edit2 size={16} />
                </Link>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="icon-btn danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="course-description">{course.short_description}</p>
              
              <div className="course-meta">
                <div className="meta-item">
                  <IndianRupee size={16} />
                  <span>
                    {course.discount_price ? (
                      <>
                        <span className="original-price">{formatCurrency(course.price)}</span>
                        <span className="discounted-price">{formatCurrency(course.discount_price)}</span>
                      </>
                    ) : (
                      formatCurrency(course.price)
                    )}
                  </span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.duration_days} days • {course.total_hours} hours</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.enrollment_count || 0} students enrolled</span>
                </div>
              </div>
            </div>

            <div className="course-footer">
              <Link to={`/admin/courses/${course.id}/content`} className="btn btn-outline">
                Manage Content
              </Link>
              <Link to={`/admin/enrollments?course=${course.id}`} className="btn btn-outline">
                View Enrollments
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>Create your first course to get started</p>
          <Link to="/admin/courses/new" className="btn btn-primary">
            <Plus size={20} />
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;