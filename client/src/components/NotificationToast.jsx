import { useSocket } from '../context/SocketContext';
import { X, Bell, Package, CheckCircle } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useSocket();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        >
          <div className="p-4 flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              notif.type === 'success' 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-blue-500/10 text-blue-500'
            }`}>
              {notif.type === 'success' ? <CheckCircle size={18} /> : <Package size={18} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {notif.title}
                </p>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                {notif.message}
              </p>
            </div>
          </div>
          <div className="h-1 bg-zinc-100 dark:bg-zinc-800 w-full">
            <div 
              className={`h-full ${notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} animate-progress`}
              style={{ animationDuration: '5000ms' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
