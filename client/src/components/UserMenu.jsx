import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { User, LogOut, Package, Heart, Clock, Settings, ChevronDown, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        const menu = document.getElementById('user-menu-dropdown');
        if (menu && !menu.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('scroll', updateMenuPosition, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) updateMenuPosition();
    setIsOpen((prev) => !prev);
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile', description: 'Personal details & address' },
    { icon: Package, label: 'My Orders', path: '/orders', description: 'Tracking & order history' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', description: 'Saved products' },
    { icon: Clock, label: 'Search History', path: '/recent-searches', description: 'Recent search queries' },
    { icon: Settings, label: 'Settings', path: '/settings', description: 'Preferences & theme' },
  ];

  const dropdown = isOpen
    ? createPortal(
        <>
          <div
            className="fixed inset-0 z-[200]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            id="user-menu-dropdown"
            className="fixed z-[201] w-64 glass-panel rounded-xl shadow-xl overflow-hidden"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-surface-hover rounded transition-colors text-white/50 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-hover transition-colors text-white/80 hover:text-white group"
                >
                  <item.icon className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-none">{item.label}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 truncate">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-1.5 border-t border-border flex items-center justify-between px-3 py-2">
              <span className="text-xs text-white/60">Display Mode</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-white transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{isDark ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            <div className="p-1.5 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-rose-500/10 text-white/80 hover:text-rose-400 transition-colors text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5 text-white/50 group-hover:text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <>
      <div className="relative z-50" ref={triggerRef}>
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors text-xs font-medium text-white/80 hover:text-white"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <User className="w-3.5 h-3.5 text-white/60" />
          <span className="truncate max-w-[120px]">{user?.name}</span>
          <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {dropdown}
    </>
  );
};

export default UserMenu;
