import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '@/shared/ui/Loader';
import { AppLayout } from '@/widgets/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Ленивая загрузка страниц
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const CouplesPage = lazy(() => import('@/pages/CouplesPage'));
const AlbumsPage = lazy(() => import('@/pages/AlbumsPage'));
const AlbumDetailPage = lazy(() => import('@/pages/AlbumDetailPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищённые маршруты с лейаутом */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/albums" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/couples" element={<CouplesPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:id" element={<AlbumDetailPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
