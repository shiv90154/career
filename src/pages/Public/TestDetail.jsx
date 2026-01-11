import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Clock, Users, Award, Play, Lock, Calendar, 
    CheckCircle, AlertCircle, BookOpen, Star 
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import PaymentModal from '../../components/Payment/PaymentModal';

const TestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [sampleQuestions, setSampleQuestions] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchTestDetail();
    }, [id]);

    const fetchTestDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/tests/detail.php?id=${id}`);
            const data = response.data;
            
            setTest(data.test);
            setSampleQuestions(data.sample_questions || []);
            setUserStats(data.user_stats);
            setHasAccess(data.has_access);
            setPaymentRequired(data.payment_required);
            setIsAuthenticated(data.is_authenticated);
        } catch (error) {
            toast.error('Failed to fetch test details');
            navigate('/tests');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = () => {
        if (!isAuthenticated) {
            toast.info('Please login to take the test');
            navigate('/login');
            return;
        }

        if (paymentRequired && !hasAccess) {
            setShowPaymentModal(true);
            return;
        }

        if (test.type === 'live' && !test.is_live) {
            toast.error('This live test is not currently active');
            return;
        }

        if (userStats && !userStats.can_attempt) {
            toast.error('You have reached the maximum number of attempts for this test');
            return;
        }

        navigate(`/student/tests/${id}/take`);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setHasAccess(true);
        setPaymentRequired(false);
        toast.success('Payment successful! You can now access the test.');
        fetchTestDetail(); // Refresh data
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">Test not found</div>
                <Link to="/tests" className="text-blue-600 hover:text-blue-800">
                    Back to Tests
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link to="/tests" className="hover:text-gray-700">Tests</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{test.title}</span>
                    </nav>
                    
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {test.title}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {test.description}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                test.type_badge.color === 'blue' ? 'bg-blue-100 text-blue-800' : 
                                test.type_badge.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                test.type_badge.color === 'red' ? 'bg-red-100 text-red-800' :
                                'bg-indigo-100 text-indigo-800'
                            }`}>
                                {test.type_badge.label}
                            </span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                test.difficulty_badge.color === 'green' ? 'bg-green-100 text-green-800' : 
                                test.difficulty_badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {test.difficulty_badge.label}
                            </span>
                            {test.is_premium && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                                    <Lock className="w-4 h-4 inline mr-1" />
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Test Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Test Information</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <div className="text-sm text-gray-600">Duration</div>
                                    <div className="font-semibold">{test.duration_formatted}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                    <div className="text-sm text-gray-600">Questions</div>
                                    <div className="font-semibold">{test.question_count}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Award className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                                    <div className="text-sm text-gray-600">Total Marks</div>
                                    <div className="font-semibold">{test.total_marks}</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                    <div className="text-sm text-gray-600">Max Attempts</div>
                                    <div className="font-semibold">{test.max_attempts}</div>
                                </div>
                            </div>

                            {/* Live Test Info */}
                            {test.type === 'live' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-red-800">
                                                {test.is_live ? 'Live Now!' : 
                                                 test.is_upcoming ? 'Upcoming Live Test' : 'Test Expired'}
                                            </div>
                                            {test.start_time_formatted && (
                                                <div className="text-sm text-red-600">
                                                    {test.start_time_formatted} - {test.end_time_formatted}
                                                </div>
                                            )}
                                        </div>
                                        {test.is_live && (
                                            <div className="flex items-center text-red-600">
                                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                                                <span className="text-sm font-medium">LIVE</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {test.instructions && (
                                <div>
                                    <h3 className="font-semibold mb-2">Instructions</h3>
                                    <div className="text-gray-600 whitespace-pre-line">
                                        {test.instructions}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sample Questions */}
                        {sampleQuestions.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Sample Questions</h2>
                                <div className="space-y-4">
                                    {sampleQuestions.map((question, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                                            <div className="font-medium mb-2">
                                                Q{index + 1}. {question.question_text}
                                            </div>
                                            {question.options && (
                                                <div className="space-y-1">
                                                    {question.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="text-sm text-gray-600">
                                                            {String.fromCharCode(65 + optIndex)}. {option}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {test.is_premium && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <div className="flex items-center">
                                        <Lock className="w-5 h-5 text-yellow-600 mr-2" />
                                        <div>
                                            <div className="font-medium text-yellow-800">Premium Test</div>
                                            <div className="text-sm text-yellow-600">
                                                Price: ₹{test.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* User Stats */}
                            {userStats && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="text-sm font-medium text-blue-800 mb-2">Your Progress</div>
                                    <div className="space-y-1 text-sm text-blue-600">
                                        <div>Attempts: {userStats.total_attempts}/{userStats.max_attempts}</div>
                                        <div>Best Score: {userStats.best_score}% ({userStats.best_marks}/{test.total_marks})</div>
                                        <div>Remaining: {userStats.attempts_remaining} attempts</div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleStartTest}
                                disabled={test.type === 'live' && test.is_expired}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                                    test.type === 'live' && test.is_expired
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {test.type === 'live' && test.is_live ? (
                                    <>
                                        <Play className="w-5 h-5 inline mr-2" />
                                        Join Live Test
                                    </>
                                ) : test.type === 'live' && test.is_upcoming ? (
                                    <>
                                        <Calendar className="w-5 h-5 inline mr-2" />
                                        Register for Test
                                    </>
                                ) : test.type === 'live' && test.is_expired ? (
                                    'Test Expired'
                                ) : paymentRequired && !hasAccess ? (
                                    <>
                                        <Lock className="w-5 h-5 inline mr-2" />
                                        Purchase & Start Test
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 inline mr-2" />
                                        {userStats && userStats.total_attempts > 0 ? 'Retake Test' : 'Start Test'}
                                    </>
                                )}
                            </button>

                            {userStats && userStats.total_attempts > 0 && (
                                <Link
                                    to={`/student/test-results/${id}`}
                                    className="block w-full mt-3 py-2 px-4 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    View Results
                                </Link>
                            )}
                        </div>

                        {/* Test Details */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold mb-4">Test Details</h3>
                            <div className="space-y-3 text-sm">
                                {test.category_name && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="font-medium">{test.category_name}</span>
                                    </div>
                                )}
                                {test.course_title && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Course:</span>
                                        <span className="font-medium">{test.course_title}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Passing Score:</span>
                                    <span className="font-medium">{test.passing_marks} marks</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Negative Marking:</span>
                                    <span className="font-medium">
                                        {test.negative_marking ? `Yes (-${test.negative_marks_per_question})` : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Show Results:</span>
                                    <span className="font-medium">
                                        {test.show_results ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-medium">{test.created_at_formatted}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    item={{
                        type: 'test',
                        id: test.id,
                        title: test.title,
                        price: test.price
                    }}
                />
            )}
        </div>
    );
};

export default TestDetail;