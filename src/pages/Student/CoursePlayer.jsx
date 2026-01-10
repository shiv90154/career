import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  PlayCircle, FileText, Clipboard, 
  ChevronRight, ChevronDown, 
  Clock, Download, CheckCircle,
  Menu, X, BookOpen, BarChart,
  Eye, FileDown, CheckSquare
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import VideoPlayer from '../../components/Common/VideoPlayer';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedVideos, setCompletedVideos] = useState(new Set());

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, categoriesRes] = await Promise.all([
        api.get(`/student/courses/${courseId}`),
        api.get(`/student/courses/${courseId}/content`)
      ]);

      setCourse(courseRes.data);
      const formattedCategories = categoriesRes.data.map(cat => ({
        ...cat,
        completedVideos: cat.videos?.filter(v => v.completed).length || 0,
        totalVideos: cat.videos?.length || 0
      }));
      setCategories(formattedCategories);
      
      // Select first video automatically
      if (formattedCategories.length > 0) {
        const firstCategory = formattedCategories[0];
        setSelectedCategory(firstCategory);
        
        if (firstCategory.videos?.length > 0) {
          setSelectedVideo(firstCategory.videos[0]);
        }
        
        // Expand first category
        setExpandedCategories(new Set([firstCategory.id]));
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/student/courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleVideoSelect = (video, category) => {
    setSelectedVideo(video);
    setSelectedCategory(category);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const markAsCompleted = async (videoId) => {
    try {
      await api.post(`/student/videos/${videoId}/complete`);
      
      // Update local state
      const updatedCategories = categories.map(category => ({
        ...category,
        videos: category.videos?.map(video => 
          video.id === videoId ? { ...video, completed: true } : video
        )
      }));
      
      setCategories(updatedCategories);
      setSelectedVideo(prev => prev?.id === videoId ? { ...prev, completed: true } : prev);
      setCompletedVideos(prev => new Set([...prev, videoId]));
      
      // Show success toast/notification
      // toast.success('Video marked as completed!');
    } catch (error) {
      console.error('Error marking video as completed:', error);
      // toast.error('Failed to mark video as completed');
    }
  };

  const downloadMaterial = async (materialId, fileName) => {
    try {
      const response = await api.get(`/student/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'material.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Show success toast/notification
      // toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading material:', error);
      // toast.error('Download failed');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalVideos = categories.reduce((acc, cat) => acc + (cat.videos?.length || 0), 0);
    const completedVideosCount = categories.reduce((acc, cat) => 
      acc + (cat.videos?.filter(v => v.completed).length || 0), 0
    );
    return totalVideos > 0 ? Math.round((completedVideosCount / totalVideos) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
            {course?.title}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-medium text-gray-600">
            {getProgressPercentage()}% Complete
          </div>
        </div>
      </div>

      <div className="flex pt-14 md:pt-0">
        {/* Sidebar - Mobile Overlay */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:w-96 lg:w-[420px] h-screen overflow-y-auto
        `}>
          <div className="p-6">
            {/* Sidebar Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
              
              {/* Course Progress */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Your Progress</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {getProgressPercentage()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <CheckCircle size={12} className="mr-1 text-green-500" />
                  <span>
                    {categories.reduce((acc, cat) => acc + (cat.videos?.filter(v => v.completed).length || 0), 0)} of{' '}
                    {categories.reduce((acc, cat) => acc + (cat.videos?.length || 0), 0)} videos completed
                  </span>
                </div>
              </div>
            </div>

            {/* Content Tree */}
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        category.type === 'video' ? 'bg-blue-100 text-blue-600' :
                        category.type === 'material' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {category.type === 'video' && <PlayCircle size={18} />}
                        {category.type === 'material' && <FileText size={18} />}
                        {category.type === 'test' && <Clipboard size={18} />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {category.totalVideos} videos • {category.completedVideos} completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500">
                        {expandedCategories.has(category.id) ? 'Hide' : 'Show'}
                      </span>
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform duration-200 ${
                          expandedCategories.has(category.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="border-t border-gray-100 p-2">
                      {/* Videos */}
                      {category.videos?.map((video) => (
                        <div 
                          key={video.id}
                          className={`group flex items-center justify-between p-3 rounded-lg mb-1 cursor-pointer transition-all duration-200 ${
                            selectedVideo?.id === video.id 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                              : 'hover:bg-gray-50'
                          } ${video.completed ? 'opacity-90' : ''}`}
                          onClick={() => handleVideoSelect(video, category)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              video.completed 
                                ? 'bg-green-100 text-green-600' 
                                : selectedVideo?.id === video.id 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              {video.completed ? (
                                <CheckSquare size={14} />
                              ) : (
                                <PlayCircle size={14} />
                              )}
                            </div>
                            <div>
                              <h5 className={`text-sm font-medium ${
                                selectedVideo?.id === video.id ? 'text-blue-700' : 'text-gray-800'
                              }`}>
                                {video.title}
                              </h5>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  {formatDuration(video.duration_seconds)}
                                </span>
                                {video.is_free && (
                                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                    Free
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {video.completed && (
                              <div className="text-xs font-medium text-green-600 flex items-center">
                                <CheckCircle size={12} className="mr-1" />
                                Watched
                              </div>
                            )}
                            <ChevronRight 
                              size={16} 
                              className={`text-gray-400 ${
                                selectedVideo?.id === video.id ? 'text-blue-500' : ''
                              }`}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Study Materials */}
                      {category.materials?.map((material) => (
                        <div 
                          key={material.id}
                          className="group flex items-center justify-between p-3 rounded-lg mb-1 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => downloadMaterial(material.id, material.title)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600">
                              <FileText size={14} />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">
                                {material.title}
                              </h5>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs text-gray-500">
                                  {(material.file_size / 1024 / 1024).toFixed(1)} MB
                                </span>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Download size={10} className="mr-1" />
                                  {material.download_count}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-all">
                            <FileDown size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="mt-8 space-y-3">
              <button 
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                onClick={() => navigate(`/student/courses/${courseId}/tests`)}
              >
                <Clipboard size={18} />
                <span>Take Tests & Assignments</span>
              </button>
              
              <button 
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={() => navigate('/student/courses')}
              >
                <BookOpen size={18} />
                <span>Back to Courses</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Player Area */}
        <div className="flex-1 overflow-y-auto h-screen">
          {selectedVideo ? (
            <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
              {/* Video Container */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-xl mb-6">
                <VideoPlayer 
                  videoId={selectedVideo.id}
                  enrollmentId={course?.enrollment_id}
                  videoData={selectedVideo}
                  onComplete={() => markAsCompleted(selectedVideo.id)}
                />
              </div>

              {/* Video Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{selectedVideo.title}</h1>
                      {selectedVideo.completed && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle size={14} className="mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDuration(selectedVideo.duration_seconds)} minutes
                      </span>
                      <span>•</span>
                      <span>{selectedCategory?.title}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <button 
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                        selectedVideo.completed 
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                      }`}
                      onClick={() => markAsCompleted(selectedVideo.id)}
                      disabled={selectedVideo.completed}
                    >
                      {selectedVideo.completed ? (
                        <>
                          <CheckCircle size={18} />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare size={18} />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {selectedVideo.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 leading-relaxed">{selectedVideo.description}</p>
                    </div>
                  </div>
                )}

                {/* Video Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    ← Previous Lesson
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium">
                    Next Lesson →
                  </button>
                </div>
              </div>

              {/* Related Materials */}
              {selectedCategory?.materials && selectedCategory.materials.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText size={24} className="mr-3 text-blue-600" />
                    Related Study Materials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCategory.materials.map((material) => (
                      <div key={material.id} className="group border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                              <FileText size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{material.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{material.file_type}</p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {material.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500 space-x-3">
                            <span>{(material.file_size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Eye size={12} className="mr-1" />
                              {material.download_count} downloads
                            </span>
                          </div>
                          <button 
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                            onClick={() => downloadMaterial(material.id, material.title)}
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <PlayCircle size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Learning
                </h3>
                <p className="text-gray-600 mb-6">
                  Select a video from the course content to begin your learning journey
                </p>
                <button 
                  className="md:hidden px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium"
                  onClick={() => setSidebarOpen(true)}
                >
                  Browse Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;