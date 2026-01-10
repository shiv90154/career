import React, { useState, useEffect } from "react";
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  BarChart,
  BookOpen,
  Users
} from "lucide-react";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import axios from "axios";

const TestForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTestId, setCurrentTestId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    course_id: "",
    duration_minutes: 60,
    total_questions: 50,
    passing_score: 60,
    max_attempts: 3,
    is_active: true,
    start_date: "",
    end_date: "",
    instructions: "",
    description: ""
  });

  const [formErrors, setFormErrors] = useState({});

  // 创建不带授权头的 axios 实例
  const apiWithoutAuth = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchTests();
    fetchCategories();
    fetchCourses();
  }, []);

  useEffect(() => {
    // 当课程变化时，过滤属于该课程的分类
    if (formData.course_id) {
      const filteredCats = categories.filter(cat => cat.course_id == formData.course_id);
      if (filteredCats.length === 0) {
        // 如果没有分类，获取该课程的分类
        fetchCategoriesByCourse(formData.course_id);
      }
    }
  }, [formData.course_id]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await apiWithoutAuth.get("/admin/tests/manage.php");
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      alert("Error loading tests data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // 假设有一个获取分类的API
      // const response = await apiWithoutAuth.get('/admin/categories/manage.php');
      // setCategories(response.data);
      
      // 临时静态数据
      setCategories([
        { id: 1, title: "Mathematics", course_id: 1 },
        { id: 2, title: "Science", course_id: 1 },
        { id: 3, title: "History", course_id: 2 },
        { id: 4, title: "Programming", course_id: 2 }
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoriesByCourse = async (courseId) => {
    try {
      // 根据课程ID获取分类
      // const response = await apiWithoutAuth.get(`/admin/categories/manage.php?course_id=${courseId}`);
      // return response.data;
    } catch (error) {
      console.error("Error fetching categories by course:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      // 假设有一个获取课程的API
      // const response = await apiWithoutAuth.get('/admin/courses/manage.php');
      // setCourses(response.data);
      
      // 临时静态数据
      setCourses([
        { id: 1, title: "Patwari Complete Preparation", code: "CP-PATWARI" },
        { id: 2, title: "SSC CGL Tier 1", code: "SSC-CGL-T1" },
        { id: 3, title: "Bank PO Prelims", code: "BANK-PO-P" }
      ]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Test title is required";
    }

    if (!formData.category_id) {
      errors.category_id = "Category is required";
    }

    if (!formData.course_id) {
      errors.course_id = "Course is required";
    }

    if (formData.duration_minutes <= 0) {
      errors.duration_minutes = "Duration must be greater than 0";
    }

    if (formData.total_questions <= 0) {
      errors.total_questions = "Total questions must be greater than 0";
    }

    if (formData.passing_score < 0 || formData.passing_score > 100) {
      errors.passing_score = "Passing score must be between 0 and 100";
    }

    if (formData.max_attempts < 0) {
      errors.max_attempts = "Max attempts cannot be negative";
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        errors.end_date = "End date must be after start date";
      }
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

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      course_id: courseId,
      category_id: "" // 重置分类选择
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const testData = {
        ...formData,
        is_active: formData.is_active ? 1 : 0,
      };

      if (isEditMode && currentTestId) {
        // 更新测试
        await apiWithoutAuth.put(`/admin/tests/manage.php?id=${currentTestId}`, testData);
      } else {
        // 创建新测试
        await apiWithoutAuth.post("/admin/tests/manage.php", testData);
      }

      // 重置表单
      resetForm();
      // 重新获取测试列表
      fetchTests();
      
      alert(isEditMode ? "Test updated successfully!" : "Test created successfully!");
    } catch (error) {
      console.error("Error saving test:", error);
      const errorMessage = error.response?.data?.message || "Error saving test";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (test) => {
    setFormData({
      title: test.title || "",
      category_id: test.category_id || "",
      course_id: test.course_id || courses.find(c => c.title === test.course_title)?.id || "",
      duration_minutes: test.duration_minutes || 60,
      total_questions: test.total_questions || 50,
      passing_score: test.passing_score || 60,
      max_attempts: test.max_attempts || 3,
      is_active: Boolean(test.is_active),
      start_date: test.start_date ? new Date(test.start_date).toISOString().slice(0, 16) : "",
      end_date: test.end_date ? new Date(test.end_date).toISOString().slice(0, 16) : "",
      instructions: test.instructions || "",
      description: test.description || ""
    });
    setCurrentTestId(test.id);
    setIsEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) {
      return;
    }

    try {
      await apiWithoutAuth.delete(`/admin/tests/manage.php?id=${testId}`);
      alert("Test deleted successfully!");
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Error deleting test");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category_id: "",
      course_id: "",
      duration_minutes: 60,
      total_questions: 50,
      passing_score: 60,
      max_attempts: 3,
      is_active: true,
      start_date: "",
      end_date: "",
      instructions: "",
      description: ""
    });
    setFormErrors({});
    setCurrentTestId(null);
    setIsEditMode(false);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (test) => {
    const now = new Date();
    const startDate = new Date(test.start_date);
    const endDate = new Date(test.end_date);

    if (!test.is_active) {
      return { text: "Inactive", color: "bg-red-100 text-red-800" };
    }

    if (now < startDate) {
      return { text: "Upcoming", color: "bg-yellow-100 text-yellow-800" };
    } else if (now > endDate) {
      return { text: "Expired", color: "bg-gray-100 text-gray-800" };
    } else {
      return { text: "Active", color: "bg-green-100 text-green-800" };
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.category_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !filterCourse || test.course_title?.toLowerCase().includes(filterCourse.toLowerCase());
    
    const matchesCategory = !filterCategory || test.category_title?.toLowerCase().includes(filterCategory.toLowerCase());
    
    const matchesStatus = !filterStatus || 
      (filterStatus === "active" && test.is_active && new Date(test.end_date) > new Date()) ||
      (filterStatus === "inactive" && !test.is_active) ||
      (filterStatus === "upcoming" && new Date(test.start_date) > new Date()) ||
      (filterStatus === "expired" && new Date(test.end_date) < new Date());

    return matchesSearch && matchesCourse && matchesCategory && matchesStatus;
  });

  if (loading && tests.length === 0) {
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
              <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
              <p className="text-gray-600 mt-2">Create and manage tests for your courses</p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Test
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tests
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
                    placeholder="Search by title or category..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Course
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    placeholder="Filter by course..."
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  {isEditMode ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? "Edit Test" : "Create New Test"}
                </h2>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Title *
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
                    placeholder="Enter test title"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleCourseChange}
                    className={`w-full rounded-lg border ${
                      formErrors.course_id
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.code})
                      </option>
                    ))}
                  </select>
                  {formErrors.course_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.course_id}</p>
                  )}
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
                    {categories
                      .filter(cat => !formData.course_id || cat.course_id == formData.course_id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                  </select>
                  {formErrors.category_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category_id}</p>
                  )}
                  {formData.course_id && categories.filter(cat => cat.course_id == formData.course_id).length === 0 && (
                    <p className="mt-1 text-sm text-yellow-600">No categories found for this course</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Minutes) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleInputChange}
                      min="1"
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.duration_minutes
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                      required
                    />
                  </div>
                  {formErrors.duration_minutes && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.duration_minutes}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Questions *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BarChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="total_questions"
                      value={formData.total_questions}
                      onChange={handleInputChange}
                      min="1"
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.total_questions
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                      required
                    />
                  </div>
                  {formErrors.total_questions && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.total_questions}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="passing_score"
                      value={formData.passing_score}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.passing_score
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                      required
                    />
                  </div>
                  {formErrors.passing_score && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.passing_score}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="max_attempts"
                      value={formData.max_attempts}
                      onChange={handleInputChange}
                      min="0"
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.max_attempts
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    />
                  </div>
                  {formErrors.max_attempts && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.max_attempts}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">0 for unlimited attempts</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.end_date
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:ring-opacity-50 px-4 py-3 transition-colors duration-200`}
                    />
                  </div>
                  {formErrors.end_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.end_date}</p>
                  )}
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
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                  placeholder="Test description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 transition-colors duration-200"
                  placeholder="Test instructions for students..."
                />
              </div>

              <div className="flex items-center space-x-4">
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
                    Active Test
                  </label>
                </div>
              </div>

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
                      {isEditMode ? "Update Test" : "Create Test"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tests List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">All Tests</h2>
                <p className="text-gray-600 mt-1">
                  {filteredTests.length} test(s) found
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Showing {Math.min(filteredTests.length, 10)} of {filteredTests.length}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No tests found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create your first test
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course & Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Info
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
                  {filteredTests.slice(0, 10).map((test) => {
                    const status = getStatusBadge(test);
                    return (
                      <tr key={test.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {test.title}
                            </div>
                            {test.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {test.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {test.course_title}
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {test.category_title}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {test.duration_minutes} mins
                              </span>
                            </div>
                            <div className="flex items-center">
                              <BarChart className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {test.total_questions} questions
                              </span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                Pass: {test.passing_score}%
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                Attempts: {test.max_attempts === 0 ? 'Unlimited' : test.max_attempts}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                              {status.text}
                            </span>
                            <div className="text-xs text-gray-500">
                              <div>Start: {formatDate(test.start_date)}</div>
                              <div>End: {formatDate(test.end_date)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(test)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(test.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestForm;