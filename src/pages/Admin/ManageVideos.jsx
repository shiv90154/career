import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, Search, Filter, PlayCircle, 
  Lock, Unlock, Clock, Eye, 
  EyeOff, Edit2, Trash2, Download
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import YouTube from 'react-youtube';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    course_id: 'all',
    category_id: 'all',
    is_free: 'all'
  });
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.course_id !== 'all') params.append('course_id', filters.course_id);
      if (filters.category_id !== 'all') params.append('category_id', filters.category_id);
      if (filters.is_free !== 'all') params.append('is_free', filters.is_free);

      const [videosRes, coursesRes] = await Promise.all([
        api.get(`/admin/videos?${params.toString()}`),
        api.get('/admin/courses?simple=true')
      ]);

      setVideos(videosRes.data);
      setCourses(coursesRes.data);
      
      if (filters.course_id !== 'all') {
        fetchCategories(filters.course_id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (courseId) => {
    try {
      const response = await api.get(`/admin/categories?course_id=${courseId}&type=video`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCourseChange = (courseId) => {
    setFilters({
      ...filters,
      course_id: courseId,
      category_id: 'all'
    });
    if (courseId !== 'all') {
      fetchCategories(courseId);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/admin/videos/${videoId}`);
        setVideos(videos.filter(video => video.id !== videoId));
      } catch (error) {
        alert('Error deleting video: ' + error.response?.data?.message);
      }
    }
  };

  const handleToggleFree = async (videoId, currentStatus) => {
    try {
      await api.put(`/admin/videos/${videoId}/free`, {
        is_free: !currentStatus
      });
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, is_free: !currentStatus } 
          : video
      ));
    } catch (error) {
      alert('Error updating video status');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const opts = {
    height: '200',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1
    },
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-videos">
      <div className="page-header">
        <h1>Manage Videos</h1>
        <Link to="/admin/videos/new" className="btn btn-primary">
          <Plus size={20} />
          Add New Video
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <Filter size={16} />
            <select 
              value={filters.course_id} 
              onChange={(e) => handleCourseChange(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={filters.category_id} 
              onChange={(e) => setFilters({...filters, category_id: e.target.value})}
              disabled={filters.course_id === 'all'}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select 
              value={filters.is_free} 
              onChange={(e) => setFilters({...filters, is_free: e.target.value})}
            >
              <option value="all">All Access</option>
              <option value="true">Free Videos</option>
              <option value="false">Paid Videos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="videos-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail" onClick={() => setPreviewVideo(video)}>
              <img 
                src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`} 
                alt={video.title}
              />
              <div className="play-overlay">
                <PlayCircle size={32} />
              </div>
              <div className="video-duration">
                <Clock size={12} />
                <span>{formatDuration(video.duration_seconds)}</span>
              </div>
              <div className={`video-access ${video.is_free ? 'free' : 'paid'}`}>
                {video.is_free ? <Unlock size={12} /> : <Lock size={12} />}
                <span>{video.is_free ? 'Free' : 'Paid'}</span>
              </div>
            </div>

            <div className="video-info">
              <h4>{video.title}</h4>
              <p className="video-description">
                {video.description?.substring(0, 100)}
                {video.description?.length > 100 ? '...' : ''}
              </p>
              
              <div className="video-meta">
                <div className="meta-item">
                  <span className="course-name">{video.course_title}</span>
                </div>
                <div className="meta-item">
                  <span className="category-name">{video.category_title}</span>
                </div>
                <div className="meta-item">
                  <Eye size={14} />
                  <span>{video.views_count || 0} views</span>
                </div>
              </div>
            </div>

            <div className="video-actions">
              <button 
                className="icon-btn"
                onClick={() => handleToggleFree(video.id, video.is_free)}
                title={video.is_free ? 'Mark as Paid' : 'Mark as Free'}
              >
                {video.is_free ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
              <Link to={`/admin/videos/edit/${video.id}`} className="icon-btn">
                <Edit2 size={16} />
              </Link>
              <button 
                className="icon-btn danger"
                onClick={() => handleDelete(video.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="empty-state">
          <h3>No videos found</h3>
          <p>Add your first video lecture</p>
          <Link to="/admin/videos/new" className="btn btn-primary">
            <Plus size={20} />
            Add Video
          </Link>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="modal-overlay" onClick={() => setPreviewVideo(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{previewVideo.title}</h3>
              <button className="close-btn" onClick={() => setPreviewVideo(null)}>
                &times;
              </button>
            </div>
            
            <div className="video-preview">
              <YouTube 
                videoId={previewVideo.youtube_id} 
                opts={opts} 
              />
            </div>

            <div className="video-preview-info">
              <div className="preview-meta">
                <span>Course: {previewVideo.course_title}</span>
                <span>Category: {previewVideo.category_title}</span>
                <span>Access: {previewVideo.is_free ? 'Free' : 'Paid'}</span>
              </div>
              <p>{previewVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVideos;