import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Search, Calendar, User, Clock, 
  Tag, ChevronRight, TrendingUp,
  BookOpen, Filter
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        api.get('/public/blogs'),
        api.get('/public/blog-categories')
      ]);

      setBlogs(blogsRes.data);
      setFilteredBlogs(blogsRes.data);
      setCategories(categoriesRes.data);
      
      // Set featured blog (first blog with featured image)
      const featured = blogsRes.data.find(blog => blog.featured_image);
      if (featured) {
        setFeaturedBlog(featured);
      }

      // Get popular blogs (by views)
      const popular = [...blogsRes.data]
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, 5);
      setPopularBlogs(popular);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let result = [...blogs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(result);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="blogs-page">
      {/* Hero Section */}
      <div className="blogs-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Career Path Blog</h1>
            <p className="hero-subtitle">
              Insights, tips, and strategies for competitive exam preparation.
              Stay updated with the latest trends and exam patterns.
            </p>
            
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="blogs-content">
          {/* Main Content */}
          <div className="blogs-main">
            {/* Featured Blog */}
            {featuredBlog && (
              <div className="featured-blog">
                <Link to={`/blogs/${featuredBlog.slug}`} className="featured-link">
                  <div className="featured-image">
                    <img src={featuredBlog.featured_image} alt={featuredBlog.title} />
                    <div className="featured-badge">
                      <TrendingUp size={16} />
                      Featured
                    </div>
                  </div>
                  
                  <div className="featured-content">
                    <div className="featured-category">
                      <span>{featuredBlog.category}</span>
                    </div>
                    
                    <h2>{featuredBlog.title}</h2>
                    
                    <p className="featured-excerpt">
                      {featuredBlog.excerpt}
                    </p>
                    
                    <div className="featured-meta">
                      <div className="meta-item">
                        <User size={14} />
                        <span>{featuredBlog.author_name}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(featuredBlog.published_at)}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{calculateReadTime(featuredBlog.content)} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Categories Filter */}
            <div className="categories-filter">
              <div className="filter-title">
                <Filter size={20} />
                <h3>Browse by Category</h3>
              </div>
              
              <div className="categories-list">
                <button
                  className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Articles
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Blogs Grid */}
            <div className="blogs-grid">
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className="blog-card">
                  <Link to={`/blogs/${blog.slug}`} className="blog-link">
                    <div className="blog-image">
                      <img 
                        src={blog.featured_image || '/default-blog.jpg'} 
                        alt={blog.title}
                      />
                    </div>
                    
                    <div className="blog-content">
                      <div className="blog-category">
                        <span>{blog.category}</span>
                      </div>
                      
                      <h3>{blog.title}</h3>
                      
                      <p className="blog-excerpt">
                        {blog.excerpt}
                      </p>
                      
                      <div className="blog-meta">
                        <div className="meta-item">
                          <User size={12} />
                          <span>{blog.author_name}</span>
                        </div>
                        <div className="meta-item">
                          <Calendar size={12} />
                          <span>{formatDate(blog.published_at)}</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={12} />
                          <span>{calculateReadTime(blog.content)} min read</span>
                        </div>
                      </div>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-tags">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="empty-state">
                <BookOpen size={48} />
                <h3>No articles found</h3>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}

            {/* Pagination */}
            {filteredBlogs.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  Previous
                </button>
                <div className="page-numbers">
                  <span className="current-page">1</span>
                  <span>of</span>
                  <span className="total-pages">3</span>
                </div>
                <button className="pagination-btn">
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="blogs-sidebar">
            {/* Popular Blogs */}
            <div className="sidebar-widget">
              <div className="widget-header">
                <TrendingUp size={20} />
                <h3>Popular Articles</h3>
              </div>
              
              <div className="popular-list">
                {popularBlogs.map((blog) => (
                  <Link 
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className="popular-item"
                  >
                    <div className="popular-content">
                      <h4>{blog.title}</h4>
                      <div className="popular-meta">
                        <span>{formatDate(blog.published_at)}</span>
                        <span>•</span>
                        <span>{calculateReadTime(blog.content)} min read</span>
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <div className="widget-header">
                <BookOpen size={20} />
                <h3>Categories</h3>
              </div>
              
              <div className="categories-list-sidebar">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blogs?category=${category.slug}`}
                    className="category-item"
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.blog_count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="sidebar-widget newsletter">
              <div className="widget-header">
                <h3>Stay Updated</h3>
                <p>Subscribe to our newsletter for exam tips and updates</p>
              </div>
              
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Tags */}
            <div className="sidebar-widget">
              <div className="widget-header">
                <Tag size={20} />
                <h3>Popular Tags</h3>
              </div>
              
              <div className="tags-list">
                {['UPSC', 'SSC', 'Banking', 'Patwari', 'HPPSC', 'Teaching', 'GK', 'Current Affairs'].map((tag, index) => (
                  <a key={index} href="#" className="tag">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="blogs-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Want to write for us?</h2>
            <p>Share your insights and experiences with thousands of exam aspirants.</p>
            <Link to="/contact" className="btn btn-accent">
              Contribute Article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;