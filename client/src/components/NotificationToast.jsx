import { useSocket } from '../context/SocketContext';
import { X, Bell, Package, CheckCircle2 } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useSocket();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-surface border border-border rounded-lg shadow-lg overflow-hidden animate-in"
        >
          <div className="p-3 flex items-start gap-2.5">
            <div className={`p-1.5 rounded-md ${
              notif.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-blue-500/10 text-blue-500'
            }`}>
              {notif.type === 'success' ? <CheckCircle2 size={16} /> : <Package size={16} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-white">
                  {notif.title}
                </p>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="text-white/40 hover:text-white transition-colors p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-[11px] text-white/50 mt-0.5 line-clamp-2">
                {notif.message}
              </p>
            </div>
          </div>
          <div className="h-0.5 bg-border w-full">
            <div 
              className={`h-full ${notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-600'} animate-progress`}
              style={{ animationDuration: '5000ms' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
