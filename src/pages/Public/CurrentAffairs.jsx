import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Star, Lock, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CurrentAffairs = () => {
    const [currentAffairs, setCurrentAffairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedImportance, setSelectedImportance] = useState('');
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ categories: [], importance_levels: [] });

    useEffect(() => {
        fetchCurrentAffairs();
    }, [currentPage, selectedCategory, selectedDate, selectedImportance, showPremiumOnly]);

    const fetchCurrentAffairs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...(selectedCategory && { category: selectedCategory }),
                ...(selectedDate && { date: selectedDate }),
                ...(selectedImportance && { importance: selectedImportance }),
                ...(showPremiumOnly && { premium: true })
            });

            console.log('Fetching current affairs with params:', params.toString());
            const response = await api.get(`/current-affairs/index.php?${params}`);
            console.log('Current Affairs API response:', response.data);
            
            setCurrentAffairs(response.data.current_affairs || []);
            setPagination(response.data.pagination || {});
            setFilters(response.data.filters || { categories: [], importance_levels: [] });
        } catch (error) {
            console.error('Failed to fetch current affairs:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to fetch current affairs');
        } finally {
            setLoading(false);
        }
    };

    const getImportanceBadge = (level) => {
        const badges = {
            low: { bg: 'bg-primary/10', text: 'text-primary', label: 'Low' },
            medium: { bg: 'bg-primary/20', text: 'text-primary', label: 'Medium' },
            high: { bg: 'bg-accent/20', text: 'text-primary', label: 'High' },
            critical: { bg: 'bg-highlight/10', text: 'text-highlight', label: 'Critical' }
        };
        
        const badge = badges[level] || badges.medium;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedDate('');
        setSelectedImportance('');
        setShowPremiumOnly(false);
        setCurrentPage(1);
    };

    const CurrentAffairCard = ({ affair }) => (
        <Link 
            to={`/current-affairs/${affair.id}`}
            className="block card hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted">{affair.date_formatted}</span>
                    {affair.category && (
                        <span className="badge-primary">
                            {affair.category}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {getImportanceBadge(affair.importance_level)}
                    {affair.is_premium && (
                        <div className="flex items-center text-accent-dark">
                            <Lock className="w-4 h-4 mr-1" />
                            <span className="text-xs">Premium</span>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-heading mb-3">
                {affair.title}
            </h3>

            <div className="text-body mb-4">
                {affair.is_preview ? (
                    <div>
                        <p>{affair.content}</p>
                        <div className="mt-2 p-3 bg-accent/10 border border-accent/20 rounded-md">
                            <div className="flex items-center">
                                <Lock className="w-4 h-4 text-primary mr-2" />
                                <span className="text-sm text-primary">
                                    This is a premium content. Subscribe to read full article.
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>{affair.content}</p>
                )}
            </div>

            {affair.tags && affair.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {affair.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {affair.source && (
                <div className="text-xs text-muted border-t pt-3">
                    Source: {affair.source}
                </div>
            )}
        </Link>
    );

    return (
        <div className="min-h-screen bg-light-grey">
            {/* Hero Section */}
            <div className="gradient-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Current Affairs</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Stay updated with the latest news and current events at Career Pathway Shimla
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters */}
                <div className="card mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="form-label">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-input"
                            >
                                <option value="">All Categories</option>
                                {filters.categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Importance
                            </label>
                            <select
                                value={selectedImportance}
                                onChange={(e) => setSelectedImportance(e.target.value)}
                                className="form-input"
                            >
                                <option value="">All Levels</option>
                                {filters.importance_levels.map((level) => (
                                    <option key={level} value={level}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={showPremiumOnly}
                                    onChange={(e) => setShowPremiumOnly(e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-body">Premium Only</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-muted hover:text-primary"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Current Affairs List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6 mb-8">
                            {currentAffairs.map((affair) => (
                                <CurrentAffairCard key={affair.id} affair={affair} />
                            ))}
                        </div>

                        {currentAffairs.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-muted mb-4">No current affairs found</div>
                                <button
                                    onClick={clearFilters}
                                    className="text-primary hover:text-primary-light"
                                >
                                    Clear filters and try again
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                            <div className="flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 border border-primary/20 rounded-md hover:bg-primary/5 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    
                                    {[...Array(Math.min(5, pagination.total_pages))].map((_, index) => {
                                        const page = index + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 border rounded-md ${
                                                    currentPage === page
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'border-primary/20 hover:bg-primary/5'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                                        disabled={currentPage === pagination.total_pages}
                                        className="px-3 py-2 border border-primary/20 rounded-md hover:bg-primary/5 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CurrentAffairs;