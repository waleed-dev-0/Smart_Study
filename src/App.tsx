import React from 'react';
import AppRoutes from './routes';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <AppRoutes />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
