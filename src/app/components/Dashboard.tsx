import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Images, StickyNote, Gamepad2, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: '/', label: 'Главная', icon: Heart },
    { id: '/media', label: 'Медиа', icon: Images },
    { id: '/notes', label: 'Заметки', icon: StickyNote },
    { id: '/games', label: 'Игры', icon: Gamepad2 },
    { id: '/couple', label: 'Пара', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h2 className="font-semibold">My Love</h2>
            <p className="text-sm text-gray-500">@{user?.username}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <li key={item.id}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    active ? 'bg-red-500 hover:bg-red-600' : ''
                  }`}
                  onClick={() => navigate(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-purple-50">
      <div className="flex h-screen">
        <aside className="hidden md:block w-64 bg-white border-r">
          <SidebarContent />
        </aside>

        <main className="flex-1 overflow-auto">
          <Sheet>
            <SheetTrigger asChild>
              <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <span className="font-semibold">My Love</span>
                </div>
                <div className="w-10" />
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
