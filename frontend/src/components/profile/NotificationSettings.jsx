import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  CalendarIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

const NotificationSettings = ({ settings, onSubmit }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: settings?.emailNotifications ?? true,
    pushNotifications: settings?.pushNotifications ?? true,
    assignmentReminders: settings?.assignmentReminders ?? true,
    examReminders: settings?.examReminders ?? true,
    announcementAlerts: settings?.announcementAlerts ?? true,
    eventReminders: settings?.eventReminders ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(preferences);
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'General Notifications',
      icon: BellIcon,
      items: [
        { key: 'emailNotifications', label: 'Email Notifications', icon: EnvelopeIcon, description: 'Receive updates via email' },
        { key: 'pushNotifications', label: 'Push Notifications', icon: DevicePhoneMobileIcon, description: 'Receive updates on your device' },
      ],
    },
    {
      title: 'Academic Alerts',
      icon: AcademicCapIcon,
      items: [
        { key: 'assignmentReminders', label: 'Assignment Reminders', icon: BellIcon, description: 'Get notified about upcoming assignments' },
        { key: 'examReminders', label: 'Exam Reminders', icon: BellIcon, description: 'Get notified about upcoming exams' },
      ],
    },
    {
      title: 'School Communications',
      icon: MegaphoneIcon,
      items: [
        { key: 'announcementAlerts', label: 'Announcement Alerts', icon: MegaphoneIcon, description: 'Receive important announcements' },
        { key: 'eventReminders', label: 'Event Reminders', icon: CalendarIcon, description: 'Get notified about school events' },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-200">
            <section.icon className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-900">{section.title}</h3>
          </div>
          
          <div className="space-y-3">
            {section.items.map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-surface-900">{item.label}</p>
                    <p className="text-xs text-surface-500">{item.description}</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => handleToggle(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-surface-300 rounded-full peer-checked:bg-primary-500 transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform"></div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
        Save Preferences
      </Button>
    </form>
  );
};

export default NotificationSettings;