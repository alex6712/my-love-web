import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { albumsApi, filesApi, notesApi } from '@/shared/api'
import { Card, AlbumCard, FileCard, NoteCard } from '@/shared/ui'
import { routes } from '@/shared/config'
import { Heart, FileText, Plus } from 'lucide-react'

export default function HomePage() {
  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => albumsApi.getAlbums({ limit: 3 }),
  })

  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => filesApi.getFiles({ limit: 6 }),
  })

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getNotes({ limit: 3 }),
  })

  return (
    <div className="min-h-screen bg-romantic-gradient dark:bg-romantic-gradient-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-rose-900 dark:text-rose-100 sm:text-5xl">
            Ваш цифровой сад
          </h1>
          <p className="mt-4 text-lg text-rose-700 dark:text-rose-300">
            Место для ваших самых важных воспоминаний
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card gradient className="flex items-center gap-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-400/20 text-rose-600 dark:text-rose-400">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Ваше пространство</h3>
              <p className="text-sm text-rose-600 dark:text-rose-300">
                Всё самое важное в одном месте
              </p>
            </div>
          </Card>

          <Link to={routes.albumCreate}>
            <Card gradient className="flex items-center gap-4 p-6 transition-transform hover:scale-105">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender-400/20 text-lavender-600 dark:text-lavender-400">
                <Plus className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Создать альбом</h3>
                <p className="text-sm text-rose-600 dark:text-rose-300">Начните новую коллекцию</p>
              </div>
            </Card>
          </Link>

          <Link to={routes.notes}>
            <Card gradient className="flex items-center gap-4 p-6 transition-transform hover:scale-105">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-400/20 text-rose-600 dark:text-rose-400">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Добавить заметку</h3>
                <p className="text-sm text-rose-600 dark:text-rose-300">Запишите важную мысль</p>
              </div>
            </Card>
          </Link>
        </div>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">Последние альбомы</h2>
            <Link
              to={routes.albums}
              className="text-sm font-semibold text-rose-500 hover:text-rose-700 dark:text-lavender-400"
            >
              Все альбомы →
            </Link>
          </div>
          {albumsLoading ? (
            <div className="text-center text-rose-600 dark:text-rose-300">Загрузка...</div>
          ) : albumsData?.data.albums.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albumsData.data.albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onOpen={() => window.location.href = routes.album(album.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center">
              <p className="text-rose-600 dark:text-rose-300">
                У вас пока нет альбомов. Создайте первый!
              </p>
            </Card>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">Последние фото</h2>
            <Link
              to={routes.files}
              className="text-sm font-semibold text-rose-500 hover:text-rose-700 dark:text-lavender-400"
            >
              Все фото →
            </Link>
          </div>
          {filesLoading ? (
            <div className="text-center text-rose-600 dark:text-rose-300">Загрузка...</div>
          ) : filesData?.data.files.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filesData.data.files.slice(0, 6).map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center">
              <p className="text-rose-600 dark:text-rose-300">
                Загрузите ваши первые воспоминания!
              </p>
            </Card>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">Последние заметки</h2>
            <Link
              to={routes.notes}
              className="text-sm font-semibold text-rose-500 hover:text-rose-700 dark:text-lavender-400"
            >
              Все заметки →
            </Link>
          </div>
          {notesLoading ? (
            <div className="text-center text-rose-600 dark:text-rose-300">Загрузка...</div>
          ) : notesData?.data.notes.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notesData.data.notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center">
              <p className="text-rose-600 dark:text-rose-300">
                Создайте свою первую заметку!
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
