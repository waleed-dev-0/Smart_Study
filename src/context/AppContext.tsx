import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  avatar: string;
  language: string;
  role: string;
  points: number;
}

interface AppContextType {
  user: User | null;
  isArabic: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If not logged in, fallback to local storage language or English
        const localLang = localStorage.getItem("language") || "English";
        const isAr = localLang === 'Arabic';
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        // We still need to expose isArabic even if user is null. We can compute it in the component.
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get('/user/profile');
        if (res.data) {
          setUser(res.data);
          const isAr = res.data.language === 'Arabic';
          document.documentElement.dir = isAr ? 'rtl' : 'ltr';
          localStorage.setItem("language", res.data.language);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        const localLang = localStorage.getItem("language") || "English";
        document.documentElement.dir = localLang === 'Arabic' ? 'rtl' : 'ltr';
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateLanguage = (lang: string) => {
    if (user) {
      setUser({ ...user, language: lang });
      api.put("/user/profile", { language: lang }).catch(() => {});
    }
    localStorage.setItem("language", lang);
    const isAr = lang === 'Arabic';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  };

  const isArabic = user ? user.language === 'Arabic' : (localStorage.getItem("language") === 'Arabic');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-academic-blue/20 border-t-academic-blue rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm animate-pulse">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, isArabic, isLoading, setUser, updateLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
