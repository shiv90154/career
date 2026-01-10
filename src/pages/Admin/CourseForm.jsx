import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
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
  const [instructors, setInstructors] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  
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
    instructor_id: '',
    category: '',
    prerequisites: '',
    what_you_will_learn: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
    fetchInstructors();
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

  const fetchInstructors = async () => {
    try {
      const response = await api.get('/admin/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.course_code.trim()) {
      errors.course_code = 'Course code is required';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }
    
    if (formData.discount_price && parseFloat(formData.discount_price) > parseFloat(formData.price)) {
      errors.discount_price = 'Discount price cannot be greater than regular price';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          thumbnail: 'Please upload a JPG, PNG, or WebP image'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          thumbnail: 'Image size should be less than 5MB'
        }));
        return;
      }

      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
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
      const errorMessage = error.response?.data?.message || 'Error saving course';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/courses')}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEdit 
                  ? 'Update course details and content'
                  : 'Fill in the details to create a new course'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isEdit 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isEdit ? 'Edit Mode' : 'New Course'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Code *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="course_code"
                          value={formData.course_code}
                          onChange={handleInputChange}
                          className={`pl-10 w-full rounded-lg border ${
                            formErrors.course_code 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                          placeholder="CP-PATWARI-2024"
                        />
                      </div>
                      {formErrors.course_code && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.course_code}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">Unique identifier for the course</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Level *
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all-levels">All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                      placeholder="Patwari Complete Preparation Course"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300">
                        /courses/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className={`flex-1 rounded-r-lg border ${
                          formErrors.slug 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                        placeholder="patwari-complete-preparation"
                        required
                      />
                    </div>
                    {formErrors.slug && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">Used in course URL</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      rows="3"
                      maxLength="500"
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                      placeholder="Brief description for course card (max 500 characters)"
                      required
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">Appears on course cards and previews</p>
                      <span className={`text-sm ${
                        formData.short_description.length >= 450 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        {formData.short_description.length}/500
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="8"
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                      placeholder="Detailed course description with features, syllabus, learning outcomes, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What You Will Learn
                    </label>
                    <textarea
                      name="what_you_will_learn"
                      value={formData.what_you_will_learn}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                      placeholder="Enter each learning outcome on a new line"
                    />
                    <p className="mt-1 text-sm text-gray-500">One learning outcome per line</p>
                  </div>
                </div>
              </div>

              {/* Pricing & Duration Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Pricing & Duration</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`pl-10 w-full rounded-lg border ${
                          formErrors.price 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                        required
                      />
                    </div>
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="discount_price"
                        value={formData.discount_price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`pl-10 w-full rounded-lg border ${
                          formErrors.discount_price 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                      />
                    </div>
                    {formErrors.discount_price && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.discount_price}</p>
                    )}
                    {formData.discount_price && (
                      <p className="mt-2 text-sm text-green-600">
                        Discount: {((1 - formData.discount_price / formData.price) * 100).toFixed(0)}% off
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Days) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="duration_days"
                        value={formData.duration_days}
                        onChange={handleInputChange}
                        min="1"
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Hours *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="total_hours"
                        value={formData.total_hours}
                        onChange={handleInputChange}
                        min="1"
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail Upload Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Upload className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Course Thumbnail</h2>
                </div>
                
                <div className="space-y-4">
                  {previewUrl ? (
                    <div className="relative group">
                      <img 
                        src={previewUrl} 
                        alt="Course thumbnail" 
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button 
                        type="button" 
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WebP (Max. 5MB)
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: 800×450px
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {formErrors.thumbnail && (
                    <p className="text-sm text-red-600">{formErrors.thumbnail}</p>
                  )}
                </div>
              </div>

              {/* Course Settings Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Course Settings</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor
                    </label>
                    <select
                      name="instructor_id"
                      value={formData.instructor_id}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    >
                      <option value="">Select Instructor</option>
                      {instructors.map(instructor => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    >
                      <option value="">Select Category</option>
                      <option value="government-exams">Government Exams</option>
                      <option value="professional">Professional Courses</option>
                      <option value="skill-development">Skill Development</option>
                      <option value="competitive">Competitive Exams</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="is_featured" className="ml-2 flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">Featured Course</span>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="is_active" className="ml-2 flex items-center">
                        <Info className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-gray-700">Active Course</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-600 mb-2">
                      <Info className="w-4 h-4 mr-2" />
                      <span className="text-sm">Course Status</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      formData.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Save className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Save Course</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Ready to publish</h4>
                    <p className="text-sm text-blue-600">
                      {isEdit 
                        ? 'Update the course with your changes'
                        : 'Create and publish this new course'
                      }
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <LoadingSpinner small light />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          {isEdit ? 'Update Course' : 'Create Course'}
                        </>
                      )}
                    </button>

                    <button 
                      type="button" 
                      onClick={() => navigate('/admin/courses')}
                      className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg shadow hover:shadow-md transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;