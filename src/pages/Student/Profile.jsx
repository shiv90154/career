import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  User, Mail, Phone, MapPin, 
  Calendar, Shield, Lock, 
  Save, Upload, Camera, 
  Award, BookOpen, Clock
} from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stats, setStats] = useState(null);

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
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.response?.data?.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className={`btn ${editing ? 'btn-outline' : 'btn-primary'}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-container">
        {/* Left Column - Profile Info */}
        <div className="profile-left">
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="image-container">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" />
                ) : (
                  <div className="image-placeholder">
                    <User size={48} />
                  </div>
                )}
                
                {editing && (
                  <label className="image-upload">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                )}
              </div>
              
              <div className="profile-name">
                <h2>{profile.full_name}</h2>
                <p className="student-id">Student ID: {profile.id}</p>
                <p className="join-date">
                  <Calendar size={14} />
                  Joined: {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={16} />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <Mail size={16} />
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <span className="info-value">{profile.email}</span>
                    {profile.email_verified ? (
                      <span className="verified-badge">
                        <Shield size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="unverified-badge">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                {profile.phone && (
                  <div className="info-item">
                    <Phone size={16} />
                    <div className="info-content">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{profile.phone}</span>
                    </div>
                  </div>
                )}

                {profile.address && (
                  <div className="info-item">
                    <MapPin size={16} />
                    <div className="info-content">
                      <span className="info-label">Address</span>
                      <span className="info-value">{profile.address}</span>
                      <span className="location">
                        {profile.city}, {profile.state} - {profile.pincode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="info-item">
                  <Calendar size={16} />
                  <div className="info-content">
                    <span className="info-label">Last Login</span>
                    <span className="info-value">
                      {profile.last_login 
                        ? new Date(profile.last_login).toLocaleString('en-IN')
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Security */}
          <div className="profile-card">
            <div className="card-header">
              <h3>
                <Lock size={20} />
                Account Security
              </h3>
            </div>
            
            <div className="security-options">
              <button className="security-btn">
                Change Password
              </button>
              <button className="security-btn">
                Two-Factor Authentication
              </button>
              <button className="security-btn">
                Login Activity
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="profile-right">
          {/* Learning Stats */}
          <div className="profile-card">
            <div className="card-header">
              <h3>
                <Award size={20} />
                Learning Statistics
              </h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-content">
                  <h4>{stats?.enrolled_courses || 0}</h4>
                  <p>Enrolled Courses</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <h4>{stats?.study_hours || 0}h</h4>
                  <p>Study Time</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Award size={24} />
                </div>
                <div className="stat-content">
                  <h4>{stats?.average_score || 0}%</h4>
                  <p>Avg. Test Score</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <BookOpen size={24} />
                </div>
                <div className="stat-content">
                  <h4>{stats?.completion_rate || 0}%</h4>
                  <p>Completion Rate</p>
                </div>
              </div>
            </div>

            <div className="progress-overview">
              <h4>Overall Progress</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats?.overall_progress || 0}%` }}
                ></div>
              </div>
              <span className="progress-text">{stats?.overall_progress || 0}% Complete</span>
            </div>
          </div>

          {/* Recent Achievements */}
          {stats?.recent_achievements && stats.recent_achievements.length > 0 && (
            <div className="profile-card">
              <div className="card-header">
                <h3>Recent Achievements</h3>
              </div>
              
              <div className="achievements-list">
                {stats.recent_achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-icon">
                      <Award size={20} />
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">
                        {formatDate(achievement.earned_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enrollment History */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Enrollment History</h3>
            </div>
            
            <div className="enrollment-list">
              {stats?.recent_enrollments?.map((enrollment) => (
                <div key={enrollment.id} className="enrollment-item">
                  <div className="enrollment-info">
                    <h4>{enrollment.course_title}</h4>
                    <p className="enrollment-date">
                      Enrolled: {formatDate(enrollment.enrollment_date)}
                    </p>
                    <div className="enrollment-progress">
                      <div className="progress-bar small">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span>{enrollment.progress_percentage}% complete</span>
                    </div>
                  </div>
                  <span className={`status-badge ${enrollment.status}`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;