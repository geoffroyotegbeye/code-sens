import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseLearnPage from './pages/CourseLearnPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateCoursePage from './pages/CreateCoursePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CreateBlogPostPage from './pages/CreateBlogPostPage';
import EditBlogPostPage from './pages/EditBlogPostPage';
import AboutPage from './pages/AboutPage';
import UserDashboardPage from './pages/UserDashboardPage';


// Pages admin du blog
import BlogPostsPage from './pages/admin/BlogPostsPage';
import BlogCategoriesPage from './pages/admin/BlogCategoriesPage';
import BlogCommentsPage from './pages/admin/BlogCommentsPage';
import BlogPostPreviewPage from './pages/admin/BlogPostPreviewPage';



// Pages admin générales
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCourseCategoriesPage from './pages/admin/AdminCourseCategoriesPage';
import AdminCourseModulesPage from './pages/admin/AdminCourseModulesPage';

function App() {
  // Protected route component - défini à l'intérieur du composant App pour avoir accès à l'AuthProvider
  const ProtectedRoute: React.FC<{ 
    children: React.ReactNode; 
    requireAdmin?: boolean;
  }> = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    // Afficher un écran de chargement pendant la vérification de l'authentification
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    // Rediriger vers le tableau de bord utilisateur si l'accès admin est requis mais l'utilisateur n'est pas admin
    if (requireAdmin && !isAdmin) {
      return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/learn" element={
            <ProtectedRoute>
              <CourseLearnPage />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />

          <Route path="/admin/blog/edit/:slug" element={
            <ProtectedRoute requireAdmin>
              <EditBlogPostPage />
            </ProtectedRoute>
          } />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
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
          
          {/* Routes admin générales */}
          <Route 
            path="/admin/overview" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminOverviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminCoursesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses/categories" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminCourseCategoriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminSettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Routes admin pour la gestion du blog */}
          <Route 
            path="/admin/blog/posts" 
            element={
              <ProtectedRoute requireAdmin>
                <BlogPostsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog/categories" 
            element={
              <ProtectedRoute requireAdmin>
                <BlogCategoriesPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/blog/comments" 
            element={
              <ProtectedRoute requireAdmin>
                <BlogCommentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/blog/preview/:slug" 
            element={
              <ProtectedRoute requireAdmin>
                <BlogPostPreviewPage />
              </ProtectedRoute>
            } 
          />
          

          
          {/* Fallback Route */}

          
          <Route path="/admin/courses/:courseId/modules" element={<AdminCourseModulesPage />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;