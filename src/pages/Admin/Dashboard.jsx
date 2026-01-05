import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, BookOpen, Video, FileText, 
  BarChart, CreditCard, Calendar, 
  TrendingUp, AlertCircle 
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, paymentsRes, enrollmentsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/payments/recent'),
        api.get('/admin/enrollments/recent')
      ]);

      setStats(statsRes.data);
      setRecentPayments(paymentsRes.data);
      setRecentEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="date-range">
          <span>Today: {new Date().toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(11, 28, 45, 0.1)' }}>
            <Users size={24} color="#0B1C2D" />
          </div>
          <div className="stat-info">
            <h3>{stats?.total_students || 0}</h3>
            <p>Total Students</p>
          </div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>+{stats?.new_students_this_month || 0} this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(247, 230, 0, 0.1)' }}>
            <BookOpen size={24} color="#0B1C2D" />
          </div>
          <div className="stat-info">
            <h3>{stats?.total_courses || 0}</h3>
            <p>Active Courses</p>
          </div>
          <div className="stat-change">
            <Link to="/admin/courses">Manage Courses</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(217, 0, 0, 0.1)' }}>
            <CreditCard size={24} color="#0B1C2D" />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats?.total_revenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>+{formatCurrency(stats?.revenue_this_month || 0)} this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(11, 28, 45, 0.1)' }}>
            <BarChart size={24} color="#0B1C2D" />
          </div>
          <div className="stat-info">
            <h3>{stats?.active_enrollments || 0}</h3>
            <p>Active Enrollments</p>
          </div>
          <div className="stat-change">
            <span>{stats?.completion_rate || 0}% completion rate</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/courses/new" className="action-card">
            <div className="action-icon">
              <BookOpen size={20} />
            </div>
            <span>Add New Course</span>
          </Link>
          <Link to="/admin/videos/new" className="action-card">
            <div className="action-icon">
              <Video size={20} />
            </div>
            <span>Add Video Lecture</span>
          </Link>
          <Link to="/admin/tests/new" className="action-card">
            <div className="action-icon">
              <FileText size={20} />
            </div>
            <span>Create Test</span>
          </Link>
          <Link to="/admin/live-classes/schedule" className="action-card">
            <div className="action-icon">
              <Calendar size={20} />
            </div>
            <span>Schedule Live Class</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h3>Recent Payments</h3>
            <Link to="/admin/payments">View All</Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="font-mono">{payment.transaction_id}</td>
                    <td>{payment.student_name}</td>
                    <td>{payment.course_title}</td>
                    <td className="font-bold">{formatCurrency(payment.final_amount)}</td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Recent Enrollments</h3>
            <Link to="/admin/enrollments">View All</Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.student_name}</td>
                    <td>{enrollment.course_title}</td>
                    <td>{new Date(enrollment.enrollment_date).toLocaleDateString()}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{enrollment.progress_percentage}%</span>
                    </td>
                    <td>
                      <span className={`status-badge ${enrollment.enrollment_status}`}>
                        {enrollment.enrollment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="pending-actions">
        <div className="section-header">
          <h3>Pending Actions</h3>
          <AlertCircle size={20} color="#D90000" />
        </div>
        <div className="pending-items">
          {stats?.pending_payments > 0 && (
            <div className="pending-item">
              <span>{stats.pending_payments} pending payments</span>
              <Link to="/admin/payments?status=pending">Review</Link>
            </div>
          )}
          {stats?.pending_tests > 0 && (
            <div className="pending-item">
              <span>{stats.pending_tests} tests to be reviewed</span>
              <Link to="/admin/tests">Review</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;