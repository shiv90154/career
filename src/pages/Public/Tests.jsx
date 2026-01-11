import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Award, Filter, Play, Lock, Calendar } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [showLiveOnly, setShowLiveOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ categories: [], types: [], difficulty_levels: [] });

    useEffect(() => {
        fetchTests();
    }, [currentPage, selectedType, selectedCategory, selectedDifficulty, showLiveOnly]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 12,
                ...(selectedType && { type: selectedType }),
                ...(selectedCategory && { category_id: selectedCategory }),
                ...(selectedDifficulty && { difficulty: selectedDifficulty }),
                ...(showLiveOnly && { live_only: true })
            });

            console.log('Fetching tests with params:', params.toString());
            const response = await api.get(`/tests/index.php?${params}`);
            console.log('Tests API response:', response.data);
            
            setTests(response.data.tests || []);
            setPagination(response.data.pagination || {});
            setFilters(response.data.filters || { categories: [], types: [], difficulty_levels: [] });
        } catch (error) {
            console.error('Failed to fetch tests:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSelectedType('');
        setSelectedCategory('');
        setSelectedDifficulty('');
        setShowLiveOnly(false);
        setCurrentPage(1);
    };

    const TestCard = ({ test }) => (
        <div className="card overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-heading mb-2">
                            {test.title}
                        </h3>
                        <p className="text-body text-sm line-clamp-2">
                            {test.description}
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.type_badge.color === 'blue' ? 'bg-blue-100 text-blue-800' : 
                            test.type_badge.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            test.type_badge.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-indigo-100 text-indigo-800'}`}>
                            {test.type_badge.label}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.difficulty_badge.color === 'green' ? 'bg-green-100 text-green-800' : 
                            test.difficulty_badge.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                            {test.difficulty_badge.label}
                        </span>
                    </div>
                </div>

                {/* Test Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-body">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{test.duration_formatted}</span>
                    </div>
                    <div className="flex items-center text-sm text-body">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{test.total_marks} marks</span>
                    </div>
                    <div className="flex items-center text-sm text-body">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{test.attempt_count} attempts</span>
                    </div>
                    <div className="flex items-center text-sm text-body">
                        <span className="w-4 h-4 mr-2 text-center">#</span>
                        <span>{test.question_count} questions</span>
                    </div>
                </div>

                {/* Live Test Info */}
                {test.type === 'live' && (
                    <div className="mb-4 p-3 bg-highlight/10 border border-highlight/20 rounded-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-highlight">
                                    {test.is_live ? 'Live Now!' : 
                                     test.is_upcoming ? 'Upcoming' : 'Expired'}
                                </div>
                                <div className="text-xs text-highlight-light">
                                    {test.start_time_formatted} - {test.end_time_formatted}
                                </div>
                            </div>
                            {test.is_live && (
                                <div className="flex items-center text-highlight">
                                    <div className="w-2 h-2 bg-highlight rounded-full animate-pulse mr-2"></div>
                                    <span className="text-xs font-medium">LIVE</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Category and Course */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        {test.category_name && (
                            <span className="badge-primary">
                                {test.category_name}
                            </span>
                        )}
                        {test.course_title && (
                            <span className="badge-accent">
                                {test.course_title}
                            </span>
                        )}
                    </div>
                    {test.is_premium && (
                        <div className="flex items-center text-accent-dark">
                            <Lock className="w-4 h-4 mr-1" />
                            <span className="text-xs">Premium</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted">
                        Max attempts: {test.max_attempts}
                    </div>
                    <Link
                        to={`/tests/${test.id}`}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            test.type === 'live' && !test.is_live && !test.is_upcoming
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'btn-primary'
                        }`}
                    >
                        {test.type === 'live' && test.is_live ? (
                            <>
                                <Play className="w-4 h-4 inline mr-1" />
                                Join Live Test
                            </>
                        ) : test.type === 'live' && test.is_upcoming ? (
                            <>
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Register
                            </>
                        ) : test.type === 'live' && test.is_expired ? (
                            'Expired'
                        ) : (
                            'View Details'
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-light-grey">
            {/* Hero Section */}
            <div className="gradient-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Practice Tests</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Test your knowledge with our comprehensive practice tests and mock exams at Career Pathway Shimla
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
                                Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="form-input"
                            >
                                <option value="">All Types</option>
                                {filters.types.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label">
                                Difficulty
                            </label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="form-input"
                            >
                                <option value="">All Levels</option>
                                {filters.difficulty_levels.map((level) => (
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
                                    checked={showLiveOnly}
                                    onChange={(e) => setShowLiveOnly(e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-body">Live Tests Only</span>
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

                {/* Tests Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading-spinner"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {tests.map((test) => (
                                <TestCard key={test.id} test={test} />
                            ))}
                        </div>

                        {tests.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-muted mb-4">No tests found</div>
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

export default Tests;