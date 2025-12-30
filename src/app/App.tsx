import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-red-50 to-purple-50">
        <div className="text-center">
          <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
