import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Calendar, User, Clock, Tag,
  Share2, Facebook, Twitter, Linkedin,
  Bookmark, ThumbsUp, MessageCircle,
  ChevronLeft, ChevronRight, Eye,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const fetchBlogDetails = async () => {
    try {
      const [blogRes, relatedRes, commentsRes] = await Promise.all([
        api.get(`/public/blogs/${slug}`),
        api.get(`/public/blogs/${slug}/related`),
        api.get(`/public/blogs/${slug}/comments`)
      ]);

      setBlog(blogRes.data);
      setRelatedBlogs(relatedRes.data);
      setComments(commentsRes.data);
      setLikes(blogRes.data.likes || 0);
      
      // Increment view count
      await api.post(`/public/blogs/${slug}/view`);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;
    
    try {
      await api.post(`/public/blogs/${blog.id}/like`);
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (hasBookmarked) {
        await api.delete(`/public/blogs/${blog.id}/bookmark`);
      } else {
        await api.post(`/public/blogs/${blog.id}/bookmark`);
      }
      setHasBookmarked(!hasBookmarked);
    } catch (error) {
      console.error('Error bookmarking blog:', error);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const response = await api.post(`/public/blogs/${blog.id}/comment`, {
        content: commentText
      });
      
      setComments(prev => [response.data, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
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
    <div className="blog-detail">
      {/* Blog Header */}
      <div className="blog-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/blogs">
              <ChevronLeft size={16} />
              Back to Blog
            </Link>
          </div>

          <div className="header-content">
            <div className="blog-category">
              <span>{blog.category}</span>
            </div>
            
            <h1>{blog.title}</h1>
            
            <div className="blog-meta-large">
              <div className="meta-item">
                <User size={18} />
                <div className="meta-content">
                  <span className="label">Written by</span>
                  <span className="value">{blog.author_name}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <Calendar size={18} />
                <div className="meta-content">
                  <span className="label">Published on</span>
                  <span className="value">{formatDate(blog.published_at)}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <Clock size={18} />
                <div className="meta-content">
                  <span className="label">Read time</span>
                  <span className="value">{calculateReadTime(blog.content)} min read</span>
                </div>
              </div>
              
              <div className="meta-item">
                <Eye size={18} />
                <div className="meta-content">
                  <span className="label">Views</span>
                  <span className="value">{blog.view_count}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featured_image && (
              <div className="featured-image">
                <img src={blog.featured_image} alt={blog.title} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="blog-content-wrapper">
          {/* Main Content */}
          <div className="blog-main">
            {/* Article Content */}
            <article className="article-content">
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags">
                <div className="tags-header">
                  <Tag size={20} />
                  <h3>Tags</h3>
                </div>
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <Link key={index} to={`/blogs?tag=${tag}`} className="tag">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="action-bar">
              <div className="action-left">
                <button 
                  className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={20} />
                  <span>Like ({likes})</span>
                </button>
                
                <button 
                  className="action-btn"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle size={20} />
                  <span>Comment ({comments.length})</span>
                </button>
                
                <button 
                  className={`action-btn bookmark-btn ${hasBookmarked ? 'bookmarked' : ''}`}
                  onClick={handleBookmark}
                >
                  <Bookmark size={20} />
                  <span>{hasBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
              
              <div className="action-right">
                <span className="share-label">Share:</span>
                <button 
                  className="share-btn"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook size={18} />
                </button>
                <button 
                  className="share-btn"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter size={18} />
                </button>
                <button 
                  className="share-btn"
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin size={18} />
                </button>
                <button 
                  className="share-btn"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="author-bio">
              <div className="author-avatar">
                {blog.author_image ? (
                  <img src={blog.author_image} alt={blog.author_name} />
                ) : (
                  <User size={40} />
                )}
              </div>
              <div className="author-details">
                <h3>{blog.author_name}</h3>
                <p className="author-title">{blog.author_title}</p>
                <p className="author-description">{blog.author_bio}</p>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                
                {/* Comment Form */}
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows="3"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Post Comment
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <div className="comment-author">
                          <div className="author-avatar-small">
                            {comment.author_initials}
                          </div>
                          <div className="author-info">
                            <h4>{comment.author_name}</h4>
                            <span className="comment-date">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="comment-content">
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="no-comments">
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="blog-navigation">
              <div className="nav-section">
                {blog.previous_blog && (
                  <Link to={`/blogs/${blog.previous_blog.slug}`} className="nav-link prev">
                    <ChevronLeft size={20} />
                    <div className="nav-content">
                      <span className="nav-label">Previous Article</span>
                      <h4>{blog.previous_blog.title}</h4>
                    </div>
                  </Link>
                )}
              </div>
              
              <div className="nav-section">
                {blog.next_blog && (
                  <Link to={`/blogs/${blog.next_blog.slug}`} className="nav-link next">
                    <div className="nav-content">
                      <span className="nav-label">Next Article</span>
                      <h4>{blog.next_blog.title}</h4>
                    </div>
                    <ChevronRight size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="blog-sidebar">
            {/* Table of Contents */}
            {blog.table_of_contents && (
              <div className="sidebar-widget toc">
                <div className="widget-header">
                  <h3>Table of Contents</h3>
                </div>
                <div className="toc-list">
                  {blog.table_of_contents.map((item, index) => (
                    <a 
                      key={index}
                      href={`#${item.id}`}
                      className="toc-item"
                    >
                      <span className="toc-number">{index + 1}.</span>
                      <span className="toc-title">{item.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            <div className="sidebar-widget">
              <div className="widget-header">
                <TrendingUp size={20} />
                <h3>Related Articles</h3>
              </div>
              
              <div className="related-list">
                {relatedBlogs.map((relatedBlog) => (
                  <Link 
                    key={relatedBlog.id}
                    to={`/blogs/${relatedBlog.slug}`}
                    className="related-item"
                  >
                    <div className="related-image">
                      <img 
                        src={relatedBlog.featured_image || '/default-blog.jpg'} 
                        alt={relatedBlog.title}
                      />
                    </div>
                    <div className="related-content">
                      <h4>{relatedBlog.title}</h4>
                      <div className="related-meta">
                        <span>{formatDate(relatedBlog.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="sidebar-widget newsletter">
              <div className="widget-header">
                <h3>Get Exam Tips</h3>
                <p>Subscribe for regular updates and study strategies</p>
              </div>
              
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Popular Tags */}
            <div className="sidebar-widget">
              <div className="widget-header">
                <Tag size={20} />
                <h3>Popular Tags</h3>
              </div>
              
              <div className="tags-list-sidebar">
                {blog.tags?.slice(0, 10).map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/blogs?tag=${tag}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="blog-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Looking for Exam Preparation Courses?</h2>
            <p>Explore our comprehensive courses designed by expert faculty.</p>
            <Link to="/courses" className="btn btn-accent">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;