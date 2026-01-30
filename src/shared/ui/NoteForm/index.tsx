import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
  NoteType,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '@/services/types';

interface NoteFormProps {
  initialData?: Partial<CreateNoteRequest> & { id?: string };
  onSubmit: (data: CreateNoteRequest | UpdateNoteRequest) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const typeOptions: {
  value: NoteType;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    value: 'WISHLIST',
    label: 'Вишлист',
    icon: '🎁',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
  },
  {
    value: 'DREAM',
    label: 'Мечта',
    icon: '✨',
    color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
  },
  {
    value: 'GRATITUDE',
    label: 'Благодарность',
    icon: '🙏',
    color: 'border-green-500 bg-green-50 dark:bg-green-950/30',
  },
  {
    value: 'MEMORY',
    label: 'Воспоминание',
    icon: '💝',
    color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
  },
];

export const NoteForm: React.FC<NoteFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [type, setType] = useState<NoteType>(
    (initialData?.type as NoteType) || 'WISHLIST'
  );
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

  useEffect(() => {
    if (initialData?.type) {
      setType(initialData.type as NoteType);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'Введите заголовок';
    if (!content.trim()) newErrors.content = 'Введите содержание';
    if (title.length > 100) newErrors.title = 'Заголовок слишком длинный';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title: title.trim(),
      content: content.trim(),
      ...(initialData?.id ? {} : { type }),
    };

    await onSubmit(data as CreateNoteRequest | UpdateNoteRequest);
  };

  const selectedTypeConfig = typeOptions.find((t) => t.value === type)!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${selectedTypeConfig.color} border-2`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-xl font-bold">
            {initialData?.id ? 'Редактировать' : 'Новая'} заметка
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-900/80"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Тип заметки
            </label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    type === option.value
                      ? `${option.color} border-current`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg mr-2">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Input
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              maxLength={100}
            />
          </div>

          <div>
            <textarea
              placeholder="Содержание заметки..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full min-h-[120px] p-3 rounded-lg border ${
                errors.content
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-romantic-pink'
              } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all resize-none`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {initialData?.id ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
