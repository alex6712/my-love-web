import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Trash2,
  FileImage,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
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
import { useAuth } from './AuthContext';
import { API_URL } from '../constants/api';
import { useFileUpload, UploadProgress } from '../hooks/useFileUpload';
import { MEDIA_CONFIG, formatFileSize } from '../constants/media';
import { getDownloadPresignedUrl } from '../utils/fileApi';
import { toast } from 'sonner';

interface CreatorDTO {
  id: string;
  username: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

interface FileDTO {
  id: string;
  object_key: string;
  status: 'PENDING' | 'UPLOADED' | 'FAILED' | 'DELETED';
  content_type: string;
  title: string;
  description?: string | null;
  geo_data?: Record<string, unknown> | null;
  creator: CreatorDTO;
  created_at: string;
}

interface AlbumWithItemsDTO {
  id: string;
  created_at: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  is_private: boolean;
  creator: CreatorDTO;
  items: FileDTO[];
}

export default function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { user, authenticatedFetch } = useAuth();
  const { uploads, uploadFiles, removeUpload, clearCompleted, isUploading } = useFileUpload({
    authenticatedFetch,
  });

  const [album, setAlbum] = useState<AlbumWithItemsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileDTO | null>(null);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlbum = useCallback(async () => {
    if (!albumId) return;

    try {
      const response = await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}`);

      if (!response.ok) {
        throw new Error('Album not found');
      }

      const data = await response.json();
      setAlbum(data.album);

      const urls: Record<string, string> = {};
      for (const item of data.album.items || []) {
        if (item.content_type.startsWith('image/') || item.content_type.startsWith('video/')) {
          try {
            const presignedUrl = await getDownloadPresignedUrl(item.id);
            urls[item.id] = presignedUrl;
          } catch (error) {
            console.error(`Failed to get URL for file ${item.id}:`, error);
          }
        }
      }
      setFileUrls(urls);
    } catch (error) {
      console.error('Error fetching album:', error);
      toast.error('Не удалось загрузить альбом');
      navigate('/media');
    } finally {
      setIsLoading(false);
    }
  }, [albumId, navigate, authenticatedFetch]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const handleDeleteAlbum = async () => {
    if (!albumId) return;

    try {
      await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}`, {
        method: 'DELETE',
      });

      toast.success('Альбом удалён');
      navigate('/media');
    } catch (error) {
      console.error('Error deleting album:', error);
      toast.error('Не удалось удалить альбом');
    }
  };

  const handleFilesUpload = async (files: FileList) => {
    if (!albumId || files.length === 0) return;

    setIsUploadingFiles(true);

    try {
      const fileIds = await uploadFiles(files);

      if (fileIds.length > 0) {
        await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}/attach`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files_uuids: fileIds }),
        });

        toast.success('Файлы добавлены в альбом');
        fetchAlbum();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesUpload(e.target.files);
    }
  };

  const handleAddSingleFile = async () => {
    if (!albumId || !fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    setIsUploadingFiles(true);

    try {
      const fileIds = await uploadFiles(
        fileInputRef.current.files,
        newFileTitle || file.name
      );

      if (fileIds.length > 0) {
        await authenticatedFetch(`${API_URL}/v1/media/albums/${albumId}/attach`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files_uuids: fileIds }),
        });

        toast.success('Файл добавлен в альбом');
        setNewFileTitle('');
        setNewFileDescription('');
        setFileDialogOpen(false);
        fetchAlbum();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isOwner = album?.creator.id === user?.id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Загрузка альбома...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Альбом не найден</p>
          <Button onClick={() => navigate('/media')} className="mt-4">
            Вернуться к галерее
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/media')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к галерее
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-2">{album.title}</h1>
            {album.description && (
              <p className="text-gray-600">{album.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Создано {new Date(album.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>

          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить альбом
                </Button>
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
                  <AlertDialogAction onClick={handleDeleteAlbum} className="bg-red-500 hover:bg-red-600">
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragOver
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={MEDIA_CONFIG.SUPPORTED_TYPES.join(',')}
            onChange={handleFileSelect}
            multiple
          />

          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Перетащите файлы сюда</p>
          <p className="text-sm text-gray-500 mb-4">
            или нажмите для выбора
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span>Макс. размер: {formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE_BYTES)}</span>
            <span>•</span>
            <span>
              {MEDIA_CONFIG.SUPPORTED_TYPES.map((t) => t.split('/')[1]).join(', ')}
            </span>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingFiles}
            className="mt-4 bg-red-500 hover:bg-red-600"
          >
            {isUploadingFiles ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Выбрать файлы
          </Button>
        </div>
      </div>

      {uploads.length > 0 && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Загрузка файлов</h2>
              {uploads.some((u) => u.status === 'completed') && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Очистить завершённые
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploads.map((upload) => (
                <UploadItem key={upload.id} upload={upload} onRemove={() => removeUpload(upload.id)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Файлы ({album.items.length})
        </h2>

        {album.items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">В этом альбоме пока нет файлов</p>
              <p className="text-sm text-gray-500">
                Загрузите фотографии или видео, чтобы сохранить воспоминания
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.items.map((file) => (
              <Card
                key={file.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedFile(file)}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  {file.content_type.startsWith('image/') ? (
                    <img
                      src={fileUrls[file.id] || ''}
                      alt={file.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : file.content_type.startsWith('video/') ? (
                    <Video className="w-16 h-16 text-gray-400" />
                  ) : (
                    <FileImage className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium truncate">{file.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.title}</DialogTitle>
          </DialogHeader>

          {selectedFile && (
            <div className="space-y-4">
              {selectedFile.content_type.startsWith('image/') && (
                <img
                  src={fileUrls[selectedFile.id] || ''}
                  alt={selectedFile.title}
                  className="w-full rounded-lg"
                />
              )}

              {selectedFile.description && (
                <p className="text-gray-600">{selectedFile.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  Загружено{' '}
                  {new Date(selectedFile.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadItem({
  upload,
  onRemove,
}: {
  upload: UploadProgress;
  onRemove: () => void;
}) {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
      case 'uploading':
      case 'confirming':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {getStatusIcon()}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm truncate">{upload.fileName}</p>
          <p className="text-xs text-gray-500">
            {upload.status === 'completed'
              ? '100%'
              : upload.status === 'error'
              ? upload.error
              : `${upload.progress}%`}
          </p>
        </div>

        {upload.status !== 'error' && (
          <Progress value={upload.progress} className="h-1" />
        )}
      </div>

      {(upload.status === 'completed' || upload.status === 'error') && (
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
