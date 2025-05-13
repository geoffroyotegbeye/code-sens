import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MentoringPage from './pages/MentoringPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateCoursePage from './pages/CreateCoursePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';
import EditBlogPostPage from './pages/EditBlogPostPage';
import AboutPage from './pages/AboutPage';

// Protected route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/mentoring" element={<MentoringPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/edit/:slug" element={
            <ProtectedRoute>
              <EditBlogPostPage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses/new" 
            element={
              <ProtectedRoute requireAdmin>
                <CreateCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog/new" 
            element={
              <ProtectedRoute requireAdmin>
                <CreateBlogPostPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;