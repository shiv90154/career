import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Filter,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Mail,
  PenTool,
  Sparkles,
  Zap,
  Award,
  Target,
  BarChart,
  Headphones,
  X,
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  Hash,
  ArrowUpRight,
  Users,
  ExternalLink,
} from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const blogsPerPage = 9;

  useEffect(() => {
    fetchBlogs();
    // Load bookmarks from localStorage
    const savedBookmarks =
      JSON.parse(localStorage.getItem("blogBookmarks")) || [];
    setBookmarkedBlogs(savedBookmarks);
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        api.get("/public/blogs.php"),
        api.get("/public/blog-categories.php"),
      ]);

      setBlogs(blogsRes.data);
      setFilteredBlogs(blogsRes.data);
      setCategories(categoriesRes.data);

      // Set featured blog (first blog with featured image)
      const featured =
        blogsRes.data.find((blog) => blog.is_featured) || blogsRes.data[0];
      if (featured) {
        setFeaturedBlog(featured);
      }

      // Get popular blogs (by views)
      const popular = [...blogsRes.data]
        .sort((a, b) => b.view_count - a.view_count)
        .slice(0, 5);
      setPopularBlogs(popular);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let result = [...blogs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.excerpt.toLowerCase().includes(term) ||
          blog.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((blog) => blog.category === selectedCategory);
    }

    setFilteredBlogs(result);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(" ").length || 0;
    return Math.ceil(wordCount / wordsPerMinute) || 3;
  };

  const toggleBookmark = (blogId) => {
    let updatedBookmarks;
    if (bookmarkedBlogs.includes(blogId)) {
      updatedBookmarks = bookmarkedBlogs.filter((id) => id !== blogId);
    } else {
      updatedBookmarks = [...bookmarkedBlogs, blogId];
    }
    setBookmarkedBlogs(updatedBookmarks);
    localStorage.setItem("blogBookmarks", JSON.stringify(updatedBookmarks));
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-semibold mb-6">
              <PenTool size={16} />
              <span>Career Insights & Strategies</span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Career Path
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Institute Blog
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Expert insights, exam strategies, and preparation tips for
              competitive exam aspirants. Stay updated with the latest trends
              and exam patterns.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2">
                <div className="flex items-center">
                  <div className="flex-1 flex items-center">
                    <Search className="ml-4 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search articles by title, category, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0 px-4 py-3"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <button className="ml-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {blogs.length}+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Articles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {categories.length}+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  50K+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Monthly Views
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  100+
                </div>
                <div className="text-gray-300 text-sm uppercase tracking-wider">
                  Expert Writers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Featured Blog */}
            {featuredBlog && (
              <div className="mb-12">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0">
                    <img
                      src={featuredBlog.featured_image || "/default-blog.jpg"}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  </div>

                  <div className="relative p-8 md:p-12 lg:p-16">
                    <div className="max-w-2xl">
                      <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-semibold mb-4">
                        <Sparkles size={16} />
                        <span>Featured Article</span>
                      </span>

                      <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 border border-white/20">
                        <Hash size={14} />
                        <span className="capitalize">
                          {featuredBlog.category}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        {featuredBlog.title}
                      </h2>

                      <p className="text-lg text-gray-300 mb-8 line-clamp-3">
                        {featuredBlog.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-gray-900 font-bold">
                            {featuredBlog.author_name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {featuredBlog.author_name}
                            </div>
                            <div className="text-sm text-gray-300">Author</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span className="text-sm">
                              {formatDate(featuredBlog.published_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span className="text-sm">
                              {calculateReadTime(featuredBlog.content)} min read
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye size={16} />
                            <span className="text-sm">
                              {featuredBlog.view_count || 0} views
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/blogs/${featuredBlog.slug}`}
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Filter */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Filter className="text-gray-700" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Browse by Category
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset Filters
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  All Articles
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category.slug
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{category.name}</span>
                      <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                        {category.blog_count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Latest Articles
                  <span className="text-gray-500 text-lg font-normal ml-2">
                    ({filteredBlogs.length} articles)
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">
                  Expert insights and exam preparation strategies
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const bookmarked = blogs.filter((blog) =>
                      bookmarkedBlogs.includes(blog.id)
                    );
                    setFilteredBlogs(bookmarked);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <BookmarkCheck size={18} />
                  <span>Bookmarks ({bookmarkedBlogs.length})</span>
                </button>
              </div>
            </div>

            {/* Blogs Grid */}
            {currentBlogs.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {currentBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-200"
                    >
                      <Link to={`/blogs/${blog.slug}`} className="block">
                        {/* Blog Image */}
                        <div className="relative overflow-hidden h-48">
                          <img
                            src={blog.featured_image || "/default-blog.jpg"}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                              <Hash size={12} />
                              <span className="capitalize">
                                {blog.category}
                              </span>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleBookmark(blog.id);
                              }}
                              className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                              {bookmarkedBlogs.includes(blog.id) ? (
                                <BookmarkCheck
                                  size={16}
                                  className="text-yellow-400"
                                />
                              ) : (
                                <Bookmark size={16} />
                              )}
                            </button>
                            <button className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Blog Content */}
                        <div className="p-6">
                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                            {blog.excerpt}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {blog.author_name?.charAt(0) || "A"}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {blog.author_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(blog.published_at)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                              <Clock size={14} />
                              <span>{calculateReadTime(blog.content)} min</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {blog.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  <Tag size={10} />
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mb-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                      <span>Previous</span>
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          currentPage === index + 1
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ChevronRight size={18} />
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
                  No articles found
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Popular Blogs Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Popular Articles
                  </h3>
                  <p className="text-sm text-gray-600">Most read this week</p>
                </div>
              </div>

              <div className="space-y-4">
                {popularBlogs.map((blog, index) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{calculateReadTime(blog.content)} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Categories
                  </h3>
                  <p className="text-sm text-gray-600">Browse by topic</p>
                </div>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blogs?category=${category.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                        <Hash
                          size={14}
                          className="text-gray-600 group-hover:text-yellow-600"
                        />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.blog_count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-300 text-sm">
                  Get weekly exam tips and strategies
                </p>
              </div>

              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  Subscribe Now
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Tags Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Tag size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Popular Tags
                  </h3>
                  <p className="text-sm text-gray-600">Trending topics</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "UPSC",
                  "SSC CGL",
                  "Banking PO",
                  "Patwari",
                  "HPPSC",
                  "Teaching Exams",
                  "Current Affairs",
                  "GK",
                  "Math Tricks",
                  "English Grammar",
                ].map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <PenTool size={40} className="text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Want to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
                Write for Us?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Share your insights and experiences with thousands of exam
              aspirants. Join our community of expert writers and educators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all duration-300"
              >
                <span>Submit Article</span>
                <ArrowUpRight size={20} />
              </Link>

              <Link
                to="/blogs/author-guidelines"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <span>View Guidelines</span>
                <ExternalLink size={20} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">₹5K</div>
                <div className="text-gray-300">Per Featured Article</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">100K+</div>
                <div className="text-gray-300">Monthly Readers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">Expert</div>
                <div className="text-gray-300">Editorial Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
