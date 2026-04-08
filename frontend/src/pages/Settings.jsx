import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import NotificationSettings from '../components/profile/NotificationSettings';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({});

  useEffect(() => {
    fetchNotificationPrefs();
  }, []);

  const fetchNotificationPrefs = async () => {
    try {
      const response = await api.get('/users/notifications');
      setNotificationPrefs(response.data.preferences);
    } catch (error) {
      console.error('Failed to fetch notification preferences');
    }
  };

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await api.put(`/users/${user._id}`, data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await api.post('/auth/change-password', data);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      throw error;
    }
  };

  const handleUpdateAvatar = async (formData) => {
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    updateUser(response.data.user);
  };

  const handleUpdateNotifications = async (preferences) => {
    await api.put('/users/notifications', preferences);
    setNotificationPrefs(preferences);
    toast.success('Notification preferences saved');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'password', label: 'Password', icon: KeyIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-2 sticky top-20">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Profile Information</h2>
                    <p className="text-sm text-surface-500">Update your personal details</p>
                  </div>
                  <div className="p-6 flex flex-col items-center border-b border-surface-200">
                    <AvatarUpload
                      currentAvatar={user?.avatar}
                      onUpload={handleUpdateAvatar}
                      size="lg"
                    />
                    <p className="text-sm text-surface-500 mt-3">Click the camera icon to upload a photo</p>
                  </div>
                  <div className="p-6">
                    <ProfileForm
                      user={user}
                      onSubmit={handleUpdateProfile}
                      loading={loading}
                    />
                  </div>
                </Card>
              )}

              {activeTab === 'password' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Change Password</h2>
                    <p className="text-sm text-surface-500">Update your password to keep your account secure</p>
                  </div>
                  <div className="p-6">
                    <ChangePasswordForm onSubmit={handleChangePassword} />
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Notification Preferences</h2>
                    <p className="text-sm text-surface-500">Choose how you want to be notified</p>
                  </div>
                  <div className="p-6">
                    <NotificationSettings
                      settings={notificationPrefs}
                      onSubmit={handleUpdateNotifications}
                    />
                  </div>
                </Card>
              )}

              {activeTab === 'appearance' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Appearance</h2>
                    <p className="text-sm text-surface-500">Customize the look and feel of your dashboard</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-surface-700">Theme Mode</label>
                      <div className="grid grid-cols-3 gap-3">
                        {themeOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setTheme(option.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              theme === option.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-surface-200 hover:border-primary-300'
                            }`}
                          >
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <p className={`font-medium ${
                              theme === option.id ? 'text-primary-700' : 'text-surface-700'
                            }`}>
                              {option.label}
                            </p>
                            {theme === option.id && (
                              <p className="text-xs text-primary-600 mt-1">✓ Selected</p>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-surface-500 mt-3">
                        Current: {theme === 'system' ? `${isDark ? 'Dark' : 'Light'} (System)` : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'preferences' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Preferences</h2>
                    <p className="text-sm text-surface-500">Customize your experience</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Language</label>
                      <select className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Time Zone</label>
                      <select className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-surface-900">Compact View</p>
                        <p className="text-xs text-surface-500">Show more items per page</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-5 bg-surface-300 rounded-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'privacy' && (
                <Card>
                  <div className="p-6 border-b border-surface-200">
                    <h2 className="text-lg font-semibold text-surface-900">Privacy & Security</h2>
                    <p className="text-sm text-surface-500">Manage your privacy settings</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-surface-900">Profile Visibility</p>
                        <p className="text-xs text-surface-500">Who can see your profile</p>
                      </div>
                      <select className="rounded-lg border border-surface-300 px-3 py-1 text-sm">
                        <option>Everyone</option>
                        <option>Teachers & Staff Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-surface-900">Show Email in Profile</p>
                        <p className="text-xs text-surface-500">Display your email to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-surface-300 rounded-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
                      </label>
                    </div>
                    <div className="pt-4">
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete Account
                      </button>
                      <p className="text-xs text-surface-500 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;