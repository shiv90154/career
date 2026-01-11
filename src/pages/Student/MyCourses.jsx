import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, CheckCircle, BookOpen, Award, Filter } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await api.get('/student/enrollments.php');
            setEnrollments(response.data.enrollments);
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 75) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getStatusBadge = (status, progress) => {
        if (status === 'completed' || progress >= 100) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </span>
            );
        }
        if (progress > 0) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Play className="w-3 h-3 mr-1" />
                    In Progress
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <BookOpen className="w-3 h-3 mr-1" />
                Not Started
            </span>
        );
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        if (filter === 'completed') return enrollment.status === 'completed' || enrollment.progress_percentage >= 100;
        if (filter === 'active') return enrollment.status === 'active' && enrollment.progress_percentage < 100;
        return true;
    });

    const formatDuration = (hours) => {
        if (!hours) return 'N/A';
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-600">Continue your learning journey</p>
                </div>
                
                {/* Filter */}
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Courses</option>
                        <option value="active">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                            <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Play className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {enrollments.filter(e => e.status === 'completed' || e.progress_percentage >= 100).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {filteredEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <img
                                    src={enrollment.thumbnail || '/api/placeholder/400/200'}
                                    alt={enrollment.course_title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    {getStatusBadge(enrollment.status, enrollment.progress_percentage)}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {enrollment.course_title}
                                </h3>
                                
                                <p className="text-sm text-gray-600 mb-2">
                                    Instructor: {enrollment.instructor_name}
                                </p>
                                
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {formatDuration(enrollment.duration_hours)}
                                    <span className="mx-2">•</span>
                                    {enrollment.total_lessons} lessons
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round(enrollment.progress_percentage || 0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress_percentage || 0)}`}
                                            style={{ width: `${enrollment.progress_percentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Enrollment Info */}
                                <div className="text-xs text-gray-500 mb-4">
                                    Enrolled on {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/student/courses/${enrollment.course_id}`}
                                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {enrollment.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                                    </Link>
                                    
                                    {(enrollment.status === 'completed' || enrollment.progress_percentage >= 100) && (
                                        <Link
                                            to={`/student/certificate/${enrollment.course_id}`}
                                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            <Award className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'No courses enrolled yet' : `No ${filter} courses`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {filter === 'all' 
                            ? 'Start your learning journey by enrolling in a course'
                            : `You don't have any ${filter} courses at the moment`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link
                            to="/courses"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Browse Courses
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyCourses;