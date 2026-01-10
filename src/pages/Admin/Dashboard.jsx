import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, BookOpen, Video, FileText, 
  BarChart, CreditCard, Calendar, 
  TrendingUp, AlertCircle, ChevronRight,
  DollarSign, Clock, CheckCircle, XCircle
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'success': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'active': 'bg-blue-100 text-blue-800 border-blue-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center text-sm ${stats?.new_students_this_month > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+{stats?.new_students_this_month || 0}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_students || 0}</h3>
            <p className="text-gray-600">Total Students</p>
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <Link 
                to="/admin/courses" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.total_courses || 0}</h3>
            <p className="text-gray-600">Active Courses</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+{formatCurrency(stats?.revenue_this_month || 0)}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(stats?.total_revenue || 0)}</h3>
            <p className="text-gray-600">Total Revenue</p>
          </div>

          {/* Active Enrollments */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stats?.completion_rate || 0}% completion
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats?.active_enrollments || 0}</h3>
            <p className="text-gray-600">Active Enrollments</p>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span>Quick Actions</span>
                <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
              </h2>
              <div className="space-y-3">
                <Link 
                  to="/admin/courses/new"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add New Course</span>
                </Link>
                
                <Link 
                  to="/admin/videos/new"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="p-2 bg-red-50 rounded-lg mr-3">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add Video Lecture</span>
                </Link>
                
                <Link 
                  to="/admin/tests/new"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="p-2 bg-green-50 rounded-lg mr-3">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-700">Create Test</span>
                </Link>
                
                <Link 
                  to="/admin/live-classes/schedule"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Schedule Live Class</span>
                </Link>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6 border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  Pending Actions
                </h3>
                <span className="text-sm text-gray-500">Requires attention</span>
              </div>
              <div className="space-y-4">
                {stats?.pending_payments > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-red-500 mr-2" />
                      <span className="font-medium text-gray-700">{stats.pending_payments} pending payments</span>
                    </div>
                    <Link 
                      to="/admin/payments?status=pending" 
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Review
                    </Link>
                  </div>
                )}
                {stats?.pending_tests > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="font-medium text-gray-700">{stats.pending_tests} tests to review</span>
                    </div>
                    <Link 
                      to="/admin/tests" 
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Tables */}
          <div className="lg:col-span-2">
            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
                <Link 
                  to="/admin/payments" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">{payment.transaction_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                          <div className="text-sm text-gray-500">{payment.course_title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{formatCurrency(payment.final_amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                            {payment.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Recent Enrollments</h3>
                <Link 
                  to="/admin/enrollments" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{enrollment.student_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{enrollment.course_title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{enrollment.progress_percentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(enrollment.enrollment_status)}`}>
                            {enrollment.enrollment_status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {enrollment.enrollment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(enrollment.enrollment_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Platform Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold">{stats?.avg_completion_rate || 0}%</div>
              <div className="text-sm text-blue-100">Avg. Completion Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.avg_rating || 0}/5</div>
              <div className="text-sm text-blue-100">Avg. Course Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.active_live_classes || 0}</div>
              <div className="text-sm text-blue-100">Live Classes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.support_tickets || 0}</div>
              <div className="text-sm text-blue-100">Support Tickets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;