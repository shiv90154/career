import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Search, Filter, BookOpen, Clock, 
  Users, TrendingUp, Star, IndianRupee,
  ChevronDown, CheckCircle, Award
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
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
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
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <div className="courses-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Explore Our Courses</h1>
            <p className="hero-subtitle">
              Premium exam preparation courses designed by expert faculty. 
              Join thousands of successful candidates in their journey to government jobs.
            </p>
            
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search courses by name, category, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">
                Search
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <BookOpen size={24} />
                <div>
                  <h3>{courses.length}+</h3>
                  <p>Courses Available</p>
                </div>
              </div>
              <div className="stat">
                <Users size={24} />
                <div>
                  <h3>{courses.reduce((acc, course) => acc + course.enrollment_count, 0)}+</h3>
                  <p>Students Enrolled</p>
                </div>
              </div>
              <div className="stat">
                <Award size={24} />
                <div>
                  <h3>100+</h3>
                  <p>Expert Instructors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <div className="filter-title">
              <Filter size={20} />
              <h2>Filter Courses</h2>
              <button 
                className="toggle-filters"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown className={showFilters ? 'rotate-180' : ''} size={16} />
              </button>
            </div>
            <div className="results-count">
              <span>{filteredCourses.length} courses found</span>
            </div>
          </div>

          {showFilters && (
            <div className="filters-grid">
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Level</label>
                <select 
                  value={filters.level}
                  onChange={(e) => setFilters({...filters, level: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Price</label>
                <select 
                  value={filters.price}
                  onChange={(e) => setFilters({...filters, price: e.target.value})}
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  value={filters.sort}
                  onChange={(e) => setFilters({...filters, sort: e.target.value})}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <img 
                  src={course.thumbnail || '/default-course.jpg'} 
                  alt={course.title}
                />
                <div className="course-overlay">
                  {course.is_featured && (
                    <span className="featured-badge">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                  <span className={`level-badge ${getLevelBadgeColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <div className="course-rating">
                    <Star size={16} fill="#F7E600" color="#F7E600" />
                    <span>{course.rating || 4.5}</span>
                    <span className="rating-count">({course.review_count || 0})</span>
                  </div>
                </div>

                <p className="course-description">
                  {course.short_description}
                </p>

                <div className="course-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{course.duration_days} days • {course.total_hours} hours</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{course.enrollment_count} enrolled</span>
                  </div>
                </div>

                <div className="course-features">
                  {course.features?.slice(0, 3).map((feature, index) => (
                    <div key={index} className="feature">
                      <CheckCircle size={14} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="course-footer">
                  <div className="price-section">
                    {course.price === 0 ? (
                      <span className="free-price">Free</span>
                    ) : course.discount_price ? (
                      <>
                        <span className="original-price">{formatCurrency(course.price)}</span>
                        <span className="discount-price">{formatCurrency(course.discount_price)}</span>
                        {course.discount_percentage && (
                          <span className="discount-badge">
                            {course.discount_percentage}% off
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="price">{formatCurrency(course.price)}</span>
                    )}
                  </div>

                  <Link to={`/courses/${course.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: 'all',
                  level: 'all',
                  price: 'all',
                  sort: 'popular'
                });
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Categories Section */}
        <div className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/courses?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-icon">
                  <BookOpen size={24} />
                </div>
                <div className="category-content">
                  <h4>{category.name}</h4>
                  <p>{category.course_count || 0} courses</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-section">
          <h2>Why Choose Career Path Institute?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Award size={32} />
              </div>
              <h3>Expert Faculty</h3>
              <p>Learn from experienced faculty who have helped thousands of students succeed.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Proven Results</h3>
              <p>High success rate with our structured curriculum and regular assessments.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Clock size={32} />
              </div>
              <h3>Flexible Learning</h3>
              <p>Learn at your own pace with 24/7 access to course materials and recordings.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={32} />
              </div>
              <h3>Doubt Support</h3>
              <p>Regular live doubt sessions and one-on-one mentorship available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;