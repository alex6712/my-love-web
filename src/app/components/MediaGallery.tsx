import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderHeart, Image as ImageIcon, Calendar, MoreVertical, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { useAuth } from './AuthContext';
import { API_URL } from '../constants/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface CreatorDTO {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface Album {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  is_private: boolean;
  creator: CreatorDTO;
  created_at: string;
}

export default function MediaGallery() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    is_private: false,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await authenticatedFetch(`${API_URL}/v1/media/albums`);

      if (response.ok) {
        const data = await response.json();
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
      const response = await authenticatedFetch(`${API_URL}/v1/media/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAlbum.title,
          description: newAlbum.description || null,
          is_private: newAlbum.is_private,
        }),
      });

      if (response.ok) {
        toast.success('Альбом создан! 📸');
        setNewAlbum({ title: '', description: '', is_private: false });
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

  const deleteAlbum = async (albumId: string) => {
    try {
      await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}`, {
        method: 'DELETE',
      });

      toast.success('Альбом удалён');
      fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('Не удалось удалить альбом');
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
              <div className="flex items-center justify-between">
                <Label htmlFor="is_private">Личный альбом</Label>
                <Switch
                  id="is_private"
                  checked={newAlbum.is_private}
                  onCheckedChange={(checked) => setNewAlbum({ ...newAlbum, is_private: checked })}
                />
              </div>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Создать
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
            <Card
              key={album.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-0 relative">
                <div
                  className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 rounded-t-lg flex items-center justify-center group-hover:from-pink-300 group-hover:to-purple-300 transition-colors cursor-pointer"
                  onClick={() => navigate(`/media/album/${album.id}`)}
                >
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded-full p-1 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/media/album/${album.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Открыть
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Переименовать
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить альбом?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя отменить. Все файлы в альбоме будут удалены.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAlbum(album.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle
                  className="mb-2 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => navigate(`/media/album/${album.id}`)}
                >
                  {album.title}
                </CardTitle>
                {album.description && (
                  <CardDescription className="mb-3 line-clamp-2">
                    {album.description}
                  </CardDescription>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
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
