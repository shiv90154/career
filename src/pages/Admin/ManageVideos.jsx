import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, Search, Filter, PlayCircle, 
  Lock, Unlock, Clock, Eye, 
  EyeOff, Edit2, Trash2, Download,
  ChevronDown, BarChart3, 
  Users, Calendar, FileText,
  X, CheckCircle, AlertCircle,
  MoreVertical, Grid, List
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
    is_free: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [previewVideo, setPreviewVideo] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters, sortBy]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.course_id !== 'all') params.append('course_id', filters.course_id);
      if (filters.category_id !== 'all') params.append('category_id', filters.category_id);
      if (filters.is_free !== 'all') params.append('is_free', filters.is_free);
      if (filters.status !== 'all') params.append('status', filters.status);
      params.append('sort', sortBy);

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
      setCategories([]);
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

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedVideos.length} videos?`)) {
      try {
        await api.post('/admin/videos/bulk-delete', { videoIds: selectedVideos });
        setVideos(videos.filter(video => !selectedVideos.includes(video.id)));
        setSelectedVideos([]);
      } catch (error) {
        alert('Error deleting videos: ' + error.response?.data?.message);
      }
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await api.post('/admin/videos/bulk-status', { 
        videoIds: selectedVideos, 
        is_active: status 
      });
      setVideos(videos.map(video => 
        selectedVideos.includes(video.id) 
          ? { ...video, is_active: status } 
          : video
      ));
      setSelectedVideos([]);
    } catch (error) {
      alert('Error updating video status');
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.delete(`/admin/videos/${videoId}`);
        setVideos(videos.filter(video => video.id !== videoId));
        setSelectedVideos(selectedVideos.filter(id => id !== videoId));
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

  const handleToggleActive = async (videoId, currentStatus) => {
    try {
      await api.put(`/admin/videos/${videoId}/status`, {
        is_active: !currentStatus
      });
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, is_active: !currentStatus } 
          : video
      ));
    } catch (error) {
      alert('Error updating video status');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const toggleSelectVideo = (videoId) => {
    setSelectedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const selectAllVideos = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(video => video.id));
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const opts = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1
    },
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Videos</h1>
            <p className="text-gray-600 mt-2">Upload and manage video lectures for your courses</p>
          </div>
          <Link 
            to="/admin/videos/new" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Video
          </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <PlayCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-xl font-bold text-gray-900">{videos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {videos.filter(v => v.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <Unlock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Free Videos</p>
                <p className="text-xl font-bold text-gray-900">
                  {videos.filter(v => v.is_free).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-xl font-bold text-gray-900">
                  {videos.reduce((sum, video) => sum + (video.views_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="duration">Duration (Long to Short)</option>
                <option value="title">A to Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={filters.course_id} 
            onChange={(e) => handleCourseChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select 
            value={filters.category_id} 
            onChange={(e) => setFilters({...filters, category_id: e.target.value})}
            disabled={filters.course_id === 'all'}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          <select 
            value={filters.is_free} 
            onChange={(e) => setFilters({...filters, is_free: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Access</option>
            <option value="true">Free Videos</option>
            <option value="false">Paid Videos</option>
          </select>

          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedVideos.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <input
                  type="checkbox"
                  checked={selectedVideos.length === filteredVideos.length}
                  onChange={selectAllVideos}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 font-medium text-gray-700">
                  {selectedVideos.length} video{selectedVideos.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Activate Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters' 
                : 'Add your first video lecture to get started'}
            </p>
            <Link 
              to="/admin/videos/new" 
              className="inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Video
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 group"
            >
              {/* Video Thumbnail */}
              <div 
                className="relative overflow-hidden cursor-pointer" 
                onClick={() => setPreviewVideo(video)}
              >
                <div className="aspect-video bg-gray-900 relative">
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(video.duration_seconds)}
                  </div>

                  {/* Free/Paid Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center ${video.is_free ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>
                    {video.is_free ? (
                      <>
                        <Unlock className="w-3 h-3 mr-1" />
                        Free
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Paid
                      </>
                    )}
                  </div>

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      checked={selectedVideos.includes(video.id)}
                      onChange={() => toggleSelectVideo(video.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 line-clamp-2 mb-1 text-sm md:text-base">{video.title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-3">{video.description}</p>
                  </div>
                </div>

                {/* Video Meta */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(video.is_active ? 'active' : 'inactive')}`}>
                      {video.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">{video.course_title}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{video.views_count || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(video.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleFree(video.id, video.is_free)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${video.is_free ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                  >
                    {video.is_free ? 'Mark Paid' : 'Mark Free'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(video.id, video.is_active)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${video.is_active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                  >
                    {video.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    to={`/admin/videos/edit/${video.id}`}
                    className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedVideos.length === filteredVideos.length}
                      onChange={selectAllVideos}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video.id)}
                        onChange={() => toggleSelectVideo(video.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="relative w-16 h-9 flex-shrink-0 cursor-pointer mr-3"
                          onClick={() => setPreviewVideo(video)}
                        >
                          <img 
                            src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} 
                            alt={video.title}
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <PlayCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{video.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{video.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {video.course_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(video.duration_seconds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {video.views_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${video.is_free ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {video.is_free ? 'Free' : 'Paid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.is_active ? 'active' : 'inactive')}`}>
                        {video.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFree(video.id, video.is_free)}
                          className="text-blue-600 hover:text-blue-900"
                          title={video.is_free ? 'Mark as Paid' : 'Mark as Free'}
                        >
                          {video.is_free ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleActive(video.id, video.is_active)}
                          className="text-gray-600 hover:text-gray-900"
                          title={video.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {video.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <Link
                          to={`/admin/videos/edit/${video.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{previewVideo.title}</h3>
              <button 
                onClick={() => setPreviewVideo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <YouTube 
                  videoId={previewVideo.youtube_id} 
                  opts={opts} 
                  className="rounded-lg overflow-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Video Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Course:</span>
                      <span className="text-sm text-gray-600">{previewVideo.course_title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Category:</span>
                      <span className="text-sm text-gray-600">{previewVideo.category_title || 'No category'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Duration:</span>
                      <span className="text-sm text-gray-600">{formatDuration(previewVideo.duration_seconds)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Access Type:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${previewVideo.is_free ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {previewVideo.is_free ? 'Free' : 'Paid'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Views:</span>
                      <span className="text-sm text-gray-600">{previewVideo.views_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-32">Created:</span>
                      <span className="text-sm text-gray-600">{formatDate(previewVideo.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {previewVideo.description || 'No description provided.'}
                  </p>
                  
                  {previewVideo.tags && previewVideo.tags.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-700 mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {previewVideo.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-3">
                <Link
                  to={`/admin/videos/edit/${previewVideo.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Video
                </Link>
                <button
                  onClick={() => {
                    handleToggleActive(previewVideo.id, previewVideo.is_active);
                    setPreviewVideo(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${previewVideo.is_active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  {previewVideo.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVideos;