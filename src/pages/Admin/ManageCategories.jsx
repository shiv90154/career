import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Plus, Folder, FolderOpen, Video, FileText, 
  Clipboard, ChevronRight, ChevronDown, 
  Edit2, Trash2, Move, Layers, BookOpen,
  Hash, FileCode, Package, Search, Filter,
  AlertCircle, HelpCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dragOverId, setDragOverId] = useState(null);

  const [formData, setFormData] = useState({
    course_id: '',
    parent_id: null,
    title: '',
    slug: '',
    description: '',
    type: 'video'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        api.get('/admin/courses?simple=true'),
        api.get('/admin/categories')
      ]);
      setCourses(coursesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (type, isExpanded = false) => {
    const iconClass = "w-5 h-5";
    
    if (type === 'video') return <Video className={`${iconClass} text-blue-500`} />;
    if (type === 'material') return <FileText className={`${iconClass} text-green-500`} />;
    if (type === 'test') return <Clipboard className={`${iconClass} text-purple-500`} />;
    return isExpanded 
      ? <FolderOpen className={`${iconClass} text-yellow-500`} />
      : <Folder className={`${iconClass} text-yellow-500`} />;
  };

  const getTypeName = (type) => {
    switch(type) {
      case 'video': return 'Video Lectures';
      case 'material': return 'Study Materials';
      case 'test': return 'Mock Tests';
      default: return 'Category';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch(type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'material': return 'bg-green-100 text-green-800';
      case 'test': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      course_id: category.course_id,
      parent_id: category.parent_id,
      title: category.title,
      slug: category.slug,
      description: category.description,
      type: category.type
    });
    setSelectedCourse(category.course_id);
    setSelectedType(category.type);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category and all its contents? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/categories/${id}`);
      fetchData();
    } catch (error) {
      alert('Error deleting category: ' + error.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        course_id: selectedCourse,
        type: selectedType
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, data);
      } else {
        await api.post('/admin/categories', data);
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        course_id: '',
        parent_id: null,
        title: '',
        slug: '',
        description: '',
        type: 'video'
      });
      fetchData();
    } catch (error) {
      alert('Error saving category: ' + error.response?.data?.message);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = searchTerm === '' || 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || category.course_id == filterCourse;
    const matchesType = filterType === 'all' || category.type === filterType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  const renderCategoryTree = (parentId = null, level = 0) => {
    return filteredCategories
      .filter(cat => cat.parent_id === parentId)
      .map(category => {
        const hasChildren = filteredCategories.some(cat => cat.parent_id === category.id);
        const isExpanded = expandedItems.has(category.id);
        const course = courses.find(c => c.id == category.course_id);
        
        return (
          <React.Fragment key={category.id}>
            <div 
              className={`group relative flex items-center px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 ${
                dragOverId === category.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              style={{ paddingLeft: `${level * 32 + 16}px` }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(category.id);
              }}
              onDragLeave={() => setDragOverId(null)}
            >
              {/* Expand/Collapse Button */}
              <button 
                className={`p-1 mr-2 rounded hover:bg-gray-200 transition-colors ${
                  !hasChildren ? 'invisible' : ''
                }`}
                onClick={() => toggleExpand(category.id)}
              >
                {isExpanded ? 
                  <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {/* Drag Handle */}
              <div className="mr-3 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <Move className="w-4 h-4 text-gray-400" />
              </div>

              {/* Category Icon */}
              <div className="mr-3">
                {getIcon(category.type, isExpanded)}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {category.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeBadgeClass(category.type)}`}>
                    {getTypeName(category.type)}
                  </span>
                  {category.is_featured && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course?.title || 'No Course'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {category.slug}
                  </span>
                  {category.item_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {category.item_count} items
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(category)}
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => handleDelete(category.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            {isExpanded && (
              <div className="animate-fadeIn">
                {renderCategoryTree(category.id, level + 1)}
              </div>
            )}
          </React.Fragment>
        );
      });
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
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-8 h-8 text-blue-600" />
                Content Categories
              </h1>
              <p className="text-gray-600 mt-2">
                Organize videos, materials, and tests into hierarchical categories
              </p>
            </div>
            
            <button 
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Category
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Folder className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter(c => c.type === 'video').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video Lectures</option>
                  <option value="material">Study Materials</option>
                  <option value="test">Mock Tests</option>
                </select>

                <button className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Tree */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Category Structure
              </h2>
              <div className="text-sm text-gray-600">
                Drag and drop to reorganize
              </div>
            </div>
          </div>

          {filteredCategories.filter(cat => !cat.parent_id).length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filterCourse !== 'all' || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first category to organize course content'
                }
              </p>
              <button 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {renderCategoryTree()}
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editingCategory ? 
                      <Edit2 className="w-6 h-6 text-blue-600" /> : 
                      <Plus className="w-6 h-6 text-blue-600" />
                    }
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {editingCategory ? 'Update category details' : 'Add a new category to organize content'}
                    </p>
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                >
                  <span className="text-2xl text-gray-500">&times;</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select 
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type *
                  </label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                    required
                  >
                    <option value="video">Video Lectures</option>
                    <option value="material">Study Materials</option>
                    <option value="test">Mock Tests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select 
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    parent_id: e.target.value || null
                  })}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(cat => cat.course_id == selectedCourse && cat.type === selectedType)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))
                  }
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to create a root category
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData, 
                    title: e.target.value,
                    slug: e.target.value.toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '')
                  })}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                  placeholder="e.g., Mathematics Basics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 text-sm">
                    /content/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({
                      ...formData, 
                      slug: e.target.value
                    })}
                    className="flex-1 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({
                    ...formData, 
                    description: e.target.value
                  })}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors"
                  placeholder="Brief description of what this category contains..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button 
                  type="button"
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;