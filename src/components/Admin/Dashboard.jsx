import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Users, BookOpen, DollarSign, Award, 
    TrendingUp, Eye, Plus, BarChart3 
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        total_courses: 0,
        total_revenue: 0,
        total_enrollments: 0,
        active_courses: 0,
        pending_courses: 0
    });
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, enrollmentsRes, coursesRes] = await Promise.all([
                api.get('/admin/stats.php'),
                api.get('/admin/enrollments.php?limit=5'),
                api.get('/admin/courses.php?limit=5&sort=enrollment_count')
            ]);

            setStats(statsRes.data.stats || stats);
            setRecentEnrollments(enrollmentsRes.data.enrollments || []);
            setTopCourses(coursesRes.data.courses || []);

        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your learning platform</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to="/admin/courses/new"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Course
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+12% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_courses}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">{stats.active_courses} active, {stats.pending_courses} pending</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-600">+8% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Enrollments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_enrollments}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">This month</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enrollments */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Enrollments</h2>
                        <Link 
                            to="/admin/enrollments" 
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentEnrollments.length > 0 ? (
                            recentEnrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900">{enrollment.student_name}</p>
                                            <p className="text-sm text-gray-600">{enrollment.course_title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(enrollment.payment_amount || 0)}
                                        </p>
                                        <p className="text-xs text-gray-600">{formatDate(enrollment.enrollment_date)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No recent enrollments</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Top Performing Courses</h2>
                        <Link 
                            to="/admin/courses" 
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {topCourses.length > 0 ? (
                            topCourses.map((course, index) => (
                                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900">{course.title}</p>
                                            <p className="text-sm text-gray-600">{course.instructor_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {course.enrollment_count} students
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {course.rating_avg ? `${course.rating_avg}★` : 'No ratings'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No courses available</p>
                                <Link 
                                    to="/admin/courses/new" 
                                    className="mt-2 inline-block text-blue-600 hover:text-blue-700"
                                >
                                    Create First Course
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/admin/courses/new"
                        className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Add Course</span>
                    </Link>

                    <Link
                        to="/admin/students"
                        className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                        <Users className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Manage Students</span>
                    </Link>

                    <Link
                        to="/admin/analytics"
                        className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                        <BarChart3 className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">View Analytics</span>
                    </Link>

                    <Link
                        to="/admin/settings"
                        className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
                    >
                        <Eye className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;