import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AlbumDetail from './components/AlbumDetail';
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

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <Dashboard>
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/media" element={<MediaGallery />} />
        <Route path="/media/album/:albumId" element={<AlbumDetail />} />
        <Route path="/notes" element={<NotesSection />} />
        <Route path="/games" element={<GamesSection />} />
        <Route path="/couple" element={<CoupleSection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Dashboard>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

import HomeSection from './components/HomeSection';
import MediaGallery from './components/MediaGallery';
import NotesSection from './components/NotesSection';
import GamesSection from './components/GamesSection';
import CoupleSection from './components/CoupleSection';
