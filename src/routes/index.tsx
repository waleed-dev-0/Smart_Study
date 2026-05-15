import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UpdatePasswordPage from '../pages/UpdatePasswordPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import DashboardPage from '../pages/DashboardPage';
import UploadPage from '../pages/UploadPage';
import DocumentLibraryPage from '../pages/DocumentLibraryPage';
import SummaryResultsPage from '../pages/SummaryResultsPage';
import QuestionBankPage from '../pages/QuestionBankPage';
import AIChatPage from '../pages/AIChatPage';
import SettingsPage from '../pages/SettingsPage';
import AboutUsPage from '../pages/AboutUsPage';
import ReportsPage from '../pages/ReportsPage';
import AcademicRecordsPage from '../pages/AcademicRecordsPage';
import QuizHistoryPage from '../pages/QuizHistoryPage';

function getIsAdmin(): boolean {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).role === "admin";
  } catch {
    return false;
  }
}

export default function AppRoutes() {
  const isAdmin = getIsAdmin();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/update-password/:token" element={<UpdatePasswordPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><DocumentLibraryPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/summary/:documentId" element={<ProtectedRoute><SummaryResultsPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/question-bank" element={<ProtectedRoute><QuestionBankPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AIChatPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutUsPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
        <Route path="/academic-records" element={<ProtectedRoute><AcademicRecordsPage isAdmin={isAdmin} /></ProtectedRoute>} />
        <Route path="/quiz-history" element={<ProtectedRoute><QuizHistoryPage isAdmin={isAdmin} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
