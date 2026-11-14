import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Lock, Globe, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        {
          label: 'Theme',
          description: isDark ? 'Dark theme enabled' : 'Light theme enabled',
          icon: isDark ? Moon : Sun,
          toggle: isDark,
          onToggle: toggleTheme,
        },
        { label: 'Language', description: 'English (India)', icon: Globe },
        { label: 'Currency', description: 'Indian Rupee (₹)', icon: Globe, static: true },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', description: 'Delivery & status alerts', toggle: notifications, onToggle: () => setNotifications((n) => !n) },
        { label: 'Email Summaries', description: 'Order receipts and digest', toggle: emailUpdates, onToggle: () => setEmailUpdates((n) => !n) },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Change Password', description: 'Update current login password', icon: Lock },
        { label: 'Privacy Policy', description: 'Data storage and session management', icon: Shield },
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors p-1" aria-label="Back to home">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">SmartCart</span>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs font-medium text-white/60">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Account Preferences
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Customize display theme, notifications, and security options.
          </p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <div key={sectionIndex} className="space-y-3">
                <div className="flex items-center gap-2">
                  <SectionIcon className="w-4 h-4 text-white/50" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    {section.title}
                  </h2>
                </div>
                
                <div className="glass-panel rounded-xl divide-y divide-border overflow-hidden">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <div className="p-2 rounded-lg bg-black/10 dark:bg-white/5 border border-border">
                            <item.icon className="w-4 h-4 text-white/70" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-white">{item.label}</p>
                          <p className="text-[11px] text-white/50">{item.description}</p>
                        </div>
                      </div>
                      
                      {item.toggle !== undefined ? (
                        <button
                          type="button"
                          onClick={() => item.onToggle()}
                          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            item.toggle ? 'bg-blue-600' : 'bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              item.toggle ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      ) : item.static ? (
                        <span className="text-xs font-medium text-white/60 tabular-nums">INR (₹)</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/30" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Settings;
