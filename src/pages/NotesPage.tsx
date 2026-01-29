import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const NOTE_TYPES = {
  WISHLIST: {
    label: 'Вишлист',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  DREAM: {
    label: 'Мечта',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  GRATITUDE: {
    label: 'Благодарность',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  MEMORY: {
    label: 'Воспоминание',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
};

const MOCK_NOTES = [
  {
    id: '1',
    title: 'Хочу новый фотоаппарат',
    content: 'Canon EOS R6 Mark II для съёмки наших путешествий',
    type: 'WISHLIST' as keyof typeof NOTE_TYPES,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Путешествие в Японию',
    content: 'Поехать весной на сакуру и посмотреть Токио, Киото, Осаку',
    type: 'DREAM' as keyof typeof NOTE_TYPES,
    created_at: '2024-01-10',
  },
  {
    id: '3',
    title: 'Спасибо за поддержку',
    content:
      'Благодарю за то, что всегда веришь в меня и поддерживаешь в трудные моменты',
    type: 'GRATITUDE' as keyof typeof NOTE_TYPES,
    created_at: '2024-01-05',
  },
  {
    id: '4',
    title: 'Наша первая встреча',
    content:
      'Помню, как мы познакомились в том кафе на Арбате. Шёл дождь, а в душе расцветала весна.',
    type: 'MEMORY' as keyof typeof NOTE_TYPES,
    created_at: '2023-12-20',
  },
];

const NotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredNotes = MOCK_NOTES.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || note.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-romantic font-bold text-gray-900 dark:text-white">
            Заметки
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ваши мысли, мечты и благодарности
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Новая заметка
        </Button>
      </div>

      {/* Панель фильтров */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск заметок..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === 'ALL' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedType('ALL')}
            >
              Все
            </Button>
            {Object.entries(NOTE_TYPES).map(([key, value]) => (
              <Button
                key={key}
                variant={selectedType === key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedType(key)}
              >
                {value.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Список заметок */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Заметки не найдены
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Попробуйте изменить параметры поиска или создайте новую заметку
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${NOTE_TYPES[note.type].color}`}
                >
                  {NOTE_TYPES[note.type].label}
                </span>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-1">
                {note.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {note.content}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {new Date(note.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          ))}

          {/* Кнопка добавления новой заметки */}
          <button className="card border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-romantic-pink hover:bg-romantic-pink/5 transition-colors flex flex-col items-center justify-center p-8">
            <div className="h-12 w-12 rounded-full bg-romantic-pink/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-romantic-pink" />
            </div>
            <p className="font-medium">Создать заметку</p>
            <p className="text-sm text-gray-500 mt-1">Добавить новую заметку</p>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${NOTE_TYPES[note.type].color}`}
                    >
                      {NOTE_TYPES[note.type].label}
                    </span>
                    <h3 className="font-bold text-lg truncate">{note.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {note.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(note.created_at).toLocaleDateString('ru-RU')}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
