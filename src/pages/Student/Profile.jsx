import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  User, Mail, Phone, MapPin, 
  Calendar, Shield, Lock, 
  Save, Upload, Camera, 
  Award, BookOpen, Clock,
  ChevronRight, Edit2, Eye,
  Star, Target, CheckCircle,
  TrendingUp, GraduationCap
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/student/profile/stats')
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setFormData(profileRes.data);
      if (profileRes.data.profile_image) {
        setPreviewUrl(`${process.env.REACT_APP_API_URL}/uploads/${profileRes.data.profile_image}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      const response = await api.put('/student/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(response.data);
      setEditing(false);
      // You can use a toast notification here
      // toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast.error('Error updating profile');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your profile and track your learning progress</p>
          </div>
          
          <button 
            className={`mt-4 md:mt-0 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              editing 
                ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
            }`}
            onClick={() => setEditing(!editing)}
          >
            <Edit2 size={18} />
            <span>{editing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-lg font-bold text-blue-600">{stats?.overall_progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats?.overall_progress || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{stats?.completed_courses || 0} courses completed</span>
            <span>{stats?.enrolled_courses || 0} total courses</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
                          <span className="text-4xl font-bold text-blue-700">
                            {getInitials(profile.full_name)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {editing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 group-hover:scale-105">
                        <Camera size={20} className="text-blue-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-gray-900">{profile.full_name}</h2>
                    <p className="text-sm text-gray-600 mt-1">Student ID: {profile.id}</p>
                    <div className="inline-flex items-center space-x-1 mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      <Calendar size={12} />
                      <span>Joined {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Info / Form */}
                <div className="flex-1">
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <User size={14} />
                            <span>Full Name</span>
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Mail size={14} />
                            <span>Email Address</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Phone size={14} />
                            <span>Phone Number</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter city"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter state"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter pincode"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>Address</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your full address"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Save size={18} />
                        <span>Save Changes</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {/* Email */}
                      <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <Mail size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Email Address</p>
                              <p className="text-lg font-semibold text-gray-900 mt-1">{profile.email}</p>
                            </div>
                            {profile.email_verified ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <Shield size={12} className="mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Not Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      {profile.phone && (
                        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Phone size={20} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">Phone Number</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{profile.phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Address */}
                      {profile.address && (
                        <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <MapPin size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">Address</p>
                            <p className="text-gray-900 mt-1">{profile.address}</p>
                            <p className="text-sm text-gray-600 mt-2">
                              {profile.city}, {profile.state} - {profile.pincode}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Last Login */}
                      <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <Calendar size={20} className="text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Last Login</p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {profile.last_login 
                              ? new Date(profile.last_login).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short'
                                })
                              : 'Never logged in'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                    <Lock size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Account Security</h3>
                    <p className="text-gray-600">Secure your account with these options</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Lock size={24} className="text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Change Password</h4>
                  <p className="text-sm text-gray-600 text-center">Update your password regularly</p>
                </button>

                <button className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                  <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Shield size={24} className="text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">2FA Security</h4>
                  <p className="text-sm text-gray-600 text-center">Add extra layer of security</p>
                </button>

                <button className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                  <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Eye size={24} className="text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Login Activity</h4>
                  <p className="text-sm text-gray-600 text-center">Monitor account access</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6">
          {/* Learning Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <TrendingUp size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Learning Stats</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Enrolled Courses</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">{stats?.enrolled_courses || 0}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Clock size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Study Hours</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-700">{stats?.study_hours || 0}h</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Award size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Avg. Test Score</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">{stats?.average_score || 0}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Target size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Completion Rate</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-orange-700">{stats?.completion_rate || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          {stats?.recent_achievements && stats.recent_achievements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
                      <Award size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {stats.recent_achievements.map((achievement, index) => (
                    <div 
                      key={achievement.id}
                      className="group flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className={`p-3 rounded-lg ${
                        index % 3 === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-600' :
                        index % 3 === 1 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600' :
                        'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-600'
                      }`}>
                        <Award size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{achievement.description}</p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {formatDate(achievement.earned_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enrollment History */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <GraduationCap size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Enrollment History</h3>
                </div>
              </div>

              <div className="space-y-4">
                {stats?.recent_enrollments?.map((enrollment) => (
                  <div 
                    key={enrollment.id}
                    className="group p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{enrollment.course_title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : enrollment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Enrolled: {formatDate(enrollment.enrollment_date)}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <span>Progress</span>
                        <span className="font-semibold">{enrollment.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            enrollment.progress_percentage >= 80 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : enrollment.progress_percentage >= 50
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          }`}
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                <span>View All Enrollments</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;