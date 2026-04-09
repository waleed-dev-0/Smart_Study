import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import UploadPage from '../pages/UploadPage';
import DocumentLibraryPage from '../pages/DocumentLibraryPage';
import SummaryResultsPage from '../pages/SummaryResultsPage';
import QuestionBankPage from '../pages/QuestionBankPage';
import AIChatPage from '../pages/AIChatPage';
import SettingsPage from '../pages/SettingsPage';
import AboutUsPage from '../pages/AboutUsPage';
import ReportsPage from '../pages/ReportsPage';

export default function AppRoutes() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage isAdmin={isAdmin} />} />
        <Route path="/upload" element={<UploadPage isAdmin={isAdmin} />} />
        <Route path="/library" element={<DocumentLibraryPage isAdmin={isAdmin} />} />
        <Route path="/summary" element={<SummaryResultsPage isAdmin={isAdmin} />} />
        <Route path="/question-bank" element={<QuestionBankPage isAdmin={isAdmin} />} />
        <Route path="/chat" element={<AIChatPage isAdmin={isAdmin} />} />
        <Route path="/settings" element={<SettingsPage isAdmin={isAdmin} />} />
        <Route path="/about" element={<AboutUsPage isAdmin={isAdmin} />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}
