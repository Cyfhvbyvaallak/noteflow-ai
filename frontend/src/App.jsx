import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { RecordLecture } from './pages/RecordLecture';
import { UploadLecture } from './pages/UploadLecture';
import { LectureDetail } from './pages/LectureDetail';
import { MyNotes } from './pages/MyNotes';
import { Summaries } from './pages/Summaries';
import { RevisionCenter } from './pages/RevisionCenter';
import { QuizHub } from './pages/QuizHub';
import { QuizTake } from './pages/QuizTake';
import { GlobalSearch } from './pages/GlobalSearch';
import { ProfileSettings } from './pages/ProfileSettings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated Study Workspace */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/record" element={<RecordLecture />} />
              <Route path="/upload" element={<UploadLecture />} />
              <Route path="/lectures/:id" element={<LectureDetail />} />
              <Route path="/notes" element={<MyNotes />} />
              <Route path="/summaries" element={<Summaries />} />
              <Route path="/revision" element={<RevisionCenter />} />
              <Route path="/quizzes" element={<QuizHub />} />
              <Route path="/quizzes/:id/take" element={<QuizTake />} />
              <Route path="/search" element={<GlobalSearch />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
