import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Moon, Sun, LayoutDashboard, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardLayout = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            GigFlow CRM
          </div>
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="md:hidden">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link to="/clients" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Users className="h-5 w-5" />
            <span>Clients</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-end px-6 shrink-0 hidden md:flex">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
