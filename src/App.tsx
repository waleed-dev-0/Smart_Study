import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import DashboardPage from './components/DashboardPage';
import UploadPage from './components/UploadPage';
import DocumentLibraryPage from './components/DocumentLibraryPage';
import SummaryResultsPage from './components/SummaryResultsPage';
import QuestionBankPage from './components/QuestionBankPage';
import AIChatPage from './components/AIChatPage';
import SettingsPage from './components/SettingsPage';
import AboutUsPage from './components/AboutUsPage';
import ReportsPage from './components/ReportsPage';

type Screen = 'landing' | 'login' | 'register' | 'reset_password' | 'dashboard' | 'upload' | 'library' | 'summary' | 'question_bank' | 'chat' | 'settings' | 'about' | 'reports';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isAdmin, setIsAdmin] = useState(true); // Default to true for review, but can be controlled via auth

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {currentScreen === 'landing' && <LandingPage onNavigate={setCurrentScreen} />}
      {currentScreen === 'login' && <LoginPage onNavigate={setCurrentScreen} />}
      {currentScreen === 'register' && <RegisterPage onNavigate={setCurrentScreen} />}
      {currentScreen === 'reset_password' && <ResetPasswordPage onNavigate={setCurrentScreen} />}
      {currentScreen === 'dashboard' && <DashboardPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'upload' && <UploadPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'library' && <DocumentLibraryPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'summary' && <SummaryResultsPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'question_bank' && <QuestionBankPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'chat' && <AIChatPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'reports' && <ReportsPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'settings' && <SettingsPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
      {currentScreen === 'about' && <AboutUsPage onNavigate={setCurrentScreen} isAdmin={isAdmin} />}
    </div>
  );
}
