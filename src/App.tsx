import React from 'react';
import AppRoutes from './routes';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <AppRoutes />
      </div>
    </AppProvider>
  );
}
