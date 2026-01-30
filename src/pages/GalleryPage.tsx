import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Grid,
  List,
  LayoutGrid,
  Clock,
  Upload,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
  useMediaStore,
  useFilteredFiles,
  useFilesByDate,
} from '@/features/media/model/store';

type ViewMode = 'grid' | 'masonry' | 'timeline' | 'list';

const GalleryPage: React.FC = () => {
  const {
    files,
    isLoading,
    viewMode,
    searchQuery,
    selectedDate,
    setViewMode,
    setSearchQuery,
    setSelectedDate,
    fetchFiles,
  } = useMediaStore();

  const filteredFiles = useFilteredFiles();
  const filesByDate = useFilesByDate();

  const [, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const uniqueDates = Array.from(
    new Set(files.map((f) => f.created_at.split('T')[0]))
  )
    .sort()
    .reverse();

  if (isLoading && files.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-romantic-pink" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Загрузка галереи...
        </span>
      </div>
    );
  }

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="card overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedPhoto(file)}
        >
          <div className="aspect-square overflow-hidden relative">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-bold text-white text-sm truncate">
                {file.title}
              </h3>
              <p className="text-white/80 text-xs truncate">
                {file.description}
              </p>
            </div>
          </div>
          <div className="p-3 md:hidden">
            <h3 className="font-medium text-sm truncate">{file.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400 text-xs">
                {formatDateShort(file.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMasonryView = () => (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="break-inside-avoid card overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedPhoto(file)}
        >
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-bold text-white text-sm">{file.title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-8">
      {filesByDate.map(([date, dateFiles]) => (
        <div key={date}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-romantic-pink" />
              <h2 className="text-lg font-bold">{formatDate(date)}</h2>
            </div>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-500">
              {dateFiles.length} фото
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dateFiles.map((file) => (
              <div
                key={file.id}
                className="card overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedPhoto(file)}
              >
                <div className="aspect-square overflow-hidden relative">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="font-medium text-xs truncate">{file.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="card p-4 hover:shadow-md transition-all cursor-pointer"
          onClick={() => setSelectedPhoto(file)}
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📷</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{file.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                {file.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {formatDateShort(file.created_at)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
            Галерея
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Все ваши воспоминания в одном месте
          </p>
        </div>
        <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />}>
          Загрузить фото
        </Button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск фотографий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                leftIcon={<Calendar className="h-4 w-4" />}
                className="pr-10"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { mode: 'grid' as ViewMode, icon: Grid, label: 'Сетка' },
              {
                mode: 'masonry' as ViewMode,
                icon: LayoutGrid,
                label: 'Плитка',
              },
              { mode: 'timeline' as ViewMode, icon: Clock, label: 'Время' },
              { mode: 'list' as ViewMode, icon: List, label: 'Список' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Фотографии не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'masonry' && renderMasonryView()}
          {viewMode === 'timeline' && renderTimelineView()}
          {viewMode === 'list' && renderListView()}
        </>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {files.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Всего фото
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {uniqueDates.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Дней с фото
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {files.length > 0
              ? new Date(files[files.length - 1].created_at).getFullYear()
              : '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Год первого фото
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-romantic-pink">
            {files.length > 0
              ? new Date(files[0].created_at).getFullYear()
              : '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Год последнего фото
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
