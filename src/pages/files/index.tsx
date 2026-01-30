import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { filesApi } from '@/shared/api'
import { FileCard, Modal, Button, Input, Spinner } from '@/shared/ui'
import { useUIStore } from '@/shared/store'
import { Upload } from 'lucide-react'

export default function FilesPage() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '' })
  const queryClient = useQueryClient()
  const addNotification = useUIStore((state) => state.addNotification)

  const { data: filesData, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => filesApi.getFiles({ limit: 100 }),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const idempotencyKey = crypto.randomUUID()
      const { data } = await filesApi.getPresignedUrl(
        {
          content_type: file.type,
          filename: file.name,
          title: file.name.split('.')[0],
          description: '',
        },
        idempotencyKey,
      )

      await fetch(data.presigned_url, {
        method: 'PUT',
        body: file,
      })

      await filesApi.confirmUpload({ file_id: data.file_id })
    },
    onSuccess: () => {
      addNotification('success', 'Файл загружен!')
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ fileId, data }: { fileId: string; data: { title: string; description?: string } }) =>
      filesApi.updateFile(fileId, data),
    onSuccess: () => {
      addNotification('success', 'Файл обновлён!')
      setShowEditModal(false)
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => filesApi.deleteFile(fileId),
    onSuccess: () => {
      addNotification('success', 'Файл удалён!')
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const files = filesData?.data.files || []

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) return

    try {
      for (let i = 0; i < uploadFiles.length; i++) {
        await uploadMutation.mutateAsync(uploadFiles[i])
      }
      setShowUploadModal(false)
      setUploadFiles(null)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const handleEdit = () => {
    if (!selectedFileId) return
    updateMutation.mutate({ fileId: selectedFileId, data: editFormData })
  }

  return (
    <div className="min-h-screen bg-romantic-gradient dark:bg-romantic-gradient-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-rose-900 dark:text-rose-100">Файлы</h1>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={20} />
            Загрузить файлы
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : files.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={async () => {
                  const { data } = await filesApi.getDownloadUrl(file.id)
                  window.open(data.presigned_url, '_blank')
                }}
                onEdit={() => {
                  setSelectedFileId(file.id)
                  setEditFormData({ title: file.title, description: file.description || '' })
                  setShowEditModal(true)
                }}
                onDelete={() => deleteMutation.mutate(file.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-rose-600 dark:text-rose-300">
            У вас пока нет файлов. Загрузите первые воспоминания!
          </div>
        )}
      </div>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Загрузить файлы">
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-rose-300 bg-rose-50 p-8 transition-colors hover:border-rose-400 dark:border-lavender-700 dark:bg-lavender-900/20">
            <Upload className="h-12 w-12 text-rose-400" />
            <span className="mt-2 text-rose-600 dark:text-rose-300">
              Нажмите для выбора файлов
            </span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setUploadFiles(e.target.files)}
            />
          </label>
          {uploadFiles && (
            <p className="text-center text-rose-600 dark:text-rose-300">
              Выбрано файлов: {uploadFiles.length}
            </p>
          )}
          <Button
            onClick={handleUpload}
            disabled={!uploadFiles || uploadMutation.isPending}
          >
            Загрузить
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Редактировать файл">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="flex flex-col gap-4">
          <Input
            label="Название"
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            required
          />
          <Input
            label="Описание"
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
          />
          <Button type="submit" disabled={updateMutation.isPending}>
            Сохранить
          </Button>
        </form>
      </Modal>
    </div>
  )
}
