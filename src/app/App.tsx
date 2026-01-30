import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@/widgets'
import { Notifications, AuthGuard } from '@/shared'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import HomePage from '@/pages/home'
import AlbumsPage from '@/pages/albums'
import FilesPage from '@/pages/files'
import NotesPage from '@/pages/notes'
import ProfilePage from '@/pages/profile'
import { routes } from '@/shared/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background dark:bg-background-dark">
          <Header />
          <Notifications />
          <main>
            <Routes>
              <Route path={routes.login} element={<LoginPage />} />
              <Route path={routes.register} element={<RegisterPage />} />
              <Route
                path={routes.home}
                element={
                  <AuthGuard>
                    <HomePage />
                  </AuthGuard>
                }
              />
              <Route
                path={routes.albums}
                element={
                  <AuthGuard>
                    <AlbumsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/albums/:id"
                element={
                  <AuthGuard>
                    <AlbumsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/albums/create"
                element={
                  <AuthGuard>
                    <AlbumsPage />
                  </AuthGuard>
                }
              />
              <Route
                path={routes.files}
                element={
                  <AuthGuard>
                    <FilesPage />
                  </AuthGuard>
                }
              />
              <Route
                path={routes.notes}
                element={
                  <AuthGuard>
                    <NotesPage />
                  </AuthGuard>
                }
              />
              <Route
                path={routes.profile}
                element={
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                }
              />
              <Route path="/" element={<Navigate to={routes.home} replace />} />
              <Route path="*" element={<Navigate to={routes.home} replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
