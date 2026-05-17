import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { User, LogOut, Package, Heart, Clock, Settings, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);

  const updateMenuPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
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
    { icon: User, label: 'Profile', path: '/profile', description: 'View and edit your profile' },
    { icon: Package, label: 'My Orders', path: '/orders', description: 'Track current & past orders' },
    { icon: Clock, label: 'Recent Searches', path: '/recent-searches', description: 'View your search history' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', description: 'Your saved items' },
    { icon: Settings, label: 'Settings', path: '/settings', description: 'Account settings' },
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
            className="fixed z-[201] w-72 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/60">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                    <item.icon className="w-4 h-4 text-white/80 group-hover:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-white/50">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-4 h-4 text-white/80 group-hover:text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                    Logout
                  </p>
                  <p className="text-xs text-white/50">Sign out of your account</p>
                </div>
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <User className="w-4 h-4 text-white/80" />
          <span className="text-sm font-medium text-white/80">{user?.name}</span>
          <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {dropdown}
    </>
  );
};

export default UserMenu;
