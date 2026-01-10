import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  BookOpen,
  FileText,
  Users,
  BarChart,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Video,
  Clipboard,
  Award,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight,
  Calendar,
  Clock,
  Download,
} from "lucide-react";

const Layout = ({ children, admin = false, student = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Admin Navigation
  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/courses", label: "Courses", icon: <BookOpen size={20} /> },
    { path: "/admin/students", label: "Students", icon: <Users size={20} /> },
    { path: "/admin/videos", label: "Videos", icon: <Video size={20} /> },
    { path: "/admin/tests", label: "Tests", icon: <Clipboard size={20} /> },
    { path: "/admin/blogs", label: "Blogs", icon: <FileText size={20} /> },
    {
      path: "/admin/live-classes",
      label: "Live Classes",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/payments",
      label: "Payments",
      icon: <BarChart size={20} />,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart size={20} />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  // Student Navigation
  const studentNavItems = [
    {
      path: "/student/dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      path: "/student/courses",
      label: "My Courses",
      icon: <BookOpen size={20} />,
    },
    {
      path: "/student/tests",
      label: "Mock Tests",
      icon: <Clipboard size={20} />,
    },
    {
      path: "/student/materials",
      label: "Study Materials",
      icon: <FileText size={20} />,
    },
    {
      path: "/student/live-classes",
      label: "Live Classes",
      icon: <Users size={20} />,
    },
    { path: "/student/profile", label: "Profile", icon: <User size={20} /> },
  ];

  // Public Navigation
  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/blogs", label: "Blogs" },
    { path: "/contact", label: "Contact" },
    { path: "/about", label: "About" },
  ];

  const navItems = admin
    ? adminNavItems
    : student
    ? studentNavItems
    : publicNavItems;

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New video added to Patwari Course",
      time: "2 hours ago",
      icon: <BookOpen size={16} />,
      unread: true,
      type: "course",
    },
    {
      id: 2,
      title: "Mock test scheduled for tomorrow",
      time: "1 day ago",
      icon: <Clipboard size={16} />,
      unread: false,
      type: "test",
    },
    {
      id: 3,
      title: "You completed GK Module",
      time: "3 days ago",
      icon: <Award size={16} />,
      unread: false,
      type: "achievement",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}

      <header className="bg-gray-200 shadow-lg sticky top-0 z-50 p-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className=" flex items-center justify-center ">
                  <img
                    src="public/Images/logo-notgood.png"
                    alt="Career Path Institute"
                    className="w-50 h-21 "
                  />
                </div>
               
              </Link>
            </div>

            {/* Desktop Navigation for Public */}
            {!admin && !student && (
              <nav className="hidden md:flex items-center space-x-1">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-[15px] font-medium  duration-200 ${
                      location.pathname === item.path
                        ? "bg-white/3 text-black-200"
                        : "text-blue-900 hover:bg-black/9 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </button>

                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              Notifications
                            </h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              Mark all as read
                            </button>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                notification.unread ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    notification.type === "course"
                                      ? "bg-blue-100 text-blue-600"
                                      : notification.type === "test"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {notification.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 font-medium mb-1">
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    {notification.time}
                                  </div>
                                </div>
                                {notification.unread && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link
                          to={
                            admin
                              ? "/admin/notifications"
                              : "/student/notifications"
                          }
                          className="block p-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-50 border-t border-gray-100"
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* User Dropdown */}
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          user.full_name?.charAt(0) || <User size={16} />
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-white">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-300 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.full_name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {user.full_name}
                              </h4>
                              <p className="text-sm text-gray-500 truncate">
                                {user.email}
                              </p>
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full capitalize">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          {admin ? (
                            <>
                              <Link
                                to="/admin/dashboard"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              >
                                <Home size={18} className="text-gray-400" />
                                <span>Dashboard</span>
                              </Link>
                              <Link
                                to="/admin/settings"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              >
                                <Settings size={18} className="text-gray-400" />
                                <span>Settings</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                to="/student/dashboard"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              >
                                <Home size={18} className="text-gray-400" />
                                <span>Dashboard</span>
                              </Link>
                              <Link
                                to="/student/profile"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              >
                                <User size={18} className="text-gray-400" />
                                <span>Profile</span>
                              </Link>
                            </>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-2"
                          >
                            <LogOut size={18} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-800 to-blue-900 text-white  hover:from-blue-700 hover:to-blue-900 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              {(admin || student) && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation for Public */}
          {!admin && !student && (
            <div
              className={`md:hidden transition-all duration-300 ${
                mobileMenuOpen
                  ? "max-h-64 opacity-100 py-4"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="flex flex-col space-y-2">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar for Admin/Student */}
        {(admin || student) && (
          <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  {admin ? "Admin Panel" : "Student Portal"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {admin ? "Management Dashboard" : "Learning Dashboard"}
                </p>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname.startsWith(item.path)
                        ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-l-4 border-yellow-500"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div
                      className={`${
                        location.pathname.startsWith(item.path)
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {location.pathname.startsWith(item.path) && (
                      <ChevronRight
                        size={16}
                        className="ml-auto text-yellow-400"
                      />
                    )}
                  </Link>
                ))}

                <div className="pt-6 mt-6 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-700">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4">
                  <h4 className="font-bold text-white">
                    Career Path Institute
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Shimla, Himachal Pradesh
                  </p>
                  <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                    <Mail size={12} />
                    <span>info@thecareerspathway.com</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Sidebar */}
            <div
              className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl overflow-y-auto">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {admin ? "Admin Panel" : "Student Portal"}
                    </h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                        location.pathname.startsWith(item.path)
                          ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                  <div className="pt-6 mt-6 border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </nav>

                <div className="p-4">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4">
                    <h4 className="font-bold text-white">
                      Career Path Institute
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Shimla, Himachal Pradesh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${admin || student ? "md:ml-0" : ""}`}>
          <div className="min-h-[calc(100vh-140px)]">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Career Path Institute"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Career Path Institute
                  </h3>
                  <span className="text-yellow-400 text-sm font-medium">
                    Shimla
                  </span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premier coaching institute for competitive exam preparation in
                Shimla. Providing quality education for government job aspirants
                since 2015.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b border-gray-700">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {publicNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center "
                    >
                      <ChevronRight
                        size={14}
                        className="mr-2 group-hover:text-yellow-400"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Courses */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b border-gray-700">
                Popular Courses
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/courses/patwari"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Patwari Exam Preparation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/ssc"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    SSC CGL & CHSL
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/banking"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Banking Exams (PO/Clerk)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/railway"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Railway Group D & NTPC
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/teaching"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Teaching (HP TET, CTET)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b border-gray-700">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin
                    size={18}
                    className="text-yellow-400 mt-1 flex-shrink-0"
                  />
                  <span className="text-gray-400">
                    Shimla, Himachal Pradesh, India
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-yellow-400 flex-shrink-0" />
                  <a
                    href="mailto:info@thecareerspathway.com"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    info@thecareerspathway.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="text-yellow-400 flex-shrink-0" />
                  <a
                    href="tel:+911234567890"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    +91 1234567890
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Globe size={18} className="text-yellow-400 flex-shrink-0" />
                  <a
                    href="https://www.thecareerspathway.com"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    www.thecareerspathway.com
                  </a>
                </li>
              </ul>
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
                <p className="text-sm text-gray-300">Download Brochure</p>
                <button className="mt-2 w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center justify-center space-x-2">
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Career Path Institute -
                Shimla. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/refund"
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Recognized by the Government of Himachal Pradesh | GSTIN:
                02XXXXXXXXXXXX
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
