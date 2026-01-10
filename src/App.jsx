import React, { Suspense, lazy } from "react";
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

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Public/Home"));
const Courses = lazy(() => import("./pages/Public/Courses"));
const CourseDetail = lazy(() => import("./pages/Public/CourseDetail"));
const Blogs = lazy(() => import("./pages/Public/Blogs"));
const BlogDetail = lazy(() => import("./pages/Public/BlogDetail"));
const Login = lazy(() => import("./pages/Public/Login"));
const Register = lazy(() => import("./pages/Public/Register"));
const Contact = lazy(() => import("./pages/Public/Contact"));
const About = lazy(() => import("./pages/Public/About"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const ManageCourses = lazy(() => import("./pages/Admin/ManageCourses"));
const CourseForm = lazy(() => import("./pages/Admin/CourseForm"));
const ManageCategories = lazy(() => import("./pages/Admin/ManageCategories"));
const ManageVideos = lazy(() => import("./pages/Admin/ManageVideos"));
const VideoForm = lazy(() => import("./pages/Admin/VideoForm.jsx"));
// const ManageMaterials = lazy(() => import('./pages/Admin/ManageMaterials'));
// const MaterialForm = lazy(() => import('./pages/Admin/MaterialForm'));
const ManageTests = lazy(() => import('./pages/Admin/ManageTests'));
const TestForm = React.lazy(() =>
  import("./pages/Admin/TestForm")
);

// const TestQuestions = lazy(() => import('./pages/Admin/TestQuestions'));
const ManageStudents = lazy(() => import("./pages/Admin/ManageStudents"));
// const ManageEnrollments = lazy(() => import('./pages/Admin/ManageEnrollments'));
// const ManagePayments = lazy(() => import('./pages/Admin/ManagePayments'));
const ManageBlogs = lazy(() => import('./pages/Admin/ManageBlogs'));
// const BlogForm = lazy(() => import('./pages/Admin/BlogForm'));
const ManageLiveClasses = lazy(() => import('./pages/Admin/ManageLiveClasses'));
// const LiveClassForm = lazy(() => import('./pages/Admin/LiveClassForm'));
// const Analytics = lazy(() => import('./pages/Admin/Analytics'));
// const Settings = lazy(() => import('./pages/Admin/Settings'));

// Student Pages
const StudentDashboard = lazy(() => import("./pages/Student/Dashboard"));
const MyCourses = lazy(() => import("./pages/Student/MyCourses"));
const CoursePlayer = lazy(() => import("./pages/Student/CoursePlayer"));
const MyTests = lazy(() => import("./pages/Student/MyTests"));
const TestPage = lazy(() => import("./pages/Student/TestPage"));
const TestResult = lazy(() => import("./pages/Student/TestResult"));
const MyMaterials = lazy(() => import("./pages/Student/MyMaterials"));
const LiveClasses = lazy(() => import("./pages/Student/LiveClasses"));
const Profile = lazy(() => import("./pages/Student/Profile"));
// const Certificate = lazy(() => import('./pages/Student/Certificate'));
// const PaymentSuccess = lazy(() => import('./pages/Student/PaymentSuccess'));
// const PaymentFailed = lazy(() => import('./pages/Student/PaymentFailed'));

// 404 Page
const NotFound = lazy(() => import("./pages/Public/NotFound"));

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Admin Layout Wrapper
const AdminLayout = ({ children }) => {
  return (
    <Layout admin={true}>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </Layout>
  );
};

// Student Layout Wrapper
const StudentLayout = ({ children }) => {
  return (
    <Layout student={true}>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </Layout>
  );
};

// Public Layout Wrapper
const PublicLayout = ({ children }) => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />

            <Route
              path="/courses"
              element={
                <PublicLayout>
                  <Courses />
                </PublicLayout>
              }
            />

            <Route
              path="/courses/:id"
              element={
                <PublicLayout>
                  <CourseDetail />
                </PublicLayout>
              }
            />

            <Route
              path="/blogs"
              element={
                <PublicLayout>
                  <Blogs />
                </PublicLayout>
              }
            />

            <Route
              path="/blogs/:slug"
              element={
                <PublicLayout>
                  <BlogDetail />
                </PublicLayout>
              }
            />

            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />

            <Route
              path="/register"
              element={
                <PublicLayout>
                  <Register />
                </PublicLayout>
              }
            />

            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <Contact />
                </PublicLayout>
              }
            />

            <Route
              path="/about"
              element={
                <PublicLayout>
                  <About />
                </PublicLayout>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/courses"
              element={
                <AdminLayout>
                  <ManageCourses />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/courses/new"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <CourseForm />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/courses/edit/:id"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <CourseForm />
                </AdminLayout>
                // </ProtectedRoute>
              }
            />

            <Route
              path="/admin/courses/:id/content"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageCategories />
                </AdminLayout>
                // </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageCategories />
                </AdminLayout>
                // </ProtectedRoute>
              }
            />

            <Route
              path="/admin/videos"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageVideos />
                </AdminLayout>
                // </ProtectedRoute>
              }
            />

            <Route
              path="/admin/videos/new"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <VideoForm />
                </AdminLayout>
              }
            />

            <Route
              path="/admin/videos/edit/:id"
              element={
                // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <VideoForm />
                </AdminLayout>
              }
            />

            {/* 
            <Route path="/admin/materials" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageMaterials />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/admin/materials/new" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <MaterialForm />
                </AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin/materials/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <MaterialForm />
                </AdminLayout>
              </ProtectedRoute>
            } />*/}


            <Route path="/admin/tests" element={
              // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageTests />
                </AdminLayout>
            } /> 

             <Route path="/admin/tests/new" element={
              // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <TestForm />
                </AdminLayout>
         
            } />

         {/*   <Route path="/admin/tests/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <TestForm />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/admin/tests/:id/questions" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <TestQuestions />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/admin/tests/:id/results" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <TestResult />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            <Route
              path="/admin/students"
              element={
                <AdminLayout>
                  <ManageStudents />
                </AdminLayout>
              }
            />

            {/* <Route path="/admin/enrollments" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageEnrollments />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/admin/payments" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManagePayments />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            <Route path="/admin/blogs" element={
              // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageBlogs />
                </AdminLayout>
              
            } /> 

            {/* 
            <Route path="/admin/blogs/new" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            {/* <Route path="/admin/blogs/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <BlogForm />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
             
            <Route path="/admin/live-classes" element={
              // <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <ManageLiveClasses />
                </AdminLayout>
             
            } />

            {/* <Route path="/admin/live-classes/new" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <LiveClassForm />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            {/* <Route path="/admin/live-classes/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <LiveClassForm />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/admin/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            {/* <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            } /> */}

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/courses"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <MyCourses />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/courses/:courseId"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <CoursePlayer />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/courses/:courseId/learn"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <CoursePlayer />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/courses/:courseId/tests"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <MyTests />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/tests"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <MyTests />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/tests/:testId"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <TestPage />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/tests/:testId/result"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <TestResult />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/materials"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <MyMaterials />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/live-classes"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <LiveClasses />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <Profile />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            {/* 
            <Route path="/student/certificate/:enrollmentId" element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout>
                  <Certificate />
                </StudentLayout>
              </ProtectedRoute>
            } /> */}

            {/* Payment Routes */}
            {/* <Route path="/payment/success" element={
              <ProtectedRoute requiredRole="student">
                <PublicLayout>
                  <PaymentSuccess />
                </PublicLayout>
              </ProtectedRoute>
            } /> */}
            {/* 
            <Route path="/payment/failed" element={
              <ProtectedRoute requiredRole="student">
                <PublicLayout>
                  <PaymentFailed />
                </PublicLayout>
              </ProtectedRoute>
            } /> */}

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFound />
                </PublicLayout>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
