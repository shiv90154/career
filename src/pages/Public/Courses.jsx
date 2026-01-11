import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users, BookOpen } from 'lucide-react';
import api from '../../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: '',
        price: ''
    });
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [currentPage, filters]);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await api.get('/categories/index.php');
            console.log('Categories API response:', response.data);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            console.error('Error details:', error.response?.data);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 12,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
            });

            console.log('Fetching courses with params:', params.toString());
            const response = await api.get(`/courses/index.php?${params}`);
            console.log('Courses API response:', response.data);
            
            setCourses(response.data.courses || []);
            setPagination(response.data.pagination || {});
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            level: '',
            price: ''
        });
        setCurrentPage(1);
    };

    const formatPrice = (price, discountPrice) => {
        if (price === 0) return 'Free';
        if (discountPrice && discountPrice < price) {
            return (
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-success">₹{discountPrice}</span>
                    <span className="text-sm line-through text-muted">₹{price}</span>
                </div>
            );
        }
        return <span className="text-lg font-bold text-primary">₹{price}</span>;
    };

    const getLevelBadgeColor = (level) => {
        const colors = {
            beginner: 'bg-success/10 text-success',
            intermediate: 'bg-accent/20 text-primary',
            advanced: 'bg-highlight/10 text-highlight'
        };
        return colors[level] || colors.beginner;
    };

    return (
        <div className="min-h-screen bg-light-grey">
            {/* Header */}
            <div className="gradient-primary text-white">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        All Courses
                    </h1>
                    <p className="text-xl text-blue-100">
                        Discover courses that will help you build your career with Career Pathway Shimla
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="card sticky top-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-heading">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-primary hover:text-primary-light text-sm"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="form-label">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="form-input pl-10"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="form-label">
                                    Category
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Level */}
                            <div className="mb-6">
                                <label className="form-label">
                                    Level
                                </label>
                                <select
                                    value={filters.level}
                                    onChange={(e) => handleFilterChange('level', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <label className="form-label">
                                    Price
                                </label>
                                <select
                                    value={filters.price}
                                    onChange={(e) => handleFilterChange('price', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">All Prices</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-muted">
                                {pagination.total_items ? (
                                    `Showing ${pagination.total_items} courses`
                                ) : (
                                    'Loading courses...'
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="card overflow-hidden animate-pulse">
                                        <div className="w-full h-48 bg-primary/10"></div>
                                        <div className="p-6">
                                            <div className="h-4 bg-primary/10 rounded mb-2"></div>
                                            <div className="h-6 bg-primary/10 rounded mb-2"></div>
                                            <div className="h-4 bg-primary/10 rounded mb-4"></div>
                                            <div className="flex justify-between">
                                                <div className="h-6 w-16 bg-primary/10 rounded"></div>
                                                <div className="h-8 w-24 bg-primary/10 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : courses.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <div key={course.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                                            <img
                                                src={course.thumbnail || '/api/placeholder/400/200'}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="badge-primary">
                                                        {course.category_name}
                                                    </span>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${getLevelBadgeColor(course.level)}`}>
                                                        {course.level}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-lg font-semibold text-heading mb-2 line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                
                                                <p className="text-body text-sm mb-4 line-clamp-2">
                                                    {course.short_description}
                                                </p>

                                                <div className="flex items-center text-sm text-muted mb-4 space-x-4">
                                                    <div className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {course.enrollment_count || 0}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <BookOpen className="w-4 h-4 mr-1" />
                                                        {course.total_lessons || 0} lessons
                                                    </div>
                                                    {course.duration_hours && (
                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {course.duration_hours}h
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-accent fill-current" />
                                                        <span className="text-sm text-body ml-1">
                                                            {course.rating_avg || '4.5'} ({course.rating_count || 0})
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted">
                                                        By {course.instructor_name}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {formatPrice(course.price, course.discount_price)}
                                                    <Link
                                                        to={`/courses/${course.id}`}
                                                        className="btn-primary"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.total_pages > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <nav className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-2 text-sm font-medium text-muted bg-white border border-primary/20 rounded-md hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            
                                            {[...Array(Math.min(5, pagination.total_pages))].map((_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                            currentPage === page
                                                                ? 'bg-primary text-white'
                                                                : 'text-muted bg-white border border-primary/20 hover:bg-primary/5'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                                                disabled={currentPage === pagination.total_pages}
                                                className="px-3 py-2 text-sm font-medium text-muted bg-white border border-primary/20 rounded-md hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 mx-auto text-muted mb-4" />
                                <h3 className="text-lg font-medium text-heading mb-2">No courses found</h3>
                                <p className="text-body mb-4">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={clearFilters}
                                    className="btn-primary"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;