import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="text-sm text-left hidden md:block">
          <div className="font-medium">{user?.name || 'User'}</div>
          <div className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</div>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "transform rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-border md:hidden">
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</div>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate('/profile'); }}
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => { setIsOpen(false); navigate('/settings'); }}
              className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
            <div className="border-t border-border my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
