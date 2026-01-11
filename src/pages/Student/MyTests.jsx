import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, Calendar, Play, Eye, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const MyTests = () => {
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [testsResponse, attemptsResponse] = await Promise.all([
                api.get('/student/tests.php'),
                api.get('/student/test-attempts.php')
            ]);
            
            setTests(testsResponse.data.tests || []);
            setAttempts(attemptsResponse.data.attempts || []);
        } catch (error) {
            toast.error('Failed to fetch test data');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const TestCard = ({ test }) => {
        const userAttempts = attempts.filter(attempt => attempt.test_id === test.id);
        const bestAttempt = userAttempts.reduce((best, current) => 
            current.percentage > (best?.percentage || 0) ? current : best, null);
        
        return (
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {test.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {test.description}
                        </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        test.type === 'live' ? 'bg-red-100 text-red-800' :
                        test.type === 'mock' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {test.type.charAt(0).toUpperCase() + test.type.slice(1)}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{test.duration_formatted}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{test.total_marks} marks</span>
                    </div>
                </div>

                {bestAttempt && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Best Score:</span>
                            <span className={`font-semibold ${getScoreColor(bestAttempt.percentage)}`}>
                                {bestAttempt.percentage}% ({bestAttempt.marks_obtained}/{test.total_marks})
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Attempts: {userAttempts.length}/{test.max_attempts}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {test.question_count} questions
                    </div>
                    <div className="flex space-x-2">
                        {userAttempts.length > 0 && (
                            <Link
                                to={`/student/test-results/${test.id}`}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Eye className="w-4 h-4 inline mr-1" />
                                Results
                            </Link>
                        )}
                        {userAttempts.length < test.max_attempts && (
                            <Link
                                to={`/student/tests/${test.id}/take`}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                            >
                                <Play className="w-4 h-4 inline mr-1" />
                                {userAttempts.length > 0 ? 'Retake' : 'Start Test'}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const AttemptCard = ({ attempt }) => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {attempt.test_title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{attempt.submitted_at_formatted}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">
                        {attempt.marks_obtained}/{attempt.total_marks}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                        {attempt.correct_answers}
                    </div>
                    <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                        {attempt.wrong_answers}
                    </div>
                    <div className="text-xs text-gray-500">Wrong</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-600">
                        {attempt.total_questions - attempt.attempted_questions}
                    </div>
                    <div className="text-xs text-gray-500">Unattempted</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Time taken: {Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s
                </div>
                <Link
                    to={`/student/test-results/${attempt.test_id}/${attempt.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View Details →
                </Link>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Tests</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'available'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Available Tests ({tests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('attempts')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'attempts'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        My Attempts ({attempts.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'available' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <TestCard key={test.id} test={test} />
                    ))}
                    {tests.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500 mb-4">No tests available</div>
                            <Link
                                to="/tests"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Browse all tests
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {attempts.map((attempt) => (
                        <AttemptCard key={attempt.id} attempt={attempt} />
                    ))}
                    {attempts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 mb-4">No test attempts yet</div>
                            <Link
                                to="/tests"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Take your first test
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyTests;