import { useState, useEffect } from 'react';
import { Plus, FolderHeart, Image as ImageIcon, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface Album {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  is_private: boolean;
  creator: {
    id: string;
    username: string;
    avatar_url?: string | null;
    is_active: boolean;
    created_at: string;
  };
  created_at: string;
  photos_count: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://api.my-love-application.ru';

export default function MediaGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/media/albums`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // API возвращает { albums: AlbumDTO[] }
        setAlbums(Array.isArray(data.albums) ? data.albums : []);
      } else {
        setAlbums([]);
        toast.error('Не удалось загрузить альбомы');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setAlbums([]);
      toast.error('Ошибка при загрузке альбомов');
    } finally {
      setIsLoading(false);
    }
  };

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/v1/media/albums`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum),
      });

      if (response.ok) {
        toast.success('Альбом создан! 📸');
        setNewAlbum({ title: '', description: '' });
        setDialogOpen(false);
        fetchAlbums();
      } else {
        toast.error('Не удалось создать альбом');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      toast.error('Ошибка при создании альбома');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600">Загрузка альбомов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1">Медиа-галерея 📸</h1>
          <p className="text-gray-600">Ваши совместные воспоминания</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Новый альбом
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать альбом</DialogTitle>
              <DialogDescription>Добавьте новый альбом для хранения ваших фото</DialogDescription>
            </DialogHeader>
            <form onSubmit={createAlbum} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  placeholder="Например: Отпуск в горах"
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Расскажите об этом альбоме..."
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Создать
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg mb-2">Пока нет альбомов</h3>
            <p className="text-gray-600 mb-4">Создайте первый альбом для ваших воспоминаний</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Создать альбом
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="p-0">
                <div className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 rounded-t-lg flex items-center justify-center group-hover:from-pink-300 group-hover:to-purple-300 transition-colors">
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <FolderHeart className="w-16 h-16 text-white" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="mb-2">{album.title}</CardTitle>
                {album.description && (
                  <CardDescription className="mb-3 line-clamp-2">{album.description}</CardDescription>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    <span>{album.photos_count} фото</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(album.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}