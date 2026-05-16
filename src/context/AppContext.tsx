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
  const [storedLang, setStoredLang] = useState(() => localStorage.getItem("language") || "English");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const lang = localStorage.getItem("language") || "English";
        setStoredLang(lang);
        document.documentElement.dir = lang === 'Arabic' ? 'rtl' : 'ltr';
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
          setStoredLang(res.data.language);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        const lang = localStorage.getItem("language") || "English";
        document.documentElement.dir = lang === 'Arabic' ? 'rtl' : 'ltr';
        setStoredLang(lang);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateLanguage = (lang: string) => {
    localStorage.setItem("language", lang);
    setStoredLang(lang);
    document.documentElement.dir = lang === 'Arabic' ? 'rtl' : 'ltr';
    if (user) {
      setUser({ ...user, language: lang });
      api.put("/user/profile", { language: lang }).catch(() => {});
    }
  };

  const isArabic = user ? user.language === 'Arabic' : storedLang === 'Arabic';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cafe-primary-light/20 border-t-cafe-primary-light rounded-full animate-spin" />
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
