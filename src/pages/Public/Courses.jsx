import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Search, Filter, BookOpen, Clock, 
  Users, TrendingUp, Star, IndianRupee,
  ChevronDown, CheckCircle, Award,
  X, Zap, Sparkles, Tag, Target,
  BarChart, Shield, Headphones, Video,
  Calendar, ArrowRight, ChevronLeft, ChevronRight,
  GraduationCap, Medal, Target as TargetIcon,
  ThumbsUp, Download, Eye
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    price: 'all',
    sort: 'popular'
  });
  const [showFilters, setShowFilters] = useState(true);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12;

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchPopularTags();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, filters, searchTerm]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/public/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await api.get('/public/tags');
      setPopularTags(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const filterCourses = () => {
    let result = [...courses];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(course => course.category === filters.category);
    }

    // Level filter
    if (filters.level !== 'all') {
      result = result.filter(course => course.level === filters.level);
    }

    // Price filter
    if (filters.price === 'free') {
      result = result.filter(course => course.price === 0);
    } else if (filters.price === 'paid') {
      result = result.filter(course => course.price > 0);
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // popular
        result.sort((a, b) => b.enrollment_count - a.enrollment_count);
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'beginner': return <Zap size={12} />;
      case 'intermediate': return <TargetIcon size={12} />;
      case 'advanced': return <Sparkles size={12} />;
      default: return <BookOpen size={12} />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: 'all',
      level: 'all',
      price: 'all',
      sort: 'popular'
    });
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              <span>Premium Exam Preparation</span>
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Expert-Led Courses
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful candidates in their journey to government jobs 
              with our premium exam preparation courses designed by expert faculty.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-12">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2">
                <div className="flex items-center">
                  <div className="flex-1 flex items-center">
                    <Search className="ml-4 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search courses by name, category, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0 px-4 py-3"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
                    Search
                  </button>
                </div>
              </div>
              
              {/* Popular Tags */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {popularTags.slice(0, 5).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 bg-white/5 backdrop-blur-sm text-gray-300 text-sm rounded-full hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {courses.length}+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Courses Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {courses.reduce((acc, course) => acc + course.enrollment_count, 0)}+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Students Enrolled
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  100+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Expert Instructors
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  95%
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${!showFilters ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Filter className="text-gray-700" size={20} />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Course name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setFilters({...filters, category: 'all'})}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        filters.category === 'all' 
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setFilters({...filters, category: category.slug})}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          filters.category === category.slug 
                            ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {category.course_count || 0}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                      <button
                        key={level}
                        onClick={() => setFilters({...filters, level})}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.level === level
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['all', 'free', 'paid'].map(price => (
                      <button
                        key={price}
                        onClick={() => setFilters({...filters, price})}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.price === price
                            ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {price === 'all' ? 'All' : price.charAt(0).toUpperCase() + price.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>

                {/* Popular Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Popular Tags
                    </label>
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Available Courses
                  <span className="text-gray-500 text-lg font-normal ml-2">
                    ({filteredCourses.length} courses found)
                  </span>
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse through our comprehensive collection of exam preparation courses
                </p>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg"
              >
                <Filter size={18} />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>

            {/* Courses Grid */}
            {currentCourses.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-200"
                    >
                      {/* Course Image */}
                      <div className="relative overflow-hidden h-48">
                        <img 
                          src={course.thumbnail || '/default-course.jpg'} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Overlay Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {course.is_featured && (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 text-xs font-bold rounded-full">
                              <Star size={12} fill="currentColor" />
                              <span>Featured</span>
                            </span>
                          )}
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 border text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                            {getLevelIcon(course.level)}
                            <span className="capitalize">{course.level}</span>
                          </span>
                        </div>
                        
                        {/* Enrollment Count */}
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
                            <Users size={12} />
                            <span>{course.enrollment_count} enrolled</span>
                          </span>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-500">
                            {course.category || 'General Studies'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-900">
                              {course.rating || 4.5}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({course.review_count || 0})
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {course.short_description}
                        </p>

                        {/* Duration */}
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <Clock size={16} className="mr-2" />
                          <span>{course.duration_days} days • {course.total_hours || 30} hours</span>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {course.features?.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            {course.price === 0 ? (
                              <span className="text-2xl font-bold text-green-600">Free</span>
                            ) : course.discount_price ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(course.discount_price)}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                  {formatCurrency(course.price)}
                                </span>
                                {course.discount_percentage && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                    {course.discount_percentage}% OFF
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(course.price)}
                              </span>
                            )}
                          </div>

                          <Link 
                            to={`/courses/${course.id}`}
                            className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 hover:shadow-lg group-hover:shadow-lg"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mb-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          currentPage === index + 1
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No courses found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Categories Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Browse by Category
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Explore courses by specific exam categories
                  </p>
                </div>
                <Link 
                  to="/categories"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>View All</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    to={`/courses?category=${category.slug}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-yellow-500"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:from-yellow-500 group-hover:to-yellow-600 transition-all duration-300">
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {category.course_count || 0} courses
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white mb-16">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold mb-4">
                  Our Advantages
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Choose
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                    {" "}Career Path Institute?
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Expert Faculty</h4>
                  <p className="text-gray-300 text-sm">
                    Learn from experienced faculty who have helped thousands succeed
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Proven Results</h4>
                  <p className="text-gray-300 text-sm">
                    High success rate with structured curriculum and assessments
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Video size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Flexible Learning</h4>
                  <p className="text-gray-300 text-sm">
                    24/7 access to course materials and video recordings
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-yellow-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Headphones size={24} className="text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Doubt Support</h4>
                  <p className="text-gray-300 text-sm">
                    Regular live doubt sessions and one-on-one mentorship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;