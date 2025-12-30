import { useState } from 'react';
import { Heart, Images, StickyNote, Gamepad2, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import MediaGallery from './MediaGallery';
import NotesSection from './NotesSection';
import GamesSection from './GamesSection';
import CoupleSection from './CoupleSection';
import HomeSection from './HomeSection';

type Tab = 'home' | 'media' | 'notes' | 'games' | 'couple';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'home' as Tab, label: 'Главная', icon: Heart },
    { id: 'media' as Tab, label: 'Медиа', icon: Images },
    { id: 'notes' as Tab, label: 'Заметки', icon: StickyNote },
    { id: 'games' as Tab, label: 'Игры', icon: Gamepad2 },
    { id: 'couple' as Tab, label: 'Пара', icon: Users },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h2 className="font-semibold">My Love</h2>
            <p className="text-sm text-gray-500">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeTab === item.id ? 'bg-red-500 hover:bg-red-600' : ''
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
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
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Sidebar */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              {/* Mobile Header */}
              <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  <span className="font-semibold">My Love</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'home' && <HomeSection />}
            {activeTab === 'media' && <MediaGallery />}
            {activeTab === 'notes' && <NotesSection />}
            {activeTab === 'games' && <GamesSection />}
            {activeTab === 'couple' && <CoupleSection />}
          </div>
        </main>
      </div>
    </div>
  );
}