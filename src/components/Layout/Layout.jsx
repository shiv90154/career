import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Home, BookOpen, Users, Settings, LogOut, 
    User, Bell, Search, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Layout = ({ children, admin = false, student = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    // Admin Navigation
    const adminNavItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen },
        { name: 'Categories', href: '/admin/categories', icon: BookOpen },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Payments', href: '/admin/payments', icon: Settings },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    // Student Navigation
    const studentNavItems = [
        { name: 'Dashboard', href: '/student/dashboard', icon: Home },
        { name: 'My Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Tests', href: '/student/tests', icon: BookOpen },
        { name: 'Materials', href: '/student/materials', icon: BookOpen },
        { name: 'Live Classes', href: '/student/live-classes', icon: BookOpen },
        { name: 'Profile', href: '/student/profile', icon: User },
    ];

    // Public Navigation
    const publicNavItems = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
        { name: 'Tests', href: '/tests' },
        { name: 'Current Affairs', href: '/current-affairs' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    if (admin || student) {
        const navItems = admin ? adminNavItems : studentNavItems;
        
        return (
            <div className="flex h-screen bg-light-grey">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                    <div className="flex items-center justify-between h-16 px-4 border-b border-primary/10">
                        <Link to="/" className="text-xl font-bold text-primary">
                            Career Path
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-primary hover:text-primary-light"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <nav className="mt-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="nav-link flex items-center px-4 py-3 text-body hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="absolute bottom-0 w-full p-4 border-t border-primary/10">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <span className="text-primary font-medium text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-heading">{user?.name}</p>
                                <p className="text-xs text-muted capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-body hover:bg-highlight/5 hover:text-highlight rounded transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                    {/* Top Bar */}
                    <header className="bg-white shadow-sm border-b border-primary/10 h-16 flex items-center justify-between px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-primary hover:text-primary-light"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="form-input pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <button className="p-2 text-muted hover:text-primary">
                                <Bell className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
            </div>
        );
    }

    // Public Layout
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-xl font-bold text-primary">
                            Career Path Institute
                        </Link>
                        
                        <div className="hidden md:flex items-center space-x-8">
                            {publicNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="nav-link text-body hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                                        className="text-body hover:text-primary"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-body hover:text-highlight"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-body hover:text-primary"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-primary"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-accent">Career Path Institute</h3>
                            <p className="text-gray-300">
                                D D Tower Building, Opposite Jubbal House, Above Homeopathic Clinic, Sanjauli, Shimla - 171006, Himachal Pradesh
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><Link to="/courses" className="hover:text-accent transition-colors">Courses</Link></li>
                                <li><Link to="/tests" className="hover:text-accent transition-colors">Tests</Link></li>
                                <li><Link to="/current-affairs" className="hover:text-accent transition-colors">Current Affairs</Link></li>
                                <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Support</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><Link to="/help" className="hover:text-accent transition-colors">Help Center</Link></li>
                                <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
                            <div className="text-gray-300 space-y-2">
                                <p>Email: <span className="text-accent">info@thecareespath.com</span></p>
                                <p>Phone: <span className="text-accent">+91-98052 91450</span></p>
                                <p>Website: <span className="text-accent">www.thecareerspathway.com</span></p>
                                <div className="mt-4">
                                    <p className="text-sm">Social Media:</p>
                                    <p className="text-sm">Facebook: <span className="text-accent">Careerpoint.sml</span></p>
                                    <p className="text-sm">Instagram: Available for updates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-primary-light mt-8 pt-8 text-center text-gray-300">
                        <p>&copy; 2026 Career Path Institute. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;