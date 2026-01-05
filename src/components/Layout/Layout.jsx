import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, BookOpen, FileText, Users, 
  BarChart, Settings, LogOut, User,
  Menu, X, ChevronDown, Bell, 
  Search, Video, Clipboard, Award
} from 'lucide-react';

const Layout = ({ children, admin = false, student = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Admin Navigation
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/admin/courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { path: '/admin/students', label: 'Students', icon: <Users size={20} /> },
    { path: '/admin/videos', label: 'Videos', icon: <Video size={20} /> },
    { path: '/admin/tests', label: 'Tests', icon: <Clipboard size={20} /> },
    { path: '/admin/blogs', label: 'Blogs', icon: <FileText size={20} /> },
    { path: '/admin/live-classes', label: 'Live Classes', icon: <Users size={20} /> },
    { path: '/admin/payments', label: 'Payments', icon: <BarChart size={20} /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Student Navigation
  const studentNavItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/student/courses', label: 'My Courses', icon: <BookOpen size={20} /> },
    { path: '/student/tests', label: 'Mock Tests', icon: <Clipboard size={20} /> },
    { path: '/student/materials', label: 'Study Materials', icon: <FileText size={20} /> },
    { path: '/student/live-classes', label: 'Live Classes', icon: <Users size={20} /> },
    { path: '/student/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  // Public Navigation
  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
  ];

  const navItems = admin ? adminNavItems : student ? studentNavItems : publicNavItems;

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <Link to="/">
                <img src="/logo.png" alt="Career Path Institute" className="logo-img" />
                <div className="logo-text">
                  <h1>Career Path Institute</h1>
                  <span>Shimla</span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation */}
            {!admin && !student && (
              <nav className="desktop-nav">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* User Actions */}
            <div className="user-actions">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="notifications-container">
                    <button 
                      className="icon-btn"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                    >
                      <Bell size={20} />
                      <span className="notification-badge">3</span>
                    </button>
                    
                    {notificationsOpen && (
                      <div className="notifications-dropdown">
                        <div className="notifications-header">
                          <h4>Notifications</h4>
                          <button className="mark-all-read">Mark all as read</button>
                        </div>
                        <div className="notifications-list">
                          <div className="notification-item unread">
                            <div className="notification-icon">
                              <BookOpen size={16} />
                            </div>
                            <div className="notification-content">
                              <p>New video added to Patwari Course</p>
                              <span className="notification-time">2 hours ago</span>
                            </div>
                          </div>
                          <div className="notification-item">
                            <div className="notification-icon">
                              <Clipboard size={16} />
                            </div>
                            <div className="notification-content">
                              <p>Mock test scheduled for tomorrow</p>
                              <span className="notification-time">1 day ago</span>
                            </div>
                          </div>
                          <div className="notification-item">
                            <div className="notification-icon">
                              <Award size={16} />
                            </div>
                            <div className="notification-content">
                              <p>You completed GK Module</p>
                              <span className="notification-time">3 days ago</span>
                            </div>
                          </div>
                        </div>
                        <Link to={admin ? '/admin/notifications' : '/student/notifications'} className="view-all">
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* User Dropdown */}
                  <div className="user-dropdown-container">
                    <button 
                      className="user-profile-btn"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    >
                      <div className="user-avatar">
                        {user.profile_image ? (
                          <img src={user.profile_image} alt={user.full_name} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <span className="user-name">{user.full_name}</span>
                      <ChevronDown size={16} />
                    </button>

                    {userDropdownOpen && (
                      <div className="user-dropdown">
                        <div className="user-info">
                          <h4>{user.full_name}</h4>
                          <p className="user-email">{user.email}</p>
                          <p className="user-role">{user.role}</p>
                        </div>
                        
                        <div className="dropdown-links">
                          {admin ? (
                            <>
                              <Link to="/admin/dashboard" className="dropdown-link">
                                <Home size={16} />
                                Dashboard
                              </Link>
                              <Link to="/admin/settings" className="dropdown-link">
                                <Settings size={16} />
                                Settings
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to="/student/dashboard" className="dropdown-link">
                                <Home size={16} />
                                Dashboard
                              </Link>
                              <Link to="/student/profile" className="dropdown-link">
                                <User size={16} />
                                Profile
                              </Link>
                            </>
                          )}
                          
                          <button onClick={handleLogout} className="dropdown-link logout">
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for Admin/Student */}
      {(admin || student) && (
        <div className="sidebar-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>{admin ? 'Admin Panel' : 'Student Panel'}</h3>
            </div>

            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="sidebar-divider"></div>

              <button 
                onClick={handleLogout}
                className="sidebar-link logout"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>

            <div className="sidebar-footer">
              <div className="institute-info">
                <h4>Career Path Institute</h4>
                <p>Shimla, Himachal Pradesh</p>
                <p className="contact-info">info@thecareerspathway.com</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="content-container">
              {children}
            </div>
          </main>
        </div>
      )}

      {/* Main Content for Public */}
      {!admin && !student && (
        <main className="public-content">
          {children}
        </main>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="/logo.png" alt="Career Path Institute" className="logo-img" />
                <div className="logo-text">
                  <h3>Career Path Institute</h3>
                  <span>Shimla</span>
                </div>
              </div>
              <p className="footer-description">
                Premier coaching institute for competitive exam preparation in Shimla. 
                Providing quality education for government job aspirants.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">YouTube</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Popular Courses</h4>
              <ul className="footer-links">
                <li><Link to="/courses/patwari">Patwari Exam</Link></li>
                <li><Link to="/courses/ssc">SSC CGL</Link></li>
                <li><Link to="/courses/banking">Banking Exams</Link></li>
                <li><Link to="/courses/railway">Railway Exams</Link></li>
                <li><Link to="/courses/teaching">Teaching Exams</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul className="contact-info">
                <li>
                  <strong>Address:</strong>
                  <p>Shimla, Himachal Pradesh</p>
                </li>
                <li>
                  <strong>Email:</strong>
                  <p>info@thecareerspathway.com</p>
                </li>
                <li>
                  <strong>Phone:</strong>
                  <p>+91 1234567890</p>
                </li>
                <li>
                  <strong>Website:</strong>
                  <p>www.thecareerspathway.com</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Career Path Institute - Shimla. All rights reserved.</p>
            <div className="footer-links-bottom">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refund">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;