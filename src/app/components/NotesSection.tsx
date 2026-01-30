import { useState, useEffect } from 'react';
import { Plus, Gift, MapPin, Heart, Star, Sparkles, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  createNote,
  deleteNote,
  getNotes,
  NoteDTO,
  NoteType,
} from '../utils/notesApi';

const NOTE_TYPES: { id: NoteType; label: string; icon: typeof Gift; color: string }[] = [
  { id: 'WISHLIST', label: 'Вишлисты', icon: Gift, color: 'bg-pink-100 text-pink-700' },
  { id: 'DREAM', label: 'Мечты', icon: MapPin, color: 'bg-purple-100 text-purple-700' },
  { id: 'GRATITUDE', label: 'Благодарности', icon: Heart, color: 'bg-red-100 text-red-700' },
  { id: 'MEMORY', label: 'Воспоминания', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
];

const FRONTEND_NOTE_TYPES: Record<NoteType, 'wishlist' | 'dream' | 'gratitude' | 'memory'> = {
  WISHLIST: 'wishlist',
  DREAM: 'dream',
  GRATITUDE: 'gratitude',
  MEMORY: 'memory',
};

export default function NotesSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<NoteType>('WISHLIST');
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузки заметок');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote({
        title: newNote.title || undefined,
        content: newNote.content,
        type: activeType,
      });
      toast.success('Заметка создана!');
      setNewNote({ title: '', content: '' });
      setDialogOpen(false);
      loadNotes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка создания заметки');
    }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote(noteId);
      toast.success('Заметка удалена');
      loadNotes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка удаления заметки');
    }
  };

  const filteredNotes = notes.filter((note) => note.type === activeType);

  const getNoteTypeInfo = (type: NoteType) => {
    return NOTE_TYPES.find((t) => t.id === type) || NOTE_TYPES[0];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1">Заметки 📝</h1>
          <p className="text-gray-600">Ваши мысли, мечты и воспоминания</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Новая заметка
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать заметку</DialogTitle>
              <DialogDescription>Добавьте новую заметку типа "{getNoteTypeInfo(activeType).label}"</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Заголовок</label>
                <Input
                  placeholder="Название заметки (необязательно)"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Содержание *</label>
                <Textarea
                  placeholder="Напишите что-нибудь..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Создать
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeType} onValueChange={(value) => setActiveType(value as NoteType)}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          {NOTE_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.id} value={type.id} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : NOTE_TYPES.map((type) => {
          const Icon = type.icon;
          const typeNotes = notes.filter((n) => n.type === type.id);
          return (
            <TabsContent key={type.id} value={type.id}>
              {typeNotes.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">Нет заметок типа "{type.label}"</h3>
                    <p className="text-gray-600 mb-4">Создайте первую заметку</p>
                    <Button onClick={() => setDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Создать
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeNotes.map((note) => (
                    <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer group relative">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={type.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {type.label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleDeleteNote(note.id, e)}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">{note.title || 'Без названия'}</CardTitle>
                        <CardDescription>
                          {new Date(note.created_at).toLocaleDateString('ru-RU')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 line-clamp-3">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
