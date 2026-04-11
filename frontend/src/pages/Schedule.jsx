import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Schedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      let url = '/assignments'; // Get assignments as schedule
      if (user?.role === 'student') {
        url = `/assignments/student/${user._id}`;
      } else if (user?.role === 'teacher') {
        url = `/assignments/teacher/${user._id}`;
      }
      const response = await api.get(url);
      setSchedules(response.data.assignments || response.data);
    } catch (error) {
      console.error('Failed to load schedule');
      // Set empty schedule without toasting to avoid spam
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTodaySchedules = () => {
    return schedules.filter(item => {
      const itemDate = new Date(item.dueDate).toISOString().split('T')[0];
      return itemDate === selectedDate;
    });
  };

  const getWeekSchedules = () => {
    const startDate = new Date(selectedDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return schedules.filter(item => {
      const itemDate = new Date(item.dueDate);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Schedule</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Your class schedule and upcoming tasks</p>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Today's Schedule</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm"
            />
          </div>

          <div className="space-y-3">
            {getTodaySchedules().length > 0 ? (
              getTodaySchedules().map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-surface-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{item.subject?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-surface-500 dark:text-surface-400">
                        <span className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(item.dueDate)}
                        </span>
                        {item.dueDate && (
                          <span className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            {formatTime(item.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      {item.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-surface-500 dark:text-surface-400 py-8">No schedule for today</p>
            )}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Week Overview</h2>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <p className="text-sm text-surface-500 dark:text-surface-400">Upcoming Tasks</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {getWeekSchedules().length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20">
              <p className="text-sm text-surface-500 dark:text-surface-400">This Week</p>
              <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {Math.ceil((new Date(selectedDate).getDay() + 7) / 7)}
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={fetchSchedules}
            >
              Refresh Schedule
            </Button>
          </div>
        </Card>
      </div>

      {/* Week Schedule */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">This Week's Tasks</h2>
        <div className="space-y-2">
          {getWeekSchedules().length > 0 ? (
            getWeekSchedules()
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-surface-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{formatDate(item.dueDate)}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                    {item.subject?.name || 'Task'}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-center text-surface-500 dark:text-surface-400 py-8">No tasks this week</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Schedule;
