import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, Folder, FolderOpen, Video, FileText, 
  Clipboard, ChevronRight, ChevronDown, 
  Edit2, Trash2, Move
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
    if (type === 'video') return <Video size={16} />;
    if (type === 'material') return <FileText size={16} />;
    if (type === 'test') return <Clipboard size={16} />;
    return isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />;
  };

  const getTypeName = (type) => {
    switch(type) {
      case 'video': return 'Video Lectures';
      case 'material': return 'Study Materials';
      case 'test': return 'Mock Tests';
      default: return 'Category';
    }
  };

  const renderCategoryTree = (parentId = null, level = 0) => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(category => {
        const hasChildren = categories.some(cat => cat.parent_id === category.id);
        const isExpanded = expandedItems.has(category.id);
        
        return (
          <React.Fragment key={category.id}>
            <div 
              className="category-item" 
              style={{ paddingLeft: `${level * 24}px` }}
            >
              <div className="category-content">
                <button 
                  className="expand-btn"
                  onClick={() => toggleExpand(category.id)}
                  disabled={!hasChildren}
                >
                  {hasChildren ? (
                    isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  ) : (
                    <div style={{ width: '16px' }} />
                  )}
                </button>
                
                <div className="category-icon">
                  {getIcon(category.type, isExpanded)}
                </div>
                
                <div className="category-info">
                  <div className="category-header">
                    <h4>{category.title}</h4>
                    <span className="category-type">{getTypeName(category.type)}</span>
                  </div>
                  <p className="category-description">{category.description}</p>
                  <div className="category-meta">
                    <span className="course-name">
                      Course: {category.course_title}
                    </span>
                    <span className="item-count">
                      {category.item_count || 0} items
                    </span>
                  </div>
                </div>

                <div className="category-actions">
                  <button 
                    className="icon-btn"
                    onClick={() => handleEdit(category)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="icon-btn danger"
                    onClick={() => handleDelete(category.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {isExpanded && renderCategoryTree(category.id, level + 1)}
          </React.Fragment>
        );
      });
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="manage-categories">
      <div className="page-header">
        <h1>Manage Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course *</label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
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

              <div className="form-group">
                <label>Type *</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                >
                  <option value="video">Video Lectures</option>
                  <option value="material">Study Materials</option>
                  <option value="test">Mock Tests</option>
                </select>
              </div>

              <div className="form-group">
                <label>Parent Category (Optional)</label>
                <select 
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    parent_id: e.target.value || null
                  })}
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
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData, 
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({
                    ...formData, 
                    slug: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({
                    ...formData, 
                    description: e.target.value
                  })}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Tree View */}
      <div className="categories-tree">
        {categories.filter(cat => !cat.parent_id).length === 0 ? (
          <div className="empty-state">
            <h3>No categories yet</h3>
            <p>Create your first category to organize course content</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Create Category
            </button>
          </div>
        ) : (
          <div className="tree-container">
            {renderCategoryTree()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;