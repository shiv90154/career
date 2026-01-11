import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import Layout from "./components/Layout/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './services/api';

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Public/Home"));
const Courses = lazy(() => import("./pages/Public/Courses"));
const CourseDetail = lazy(() => import("./pages/Public/CourseDetail"));
const Blogs = lazy(() => import("./pages/Public/Blogs"));
const BlogDetail = lazy(() => import("./pages/Public/BlogDetail"));

// Debug component (only in development)
const ApiTest = lazy(() => import("./components/Debug/ApiTest"));
const CorsTest = lazy(() => import("./components/Debug/CorsTest"));
const CorsVerification = lazy(() => import("./components/Test/CorsVerification"));
const CurrentAffairs = lazy(() => import("./pages/Public/CurrentAffairs"));
const CurrentAffairDetail = lazy(() => import("./pages/Public/CurrentAffairDetail"));
const Tests = lazy(() => import("./pages/Public/Tests"));
const TestDetail = lazy(() => import("./pages/Public/TestDetail"));
const Login = lazy(() => import("./pages/Public/Login"));
const Register = lazy(() => import("./pages/Public/Register"));
const Contact = lazy(() => import("./pages/Public/Contact"));
const About = lazy(() => import("./pages/Public/About"));

// Admin Pages
const AdminDashboard = lazy(() => import("./components/Admin/Dashboard"));
const ManageCourses = lazy(() => import("./pages/Admin/ManageCourses"));
const CourseForm = lazy(() => import("./components/Admin/CourseForm"));
const ManageCategories = lazy(() => import("./pages/Admin/ManageCategories"));
const ManageStudents = lazy(() => import("./pages/Admin/ManageStudents"));
const ManagePayments = lazy(() => import('./pages/Admin/ManagePayments'));

// Student Pages
const StudentDashboard = lazy(() => import("./components/Student/Dashboard"));
const MyCourses = lazy(() => import("./pages/Student/MyCourses"));
const MyTests = lazy(() => import("./pages/Student/MyTests"));
const MyMaterials = lazy(() => import("./pages/Student/MyMaterials"));
const LiveClasses = lazy(() => import("./pages/Student/LiveClasses"));
const CoursePlayer = lazy(() => import("./components/Student/CoursePlayer"));
const QuizTaker = lazy(() => import("./components/Student/QuizTaker"));
const Profile = lazy(() => import("./pages/Student/Profile"));

// 404 Page
const NotFound = lazy(() => import("./pages/Public/NotFound"));

// Security and Performance Component
const SecurityProvider = ({ children }) => {
  useEffect(() => {
    // Initialize CSRF token on app load
    const initializeSecurity = async () => {
      try {
        const response = await api.get('/auth/csrf-token.php');
        if (response.data?.csrf_token) {
          window.csrfToken = response.data.csrf_token;
        }
      } catch (error) {
        console.warn('Failed to initialize CSRF token:', error);
      }
    };

    initializeSecurity();

    // Security headers check (development only)
    if (import.meta.env.DEV) {
      console.log('Security headers initialized');
    }

    // Prevent right-click in production (optional)
    if (import.meta.env.PROD) {
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);

  return children;
};

// Protected Route Component with enhanced security
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Log unauthorized access attempt
    console.warn(`Unauthorized access attempt: User role ${user.role}, required ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

// Enhanced Layout Wrappers with Error Boundaries
const AdminLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <Layout admin={true}>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const StudentLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <Layout student={true}>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const PublicLayout = ({ children }) => {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <SecurityProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              
              {/* Debug route only in development */}
              {import.meta.env.DEV && (
                <Route path="/debug" element={<PublicLayout><ApiTest /></PublicLayout>} />
              )}
              {import.meta.env.DEV && (
                <Route path="/cors-test" element={<PublicLayout><CorsTest /></PublicLayout>} />
              )}
              {import.meta.env.DEV && (
                <Route path="/cors-verify" element={<PublicLayout><CorsVerification /></PublicLayout>} />
              )}
              
              <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
              <Route path="/courses/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
              <Route path="/blogs" element={<PublicLayout><Blogs /></PublicLayout>} />
              <Route path="/blogs/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
              <Route path="/current-affairs" element={<PublicLayout><CurrentAffairs /></PublicLayout>} />
              <Route path="/current-affairs/:id" element={<PublicLayout><CurrentAffairDetail /></PublicLayout>} />
              <Route path="/tests" element={<PublicLayout><Tests /></PublicLayout>} />
              <Route path="/tests/:id" element={<PublicLayout><TestDetail /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><ManageCourses /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/courses/new" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><CourseForm /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/courses/edit/:id" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><CourseForm /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><ManageCategories /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><ManageStudents /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout><ManagePayments /></AdminLayout>
                </ProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute requiredRole="student">
                  <Navigate to="/student/dashboard" replace />
                </ProtectedRoute>
              } />
              <Route path="/student/dashboard" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><StudentDashboard /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/courses" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><MyCourses /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/tests" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><MyTests /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/materials" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><MyMaterials /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/live-classes" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><LiveClasses /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/courses/:courseId" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><CoursePlayer /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/quiz/:quizId" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><QuizTaker /></StudentLayout>
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout><Profile /></StudentLayout>
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
            
            {/* Enhanced Toast Configuration */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="custom-toast"
              bodyClassName="custom-toast-body"
            />
          </Router>
        </AuthProvider>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;
