import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState({
        enrolled_courses: 0,
        completed_courses: 0,
        certificates_earned: 0,
        total_study_time: 0
    });
    const [recentCourses, setRecentCourses] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [enrollmentsRes, statsRes] = await Promise.all([
                api.get('/student/enrollments.php'),
                api.get('/student/stats.php')
            ]);

            const enrollments = enrollmentsRes.data.enrollments || [];
            setRecentCourses(enrollments.slice(0, 4));
            
            // Calculate stats from enrollments
            const enrolledCount = enrollments.length;
            const completedCount = enrollments.filter(e => e.status === 'completed').length;
            const totalStudyTime = enrollments.reduce((total, e) => total + (e.total_study_time || 0), 0);

            setStats({
                enrolled_courses: enrolledCount,
                completed_courses: completedCount,
                certificates_earned: completedCount, // Assuming certificates for completed courses
                total_study_time: totalStudyTime
            });

        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatStudyTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
                <p className="text-blue-100">Continue your learning journey and achieve your goals.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.enrolled_courses}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed_courses}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Certificates</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.certificates_earned}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Study Time</p>
                            <p className="text-2xl font-bold text-gray-900">{formatStudyTime(stats.total_study_time)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Continue Learning</h2>
                        <Link 
                            to="/student/my-courses" 
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentCourses.length > 0 ? (
                            recentCourses.map((course) => (
                                <div key={course.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                                    <img
                                        src={course.thumbnail || '/api/placeholder/60/60'}
                                        alt={course.course_title}
                                        className="w-15 h-15 rounded-lg object-cover"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-medium text-gray-900">{course.course_title}</h3>
                                        <p className="text-sm text-gray-600">{course.instructor_name}</p>
                                        
                                        {/* Progress Bar */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>Progress</span>
                                                <span>{Math.round(course.progress_percentage || 0)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${getProgressColor(course.progress_percentage || 0)}`}
                                                    style={{ width: `${course.progress_percentage || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/student/courses/${course.course_id}`}
                                        className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                    >
                                        <Play className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No courses enrolled yet</p>
                                <Link 
                                    to="/courses" 
                                    className="mt-2 inline-block text-blue-600 hover:text-blue-700"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
                    
                    <div className="space-y-4">
                        {/* Weekly Goal */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-800">Weekly Goal</span>
                                <span className="text-sm text-blue-600">5 hours</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">3 hours completed this week</p>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Recent Achievements</h3>
                            <div className="space-y-2">
                                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                    <Award className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">First Course Completed</p>
                                        <p className="text-xs text-green-600">Earned your first certificate</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-yellow-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Learning Streak</p>
                                        <p className="text-xs text-yellow-600">5 days in a row</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    to="/courses"
                                    className="p-3 text-center bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                                >
                                    Browse Courses
                                </Link>
                                <Link
                                    to="/student/certificates"
                                    className="p-3 text-center bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm"
                                >
                                    My Certificates
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;