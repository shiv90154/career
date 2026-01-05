import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  PlayCircle, FileText, Clipboard, 
  ChevronRight, ChevronDown, 
  Clock, Download, CheckCircle,
  Menu, X, BookOpen, BarChart
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
      setCategories(categoriesRes.data);
      
      // Select first video automatically
      if (categoriesRes.data.length > 0) {
        const firstCategory = categoriesRes.data[0];
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

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
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
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  const downloadMaterial = async (materialId) => {
    try {
      const response = await api.get(`/student/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['filename'] || 'material.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="course-player">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2>{course?.title}</h2>
      </div>

      <div className="player-container">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <div className="course-progress">
              <span>{course?.progress_percentage || 0}% Complete</span>
              <div className="progress-bar small">
                <div 
                  className="progress-fill" 
                  style={{ width: `${course?.progress_percentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="content-tree">
            {categories.map((category) => (
              <div key={category.id} className="category-section">
                <div 
                  className="category-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="category-title">
                    <div className="category-icon">
                      {category.type === 'video' && <PlayCircle size={16} />}
                      {category.type === 'material' && <FileText size={16} />}
                      {category.type === 'test' && <Clipboard size={16} />}
                    </div>
                    <h4>{category.title}</h4>
                  </div>
                  
                  <div className="category-meta">
                    <span className="item-count">
                      {category.videos?.length || category.materials?.length || 0} items
                    </span>
                    <span className="expand-icon">
                      {expandedCategories.has(category.id) ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </span>
                  </div>
                </div>

                {expandedCategories.has(category.id) && (
                  <div className="category-content">
                    {/* Videos */}
                    {category.videos?.map((video) => (
                      <div 
                        key={video.id}
                        className={`content-item ${selectedVideo?.id === video.id ? 'active' : ''} ${video.completed ? 'completed' : ''}`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="item-icon">
                          <PlayCircle size={14} />
                        </div>
                        <div className="item-info">
                          <h5>{video.title}</h5>
                          <div className="item-meta">
                            <span className="duration">
                              <Clock size={12} />
                              {formatDuration(video.duration_seconds)}
                            </span>
                            {video.completed && (
                              <span className="completed-badge">
                                <CheckCircle size={12} />
                                Watched
                              </span>
                            )}
                          </div>
                        </div>
                        {video.is_free && (
                          <span className="free-badge">Free</span>
                        )}
                      </div>
                    ))}

                    {/* Study Materials */}
                    {category.materials?.map((material) => (
                      <div 
                        key={material.id}
                        className="content-item material"
                        onClick={() => downloadMaterial(material.id)}
                      >
                        <div className="item-icon">
                          <FileText size={14} />
                        </div>
                        <div className="item-info">
                          <h5>{material.title}</h5>
                          <div className="item-meta">
                            <span className="file-size">
                              {(material.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span className="download-count">
                              {material.download_count} downloads
                            </span>
                          </div>
                        </div>
                        <button className="download-btn">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button 
              className="btn btn-outline"
              onClick={() => navigate(`/student/courses/${courseId}/tests`)}
            >
              <Clipboard size={16} />
              Take Tests
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/student/courses')}
            >
              <BookOpen size={16} />
              Back to Courses
            </button>
          </div>
        </div>

        {/* Main Player Area */}
        <div className="player-main">
          {selectedVideo ? (
            <>
              <div className="video-container">
                <VideoPlayer 
                  videoId={selectedVideo.id}
                  enrollmentId={course?.enrollment_id}
                  videoData={selectedVideo}
                />
              </div>

              <div className="video-details">
                <div className="video-header">
                  <h2>{selectedVideo.title}</h2>
                  {selectedVideo.completed && (
                    <span className="completed-label">
                      <CheckCircle size={16} />
                      Completed
                    </span>
                  )}
                </div>
                
                <div className="video-description">
                  <p>{selectedVideo.description}</p>
                </div>

                <div className="video-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => markAsCompleted(selectedVideo.id)}
                    disabled={selectedVideo.completed}
                  >
                    {selectedVideo.completed ? 'Already Completed' : 'Mark as Completed'}
                  </button>
                  
                  <div className="video-navigation">
                    <button className="nav-btn" disabled>
                      Previous
                    </button>
                    <button className="nav-btn">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Materials */}
              {selectedCategory?.materials && selectedCategory.materials.length > 0 && (
                <div className="related-materials">
                  <h3>Related Study Materials</h3>
                  <div className="materials-list">
                    {selectedCategory.materials.map((material) => (
                      <div key={material.id} className="material-card">
                        <FileText size={20} />
                        <div className="material-info">
                          <h4>{material.title}</h4>
                          <p>{material.description}</p>
                          <div className="material-meta">
                            <span>{material.file_type}</span>
                            <span>{(material.file_size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => downloadMaterial(material.id)}
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-video-selected">
              <div className="empty-state">
                <PlayCircle size={48} />
                <h3>Select a video to start learning</h3>
                <p>Choose from the course content on the left side</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;