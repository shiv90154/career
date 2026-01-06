import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Save, Upload, X } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    course_code: '',
    title: '',
    slug: '',
    description: '',
    short_description: '',
    price: 0,
    discount_price: '',
    duration_days: 30,
    total_hours: 40,
    level: 'beginner',
    is_featured: false,
    is_active: true,
    instructor_id: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/admin/courses/${id}`);
      const course = response.data;
      setFormData(course);
      if (course.thumbnail) {
        setPreviewUrl(`${process.env.REACT_APP_API_URL}/uploads/${course.thumbnail}`);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreviewUrl('');
    setFormData({ ...formData, thumbnail: '' });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append thumbnail if new
      if (thumbnail) {
        formDataToSend.append('thumbnail_file', thumbnail);
      }

      if (isEdit) {
        await api.put(`/admin/courses/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/courses', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.message || 'Error saving course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="course-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="course_code">Course Code *</label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                required
                placeholder="e.g., CP-PATWARI-2024"
              />
              <small>Unique identifier for the course</small>
            </div>

            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="e.g., Patwari Complete Preparation Course"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">URL Slug *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="patwari-complete-preparation"
              />
              <small>Used in course URL: /courses/{formData.slug}</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="discount_price">Discount Price (₹)</label>
                <input
                  type="number"
                  id="discount_price"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration_days">Duration (Days) *</label>
                <input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="total_hours">Total Hours *</label>
                <input
                  type="number"
                  id="total_hours"
                  name="total_hours"
                  value={formData.total_hours}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="level">Course Level *</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-section">
            <div className="form-group">
              <label>Course Thumbnail</label>
              <div className="file-upload-area">
                {previewUrl ? (
                  <div className="thumbnail-preview">
                    <img src={previewUrl} alt="Course thumbnail" />
                    <button 
                      type="button" 
                      onClick={removeThumbnail}
                      className="remove-thumbnail"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <Upload size={24} />
                    <span>Click to upload thumbnail</span>
                    <span className="upload-hint">Recommended: 800x450px, JPG/PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="short_description">Short Description *</label>
              <textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                rows="3"
                maxLength="500"
                placeholder="Brief description for course card (max 500 chars)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Full Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="8"
                placeholder="Detailed course description with features, syllabus, etc."
                required
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                <span>Featured Course</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>Active Course</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/admin/courses')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <LoadingSpinner small />
            ) : (
              <>
                <Save size={20} />
                {isEdit ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;