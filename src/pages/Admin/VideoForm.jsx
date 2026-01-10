import React, { useState, useEffect } from "react";
import { Save, Upload, X, Edit, Trash2, Plus, Search, Filter } from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import axios from "axios";


const VideosForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    youtube_id: "",
    category_id: "",
    description: "",
    duration: "",
    is_featured: false,
    is_active: true,
    order_index: 0
  });

  const [formErrors, setFormErrors] = useState({});

  // 创建不带授权头的 axios 实例
  const apiWithoutAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost/career-path-api/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiWithoutAuth.get("/admin/videos/manage.php");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      alert("Error loading videos data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // 假设有一个获取分类的API
      // 如果没有，可以暂时注释掉或使用静态数据
      // const response = await apiWithoutAuth.get('/admin/categories/manage.php');
      // setCategories(response.data);
      
      // 临时静态分类数据
      setCategories([
        { id: 1, title: "Mathematics" },
        { id: 2, title: "Science" },
        { id: 3, title: "History" },
        { id: 4, title: "Programming" }
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.youtube_id.trim()) {
      errors.youtube_id = "YouTube ID is required";
    } else if (!/^[a-zA-Z0-9_-]{11}$/.test(formData.youtube_id)) {
      errors.youtube_id = "Invalid YouTube ID (should be 11 characters)";
    }

    if (!formData.category_id) {
      errors.category_id = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const videoData = {
        ...formData,
        is_featured: formData.is_featured ? 1 : 0,
        is_active: formData.is_active ? 1 : 0,
      };

      if (isEditMode && currentVideoId) {
        // 更新视频
        await apiWithoutAuth.put(`/admin/videos/manage.php?id=${currentVideoId}`, videoData);
      } else {
        // 创建新视频
        await apiWithoutAuth.post("/admin/videos/manage.php", videoData);
      }

      // 重置表单
      resetForm();
      // 重新获取视频列表
      fetchVideos();
      
      alert(isEditMode ? "Video updated successfully!" : "Video created successfully!");
    } catch (error) {
      console.error("Error saving video:", error);
      const errorMessage = error.response?.data?.message || "Error saving video";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title || "",
      youtube_id: video.youtube_id || "",
      category_id: video.category_id || video.category?.id || "",
      description: video.description || "",
      duration: video.duration || "",
      is_featured: Boolean(video.is_featured),
      is_active: Boolean(video.is_active),
      order_index: video.order_index || 0
    });
    setCurrentVideoId(video.id);
    setIsEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await apiWithoutAuth.delete(`/admin/videos/manage.php?id=${videoId}`);
      alert("Video deleted successfully!");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Error deleting video");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      youtube_id: "",
      category_id: "",
      description: "",
      duration: "",
      is_featured: false,
      is_active: true,
      order_index: 0
    });
    setFormErrors({});
    setCurrentVideoId(null);
    setIsEditMode(false);
    setShowForm(false);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.youtube_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || 
                           video.category_id == filterCategory || 
                           video.category?.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (loading && videos.length === 0) {
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
              <p className="text-gray-600 mt-2">Manage and organize your video content</p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Video
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Videos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    placeholder="Search by title or YouTube ID..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    placeholder="Filter by category..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  {isEditMode ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? "Edit Video" : "Add New Video"}
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${
                      formErrors.title
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    placeholder="Enter video title"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video ID *
                  </label>
                  <input
                    type="text"
                    name="youtube_id"
                    value={formData.youtube_id}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${
                      formErrors.youtube_id
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    placeholder="e.g., dQw4w9WgXcQ"
                    required
                  />
                  {formErrors.youtube_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.youtube_id}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    11-character ID from YouTube URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${
                      formErrors.category_id
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                  {formErrors.category_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category_id}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    placeholder="e.g., 15:30"
                  />
                  <p className="mt-1 text-sm text-gray-500">Format: HH:MM or MM:SS</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                  placeholder="Video description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    name="order_index"
                    value={formData.order_index}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                  />
                  <p className="mt-1 text-sm text-gray-500">Sort order (lower numbers first)</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="is_featured" className="ml-2 text-gray-700">
                      Featured Video
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
                    <label htmlFor="is_active" className="ml-2 text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* YouTube Preview */}
              {formData.youtube_id && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                      src={`https://www.youtube.com/embed/${formData.youtube_id}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <LoadingSpinner small light />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {isEditMode ? "Update Video" : "Save Video"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Videos List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Videos</h2>
            <p className="text-gray-600 mt-1">
              {filteredVideos.length} video(s) found
            </p>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No videos found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add your first video
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YouTube ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                              alt="Thumbnail"
                              className="h-10 w-16 object-cover rounded"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {video.title}
                            </div>
                            {video.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {video.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {video.youtube_id}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {video.category || video.category_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              video.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {video.is_active ? "Active" : "Inactive"}
                          </span>
                          {video.is_featured && (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(video)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://youtube.com/watch?v=${video.youtube_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="View on YouTube"
                          >
                            <Upload className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosForm;