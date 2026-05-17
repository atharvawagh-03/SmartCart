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
      title: 'Account Settings',
      icon: Shield,
      items: [
        { label: 'Change Password', description: 'Update your password', icon: Lock },
        { label: 'Privacy Settings', description: 'Manage your privacy preferences', icon: Shield },
        { label: 'Delete Account', description: 'Permanently delete your account', icon: Lock, danger: true },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', description: 'Receive push notifications', toggle: notifications, onToggle: () => setNotifications((n) => !n) },
        { label: 'Email Updates', description: 'Receive email updates', toggle: emailUpdates, onToggle: () => setEmailUpdates((n) => !n) },
      ]
    },
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        {
          label: 'Dark Mode',
          description: isDark ? 'Dark theme enabled' : 'Light theme enabled',
          icon: isDark ? Moon : Sun,
          toggle: isDark,
          onToggle: toggleTheme,
        },
        { label: 'Language', description: 'English (India)', icon: Globe },
        { label: 'Currency', description: 'Indian Rupee (₹)', icon: Globe, static: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <SettingsIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <div className="space-y-8">
              {settingsSections.map((section, sectionIndex) => {
                const SectionIcon = section.icon;
                return (
                  <div key={sectionIndex}>
                    <div className="flex items-center gap-3 mb-4">
                      <SectionIcon className="w-5 h-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                    </div>
                    
                    <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
                      {section.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex}
                          className={`flex items-center justify-between p-4 ${
                            itemIndex !== section.items.length - 1 ? 'border-b border-white/10' : ''
                          } hover:bg-white/5 transition-colors`}
                        >
                          <div className="flex items-center gap-4">
                            {item.icon && (
                              <div className="p-2 rounded-lg bg-white/5">
                                <item.icon className={`w-4 h-4 ${item.danger ? 'text-red-400' : 'text-white/60'}`} />
                              </div>
                            )}
                            <div>
                              <p className={`text-white font-medium ${item.danger ? 'text-red-400' : ''}`}>{item.label}</p>
                              <p className="text-white/50 text-sm">{item.description}</p>
                            </div>
                          </div>
                          
                          {item.toggle !== undefined ? (
                            <button
                              type="button"
                              onClick={() => item.onToggle()}
                              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                item.toggle ? 'bg-purple-500' : 'bg-white/10'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  item.toggle ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          ) : item.static ? (
                            <span className="text-sm font-medium text-purple-400">₹ INR</span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-white/40" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-red-400 text-sm">
                <strong>Warning:</strong> Some settings changes may require you to log in again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
