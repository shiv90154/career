import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Lock, Eye, Star, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import PaymentModal from '../../components/Payment/PaymentModal';

const CurrentAffairDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentAffair, setCurrentAffair] = useState(null);
    const [relatedAffairs, setRelatedAffairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchCurrentAffairDetail();
    }, [id]);

    const fetchCurrentAffairDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/current-affairs/detail.php?id=${id}`);
            const data = response.data;
            
            setCurrentAffair(data.current_affair);
            setRelatedAffairs(data.related_affairs || []);
            setHasAccess(data.has_access);
            setPaymentRequired(data.payment_required);
            setIsAuthenticated(data.is_authenticated);
        } catch (error) {
            toast.error('Failed to fetch current affair details');
            navigate('/current-affairs');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!isAuthenticated) {
            toast.info('Please login to purchase premium content');
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setHasAccess(true);
        setPaymentRequired(false);
        toast.success('Payment successful! You can now access the full content.');
        fetchCurrentAffairDetail(); // Refresh data
    };

    const getImportanceBadge = (level) => {
        const badges = {
            low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
            medium: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Medium' },
            high: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'High' },
            critical: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' }
        };
        
        const badge = badges[level] || badges.medium;
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentAffair) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">Current affair not found</div>
                <Link to="/current-affairs" className="text-blue-600 hover:text-blue-800">
                    Back to Current Affairs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link to="/current-affairs" className="hover:text-gray-700">Current Affairs</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{currentAffair.title}</span>
                    </nav>
                    
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500">
                                <Calendar className="w-5 h-5 mr-2" />
                                <span>{currentAffair.date_formatted}</span>
                            </div>
                            {currentAffair.category && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {currentAffair.category}
                                </span>
                            )}
                            {getImportanceBadge(currentAffair.importance_level)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {currentAffair.is_premium && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                                    <Lock className="w-4 h-4 inline mr-1" />
                                    Premium
                                </span>
                            )}
                            <div className="flex items-center text-gray-500 text-sm">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{currentAffair.views_count} views</span>
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900">
                        {currentAffair.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* Premium Content Warning */}
                            {currentAffair.is_preview && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start">
                                        <Lock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-yellow-800 mb-1">
                                                Premium Content Preview
                                            </div>
                                            <div className="text-sm text-yellow-700 mb-3">
                                                This is a preview of premium content. Purchase to read the full article.
                                            </div>
                                            <button
                                                onClick={handlePurchase}
                                                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                                            >
                                                Purchase for ₹{currentAffair.price}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="prose max-w-none">
                                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {currentAffair.content}
                                </div>
                            </div>

                            {/* Tags */}
                            {currentAffair.tags && currentAffair.tags.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {currentAffair.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Source */}
                            {currentAffair.source && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        <span className="font-medium">Source:</span> {currentAffair.source}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Purchase Card */}
                        {currentAffair.is_premium && !hasAccess && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-semibold mb-4">Premium Content</h3>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">
                                        ₹{currentAffair.price}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        Get full access to this premium current affair
                                    </div>
                                    <button
                                        onClick={handlePurchase}
                                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Lock className="w-4 h-4 inline mr-2" />
                                        Purchase Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Related Current Affairs */}
                        {relatedAffairs.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-semibold mb-4">Related Current Affairs</h3>
                                <div className="space-y-4">
                                    {relatedAffairs.map((affair) => (
                                        <Link
                                            key={affair.id}
                                            to={`/current-affairs/${affair.id}`}
                                            className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                                                    {affair.title}
                                                </h4>
                                                <ArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{affair.date_formatted}</span>
                                                {affair.is_premium && (
                                                    <div className="flex items-center text-yellow-600">
                                                        <Lock className="w-3 h-3 mr-1" />
                                                        <span>₹{affair.price}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/current-affairs"
                                    className="block w-full py-2 px-4 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Browse All Current Affairs
                                </Link>
                                <Link
                                    to="/tests"
                                    className="block w-full py-2 px-4 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Take Practice Tests
                                </Link>
                                <Link
                                    to="/materials"
                                    className="block w-full py-2 px-4 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Study Materials
                                </Link>
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
                        type: 'current_affair',
                        id: currentAffair.id,
                        title: currentAffair.title,
                        price: currentAffair.price
                    }}
                />
            )}
        </div>
    );
};

export default CurrentAffairDetail;