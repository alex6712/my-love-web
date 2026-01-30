import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { notesApi, type NoteType } from '@/shared/api'
import { NoteCard, Modal, Button, Input, Spinner } from '@/shared/ui'
import { useUIStore } from '@/shared/store'
import { cn } from '@/shared/lib'
import { Plus, Gift, Heart, Lightbulb, Clock, FileText } from 'lucide-react'

  const noteTypes: { value: NoteType[keyof NoteType]; label: string; icon: JSX.Element }[] = [
  { value: 'WISHLIST', label: 'Желания', icon: <Gift className="h-5 w-5 text-rose-500" /> },
  { value: 'GRATITUDE', label: 'Благодарность', icon: <Heart className="h-5 w-5 text-rose-500" /> },
  { value: 'IDEA', label: 'Идеи', icon: <Lightbulb className="h-5 w-5 text-lavender-500" /> },
  { value: 'MEMORY', label: 'Воспоминания', icon: <Clock className="h-5 w-5 text-rose-500" /> },
  { value: 'OTHER', label: 'Прочее', icon: <FileText className="h-5 w-5 text-gray-500" /> },
]

export default function NotesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'MEMORY' as NoteType[keyof NoteType],
  })
  const queryClient = useQueryClient()
  const addNotification = useUIStore((state) => state.addNotification)

  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getNotes({ limit: 100 }),
  })

  const createMutation = useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      addNotification('success', 'Заметка создана!')
      setShowCreateModal(false)
      setFormData({ title: '', content: '', type: 'MEMORY' })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: typeof formData }) =>
      notesApi.updateNote(noteId, data),
    onSuccess: () => {
      addNotification('success', 'Заметка обновлена!')
      setShowEditModal(false)
      setFormData({ title: '', content: '', type: 'MEMORY' })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => notesApi.deleteNote(noteId),
    onSuccess: () => {
      addNotification('success', 'Заметка удалена!')
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const notes = notesData?.data.notes || []

  const handleCreate = () => {
    createMutation.mutate(formData)
  }

  const handleEdit = () => {
    if (!selectedNoteId) return
    updateMutation.mutate({ noteId: selectedNoteId, data: formData })
  }

  return (
    <div className="min-h-screen bg-romantic-gradient dark:bg-romantic-gradient-dark">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-rose-900 dark:text-rose-100">Заметки</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Новая заметка
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : notes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => {
                  setSelectedNoteId(note.id)
                  setFormData({ title: note.title, content: note.content, type: note.type })
                  setShowEditModal(true)
                }}
                onDelete={() => deleteMutation.mutate(note.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-rose-600 dark:text-rose-300">
            У вас пока нет заметок. Создайте первую!
          </div>
        )}
      </div>

      <Modal isOpen={showCreateModal || showEditModal} onClose={() => {
        setShowCreateModal(false)
        setShowEditModal(false)
        setFormData({ title: '', content: '', type: 'MEMORY' })
      }} title={showEditModal ? 'Редактировать заметку' : 'Новая заметка'}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            showEditModal ? handleEdit() : handleCreate()
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap gap-2">
            {noteTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value })}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
                  formData.type === type.value
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-lavender-900/30 dark:text-rose-300 dark:hover:bg-lavender-900/50',
                )}
              >
                {type.icon}
                <span className="text-sm">{type.label}</span>
              </button>
            ))}
          </div>
          <Input
            label="Название"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Название заметки"
          />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-rose-700 dark:text-rose-200">Содержание</span>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Напишите что-нибудь важное..."
              rows={6}
              className="w-full rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 text-rose-900 placeholder-rose-300 transition-all duration-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-lavender-700 dark:bg-surface-dark dark:text-rose-100 dark:placeholder-lavender-400 dark:focus:border-lavender-500 dark:focus:ring-lavender-900/20"
              required
            />
          </label>
          <Button
            type="submit"
            disabled={!formData.content || (showEditModal ? updateMutation.isPending : createMutation.isPending)}
          >
            {showEditModal ? 'Сохранить' : 'Создать'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
