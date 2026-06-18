import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FolderHeart,
  Image as ImageIcon,
  Calendar,
  MoreVertical,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
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
import { ApiError } from '../utils/apiError';
import { translateApiCode } from '../constants/apiCodes';
import { searchAlbums, getAlbums, AlbumDTO } from '../utils/albumsApi';
import { EditAlbumDialog } from './EditAlbumDialog';

export default function MediaGallery() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();
  const [albums, setAlbums] = useState<AlbumDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    is_private: false,
  });

  const limit = 12;

  useEffect(() => {
    loadAlbums(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadAlbums = async (pageNum: number, append: boolean = false) => {
    if (pageNum === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await getAlbums(pageNum * limit, limit, authenticatedFetch);

      if (append) {
        setAlbums((prev) => [...prev, ...data.albums]);
      } else {
        setAlbums(data.albums);
      }

      setHasMore(data.albums.length >= limit);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast.error('Ошибка при загрузке альбомов');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    loadAlbums(page + 1, true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAlbums(searchQuery, 0.15, 50, authenticatedFetch);
      setAlbums(results);
      setHasMore(false);
    } catch (error) {
      toast.error(error instanceof ApiError ? translateApiCode(error.code) : 'Ошибка поиска');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadAlbums(0);
  };

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = (await import('../constants/api')).API_URL;
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
        loadAlbums(0);
      } else {
        const error = await response.json();
        toast.error(translateApiCode(error.code, 'Не удалось создать альбом'));
      }
    } catch (error) {
      console.error('Error creating album:', error);
      toast.error('Ошибка при создании альбома');
    }
  };

  const deleteAlbum = async (albumId: string) => {
    try {
      const API_URL = (await import('../constants/api')).API_URL;
      const response = await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.code, error.detail);
      }

      toast.success('Альбом удалён');
      loadAlbums(0);
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error(
        error instanceof ApiError ? translateApiCode(error.code) : 'Не удалось удалить альбом',
      );
    }
  };

  const handleAlbumUpdated = (updatedAlbum: AlbumDTO) => {
    setAlbums((prev) => prev.map((album) => (album.id === updatedAlbum.id ? updatedAlbum : album)));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-400 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка альбомов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1">Медиа-галерея 📸</h1>
          <p className="text-gray-600 dark:text-gray-400">Ваши совместные воспоминания</p>
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_private"
                  checked={newAlbum.is_private}
                  onCheckedChange={(checked) =>
                    setNewAlbum({ ...newAlbum, is_private: checked as boolean })
                  }
                />
                <Label htmlFor="is_private" className="cursor-pointer">
                  Личный альбом (доступен только мне)
                </Label>
              </div>
              {!newAlbum.is_private && (
                <p className="text-sm text-muted-foreground">
                  Общий альбом доступен вам и вашему партнёру.
                </p>
              )}
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Создать
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
          <Input
            placeholder="Поиск альбомов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Search className="w-12 h-12 text-gray-400 dark:text-gray-400 animate-pulse mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Поиск...</p>
          </div>
        </div>
      ) : albums.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderHeart className="w-16 h-16 text-gray-400 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg mb-2">
              {searchQuery ? 'Альбомы не найдены' : 'Пока нет альбомов'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? 'Попробуйте изменить запрос'
                : 'Создайте первый альбом для ваших воспоминаний'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Создать альбом
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card key={album.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0 relative">
                  <div
                    className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-950 dark:to-purple-950 rounded-t-lg flex items-center justify-center group-hover:from-pink-300 group-hover:to-purple-300 transition-colors cursor-pointer"
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
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-1 cursor-pointer">
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/media/album/${album.id}`)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Открыть
                      </DropdownMenuItem>
                      <EditAlbumDialog album={album} onAlbumUpdated={handleAlbumUpdated}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Изменить
                        </DropdownMenuItem>
                      </EditAlbumDialog>
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
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(album.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && !searchQuery && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  'Показать ещё'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
