import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { albumsApi, filesApi } from '@/shared/api'
import { Card, AlbumCard, FileCard, Modal, Button, Input, Spinner } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { Plus, Search, Upload } from 'lucide-react'
import { useUIStore } from '@/shared/store'
import type { AlbumDTO, FileDTO } from '@/shared/api/types'

export default function AlbumsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAttachModal, setShowAttachModal] = useState(false)
  const [createFormData, setCreateFormData] = useState({ title: '', description: '' })
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const queryClient = useQueryClient()
  const addNotification = useUIStore((state) => state.addNotification)

  const { data: albumsData, isLoading: albumsLoading } = useQuery({
    queryKey: ['albums', searchQuery],
    queryFn: () =>
      searchQuery
        ? albumsApi.searchAlbums({ q: searchQuery, limit: 50 })
        : albumsApi.getAlbums({ limit: 50 }),
  })

  const { data: albumDetail, isLoading: albumDetailLoading } = useQuery({
    queryKey: ['album', selectedAlbumId],
    queryFn: () => albumsApi.getAlbum(selectedAlbumId!),
    enabled: !!selectedAlbumId,
  })

  const { data: filesData } = useQuery({
    queryKey: ['files'],
    queryFn: () => filesApi.getFiles({ limit: 100 }),
    enabled: showAttachModal,
  })

  const createAlbumMutation = useMutation({
    mutationFn: albumsApi.createAlbum,
    onSuccess: () => {
      addNotification('success', 'Альбом создан!')
      setShowCreateModal(false)
      setCreateFormData({ title: '', description: '' })
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
  } as UseMutationOptions<any, void, unknown>)

  const attachFilesMutation = useMutation({
    mutationFn: ({ albumId, files }: { albumId: string; files: string[] }) =>
      albumsApi.attachFiles(albumId, { files_uuids: files }),
    onSuccess: () => {
      addNotification('success', 'Файлы добавлены!')
      setShowAttachModal(false)
      setSelectedFiles([])
      queryClient.invalidateQueries({ queryKey: ['album', selectedAlbumId] })
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  } as UseMutationOptions<any, void, unknown>)

  const deleteAlbumMutation = useMutation({
    mutationFn: (albumId: string) => albumsApi.deleteAlbum(albumId),
    onSuccess: () => {
      addNotification('success', 'Альбом удалён!')
      setSelectedAlbumId(null)
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
  } as UseMutationOptions<any, void, unknown>)

  const albums = albumsData?.data?.albums || []
  const album = albumDetail?.data?.album
  const files = filesData?.data?.files || []

  return (
    <div className="min-h-screen bg-romantic-gradient dark:bg-romantic-gradient-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-rose-900 dark:text-rose-100">Альбомы</h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-400" />
              <Input
                type="text"
                placeholder="Поиск альбомов..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} />
              Создать альбом
            </Button>
          </div>
        </div>

        {selectedAlbumId ? (
          <div className="animate-slide-up">
            <Button variant="ghost" onClick={() => setSelectedAlbumId(null)} className="mb-6">
              ← Назад к альбомам
            </Button>
            {albumDetailLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : album ? (
              <>
                <Card className="mb-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                        {album.title}
                      </h2>
                      {album.description && (
                        <p className="mt-2 text-rose-600 dark:text-rose-300">{album.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setShowAttachModal(true)}>
                        <Upload size={16} />
                        Добавить файлы
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteAlbumMutation.mutate(album.id)}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                </Card>

                {album.items && album.items.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {album.items.map((file: FileDTO) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                  </div>
                ) : (
                  <Card className="py-12 text-center">
                    <p className="text-rose-600 dark:text-rose-300">
                      В этом альбоме пока нет файлов.
                    </p>
                  </Card>
                )}
              </>
            ) : null}
          </div>
        ) : (
          <>
            {albumsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : albums.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {albums.map((album: AlbumDTO) => (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    onOpen={() => setSelectedAlbumId(album.id)}
                    onDelete={() => deleteAlbumMutation.mutate(album.id)}
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
          </>
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Создать альбом">
        <form
          onSubmit={e => {
            e.preventDefault()
            createAlbumMutation.mutate(createFormData)
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Название"
            value={createFormData.title}
            onChange={e => setCreateFormData({ ...createFormData, title: e.target.value })}
            placeholder="Название альбома"
            required
          />
          <Input
            label="Описание"
            value={createFormData.description}
            onChange={e => setCreateFormData({ ...createFormData, description: e.target.value })}
            placeholder="Описание альбома"
          />
          <Button
            type="submit"
            disabled={createAlbumMutation.isPending || !createFormData.title}
          >
            Создать
          </Button>
        </form>
      </Modal>

      <Modal isOpen={showAttachModal} onClose={() => setShowAttachModal(false)} title="Добавить файлы">
        {files.length > 0 && album ? (
          <div className="flex flex-col gap-4">
            <div className="grid max-h-96 grid-cols-2 gap-3 overflow-auto">
              {files.map((file: FileDTO) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() =>
                    setSelectedFiles((prev) =>
                      prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
                    )
                  }
                  className={cn(
                    'relative overflow-hidden rounded-xl border-2 transition-all',
                    selectedFiles.includes(file.id)
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                      : 'border-rose-200 hover:border-rose-300 dark:border-lavender-700 dark:hover:border-lavender-600',
                  )}
                >
                  {file.content_type.startsWith('image/') ? (
                    <img
                      src={`/api/media/files/${file.id}/download`}
                      alt={file.title}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center text-rose-400">
                      📁
                    </div>
                  )}
                </button>
              ))}
            </div>
            <Button
              onClick={() =>
                attachFilesMutation.mutate({ albumId: album.id, files: selectedFiles })
              }
              disabled={attachFilesMutation.isPending || selectedFiles.length === 0}
            >
              Добавить выбранные ({selectedFiles.length})
            </Button>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
      </Modal>
    </div>
  )
}
