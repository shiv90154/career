import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchBlogDetail();
        }
    }, [slug]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/blogs/detail.php?slug=${slug}`);
            setBlog(response.data.blog);
            setRelatedBlogs(response.data.related_blogs || []);
        } catch (error) {
            toast.error('Failed to fetch blog details');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
                    <Link to="/blogs" className="text-blue-600 hover:text-blue-800">
                        ← Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    to="/blogs"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                </Link>

                {/* Blog Content */}
                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Featured Image */}
                    {blog.featured_image && (
                        <div className="aspect-w-16 aspect-h-9">
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        {/* Category */}
                        {blog.category_name && (
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                                {blog.category_name}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-4">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{blog.created_at_formatted}</span>
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>{blog.author_name}</span>
                            </div>
                            <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{blog.views_count} views</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                            </button>
                        </div>

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none mb-8"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="border-t pt-6">
                                <div className="flex items-center flex-wrap gap-2">
                                    <Tag className="w-4 h-4 text-gray-500" />
                                    {blog.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Info */}
                        {blog.author_bio && (
                            <div className="border-t pt-6 mt-6">
                                <div className="flex items-start space-x-4">
                                    {blog.author_image && (
                                        <img
                                            src={blog.author_image}
                                            alt={blog.author_name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {blog.author_name}
                                        </h3>
                                        <p className="text-gray-600 mt-1">{blog.author_bio}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <div
                                    key={relatedBlog.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {relatedBlog.featured_image && (
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                src={relatedBlog.featured_image}
                                                alt={relatedBlog.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                            <Link
                                                to={`/blogs/${relatedBlog.slug}`}
                                                className="text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                {relatedBlog.title}
                                            </Link>
                                        </h3>
                                        {relatedBlog.excerpt && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                                {relatedBlog.excerpt}
                                            </p>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            {relatedBlog.created_at_formatted}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;