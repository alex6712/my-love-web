import { useState } from 'react';
import { Plus, Gift, MapPin, Heart, Star, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface Note {
  id: number;
  title: string;
  content: string;
  type: 'wishlist' | 'dream' | 'gratitude' | 'memory';
  createdAt: string;
}

export default function NotesSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<Note['type']>('wishlist');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
  });

  // Mock data - в реальном приложении загружается с сервера
  const notes: Note[] = [
    {
      id: 1,
      title: 'Новый телефон',
      content: 'iPhone 15 Pro в цвете Natural Titanium',
      type: 'wishlist',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Путешествие в Японию',
      content: 'Хочу увидеть цветение сакуры в Киото',
      type: 'dream',
      createdAt: '2024-01-10',
    },
    {
      id: 3,
      title: 'Спасибо за поддержку',
      content: 'Благодарю за то, что всегда рядом в трудные моменты',
      type: 'gratitude',
      createdAt: '2024-01-20',
    },
    {
      id: 4,
      title: 'Наша первая встреча',
      content: 'Помню этот день как сейчас - кафе на углу улицы, твоя улыбка...',
      type: 'memory',
      createdAt: '2023-12-01',
    },
  ];

  const noteTypes = [
    { id: 'wishlist', label: 'Вишлисты', icon: Gift, color: 'bg-pink-100 text-pink-700' },
    { id: 'dream', label: 'Мечты', icon: MapPin, color: 'bg-purple-100 text-purple-700' },
    { id: 'gratitude', label: 'Благодарности', icon: Heart, color: 'bg-red-100 text-red-700' },
    { id: 'memory', label: 'Воспоминания', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении отправляем на сервер
    console.log('Creating note:', { ...newNote, type: activeType });
    setNewNote({ title: '', content: '' });
    setDialogOpen(false);
  };

  const filteredNotes = notes.filter((note) => note.type === activeType);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
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
              <DialogDescription>Добавьте новую заметку типа "{noteTypes.find(t => t.id === activeType)?.label}"</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Заголовок *</label>
                <Input
                  placeholder="Название заметки"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
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

      {/* Tabs */}
      <Tabs value={activeType} onValueChange={(value) => setActiveType(value as Note['type'])}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          {noteTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.id} value={type.id} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {noteTypes.map((type) => (
          <TabsContent key={type.id} value={type.id}>
            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <type.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={type.color}>
                          <type.icon className="w-3 h-3 mr-1" />
                          {type.label}
                        </Badge>
                        <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                      </div>
                      <CardTitle className="line-clamp-2">{note.title}</CardTitle>
                      <CardDescription>{new Date(note.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
