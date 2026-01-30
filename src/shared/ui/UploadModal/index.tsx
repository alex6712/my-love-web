import React, { useState, useCallback } from 'react';
import { X, Upload, File, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { mediaApi } from '@/services';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface FileUpload {
  id: string;
  file: File;
  title: string;
  description: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FileUpload[] = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        title: file.name.split('.')[0],
        description: '',
        progress: 0,
        status: 'pending' as const,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFileInfo = (id: string, updates: Partial<FileUpload>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const uploadFile = async (fileUpload: FileUpload) => {
    try {
      updateFileInfo(fileUpload.id, { status: 'uploading', progress: 0 });

      const metadata = {
        content_type: fileUpload.file.type,
        title: fileUpload.title,
        description: fileUpload.description || null,
      };

      const presignedResponse = await mediaApi.getPresignedUploadUrl(metadata);
      const { file_id, presigned_url } = presignedResponse.url;

      await fetch(presigned_url, {
        method: 'PUT',
        body: fileUpload.file,
        headers: {
          'Content-Type': fileUpload.file.type,
        },
      });

      updateFileInfo(fileUpload.id, { progress: 100 });

      await mediaApi.confirmUpload(file_id);

      updateFileInfo(fileUpload.id, { status: 'completed' });
    } catch (error) {
      updateFileInfo(fileUpload.id, {
        status: 'error',
        error: 'Ошибка загрузки',
      });
    }
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploadingCount(pendingFiles.length);

    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    const completedCount = files.filter((f) => f.status === 'completed').length;
    if (completedCount > 0) {
      toast.success(`Загружено ${completedCount} файлов`);
      onUploadComplete();
    }

    setUploadingCount(0);
  };

  const handleClose = () => {
    if (uploadingCount > 0) {
      if (!confirm('Загрузка仍在进行中。Вы уверены, что хотите закрыть?')) {
        return;
      }
    }
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  const completedCount = files.filter((f) => f.status === 'completed').length;
  const pendingCount = files.filter((f) => f.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold">Загрузка фотографий</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {files.length > 0
                ? `${files.length} файлов (${completedCount} загружено)`
                : 'Перетащите файлы сюда'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {files.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-romantic-pink bg-romantic-pink/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-romantic-pink/50'
              }`}
            >
              <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                Перетащите фотографии сюда
              </p>
              <p className="text-gray-500 mb-4">
                или нажмите для выбора файлов
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Button
                variant="primary"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Выбрать файлы
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`card p-4 ${
                    file.status === 'error' ? 'border-red-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <File className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {file.status === 'completed' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium truncate">
                          {file.file.name}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Название"
                        value={file.title}
                        onChange={(e) =>
                          updateFileInfo(file.id, { title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm mb-2"
                      />
                      <textarea
                        placeholder="Описание (необязательно)"
                        value={file.description}
                        onChange={(e) =>
                          updateFileInfo(file.id, {
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none"
                        rows={2}
                      />
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-romantic-pink transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {file.error && (
                        <p className="text-red-500 text-sm mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>
                    {file.status === 'pending' && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {pendingCount > 0
                ? `Готово к загрузке: ${pendingCount} файлов`
                : 'Все файлы загружены'}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Закрыть
              </Button>
              {pendingCount > 0 && (
                <Button
                  variant="primary"
                  leftIcon={
                    uploadingCount > 0 ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )
                  }
                  onClick={handleUpload}
                  isLoading={uploadingCount > 0}
                >
                  Загрузить ({pendingCount})
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
