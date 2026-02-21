import { useState, useEffect } from "react";
import {
  Plus,
  Gift,
  MapPin,
  Heart,
  Star,
  Sparkles,
  Trash2,
  Loader2,
  Layers,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  createNote,
  deleteNote,
  getNotes,
  NoteDTO,
  NoteType,
} from "../utils/notesApi";

const NOTE_TYPES: {
  id: NoteType;
  label: string;
  icon: typeof Gift;
  color: string;
}[] = [
  {
    id: "WISHLIST",
    label: "Вишлисты",
    icon: Gift,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "DREAM",
    label: "Мечты",
    icon: MapPin,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "GRATITUDE",
    label: "Благодарности",
    icon: Heart,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "MEMORY",
    label: "Воспоминания",
    icon: Star,
    color: "bg-yellow-100 text-yellow-700",
  },
];

const ALL_TYPE = {
  id: "ALL" as const,
  label: "Все",
  icon: Layers,
  color: "bg-gray-100 text-gray-700",
};

const NOTE_TYPE_COLORS: Record<
  NoteType,
  { color: string; icon: typeof Gift; label: string }
> = {
  WISHLIST: {
    color: "bg-pink-100 text-pink-700",
    icon: Gift,
    label: "Вишлисты",
  },
  DREAM: {
    color: "bg-purple-100 text-purple-700",
    icon: MapPin,
    label: "Мечты",
  },
  GRATITUDE: {
    color: "bg-red-100 text-red-700",
    icon: Heart,
    label: "Благодарности",
  },
  MEMORY: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Star,
    label: "Воспоминания",
  },
};

type ActiveType = NoteType | "ALL";

export default function NotesSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState<ActiveType>("WISHLIST");
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    type: NoteType;
  }>({
    title: "",
    content: "",
    type: "WISHLIST",
  });

  const limit = 12;

  useEffect(() => {
    loadNotes(0);
  }, [activeType]);

  const loadNotes = async (pageNum: number, append: boolean = false) => {
    const typeParam = activeType === "ALL" ? undefined : activeType;

    if (pageNum === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await getNotes(typeParam, pageNum * limit, limit);

      if (append) {
        setNotes((prev) => [...prev, ...data.notes]);
      } else {
        setNotes(data.notes);
      }

      setHasMore(data.notes.length >= limit);
      setPage(pageNum);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка загрузки заметок",
      );
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    loadNotes(page + 1, true);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote({
        title: newNote.title || undefined,
        content: newNote.content,
        type: newNote.type,
      });
      toast.success("Заметка создана!");
      setNewNote({
        title: "",
        content: "",
        type: activeType === "ALL" ? "WISHLIST" : activeType,
      });
      setDialogOpen(false);
      loadNotes(0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка создания заметки",
      );
    }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote(noteId);
      toast.success("Заметка удалена");
      loadNotes(0);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка удаления заметки",
      );
    }
  };

  const getNoteTypeInfo = (type: NoteType) => {
    return NOTE_TYPE_COLORS[type];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl mb-1">Заметки 📝</h1>
          <p className="text-gray-600">Ваши мысли, мечты и воспоминания</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (open) {
              setNewNote((prev) => ({
                ...prev,
                type: activeType === "ALL" ? "WISHLIST" : activeType,
              }));
            }
            setDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Новая заметка
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать заметку</DialogTitle>
              <DialogDescription>Добавьте новую заметку</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип заметки</label>
                <Select
                  value={newNote.type}
                  onValueChange={(value) =>
                    setNewNote({ ...newNote, type: value as NoteType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Заголовок</label>
                <Input
                  placeholder="Название заметки (необязательно)"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Содержание *</label>
                <Textarea
                  placeholder="Напишите что-нибудь..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Создать
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={activeType}
        onValueChange={(value) => setActiveType(value as ActiveType)}
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
          <TabsTrigger value="ALL" className="gap-2">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Все</span>
          </TabsTrigger>
          {NOTE_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.id} value={type.id} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">Нет заметок</h3>
              <p className="text-gray-600 mb-4">Создайте первую заметку</p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => {
                const typeInfo = getNoteTypeInfo(note.type);
                const TypeIcon = typeInfo.icon;
                return (
                  <Card
                    key={note.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group relative"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={typeInfo.color}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {typeInfo.label}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteNote(note.id, e)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {note.title || "Без названия"}
                      </CardTitle>
                      <CardDescription>
                        {new Date(note.created_at).toLocaleDateString("ru-RU")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-3">
                        {note.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    "Показать ещё"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
