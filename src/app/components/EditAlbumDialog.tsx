"use client";

import { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { updateAlbum } from '../utils/albumsApi';
import { AlbumDTO } from '../utils/albumsApi';
import { toast } from 'sonner';

interface EditAlbumDialogProps {
  album: AlbumDTO;
  onAlbumUpdated: (updatedAlbum: AlbumDTO) => void;
  children?: React.ReactNode;
}

export function EditAlbumDialog({ album, onAlbumUpdated, children }: EditAlbumDialogProps) {
  const { authenticatedFetch } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description || '');
  const [isPrivate, setIsPrivate] = useState(album.is_private);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(album.title);
      setDescription(album.description || '');
      setIsPrivate(album.is_private);
    }
  }, [open, album]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedAlbum = await updateAlbum(album.id, {
        title: title !== album.title ? title : undefined,
        description: description !== (album.description || '') ? description : undefined,
        is_private: isPrivate,
      }, authenticatedFetch);
      onAlbumUpdated(updatedAlbum);
      setOpen(false);
      toast.success('Альбом обновлён');
    } catch (error) {
      toast.error('Не удалось обновить альбом');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings2 className="w-4 h-4 mr-2" />
            Изменить альбом
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Изменить альбом</DialogTitle>
            <DialogDescription>
              Измените название, описание или видимость альбома.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название альбома"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание альбома"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_private"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              />
              <Label htmlFor="is_private" className="cursor-pointer">
                Личный альбом (доступен только мне)
              </Label>
            </div>

            {!isPrivate && (
              <p className="text-sm text-muted-foreground">
                Общий альбом доступен вам и вашему партнёру.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
