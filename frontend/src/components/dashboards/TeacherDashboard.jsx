import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import RecentActivity from './RecentActivity';
import UpcomingItems from './UpcomingItems';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const classPerformance = [
  { class: '10A', average: 85 },
  { class: '10B', average: 78 },
  { class: '9A', average: 88 },
  { class: '9B', average: 82 },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { theme, systemTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  
  const chartColors = {
    gridStroke: isDark ? '#374151' : '#E5E7EB',
    axisStroke: isDark ? '#9CA3AF' : '#6B7280',
    tooltipBg: isDark ? '#1F2937' : 'white',
    tooltipBorder: isDark ? '#374151' : '#E5E7EB',
    tooltipText: isDark ? '#F3F4F6' : '#000000',
  };

  const [stats] = useState({
    totalStudents: 156,
    totalClasses: 4,
    pendingAssignments: 8,
    gradedAssignments: 24,
  });

  const statsCards = [
    { title: 'My Students', value: stats.totalStudents, icon: UsersIcon, trend: 5, color: 'primary' },
    { title: 'My Classes', value: stats.totalClasses, icon: BookOpenIcon, trend: 0, color: 'accent' },
    { title: 'Pending Grading', value: stats.pendingAssignments, icon: ClockIcon, trend: -12, color: 'secondary' },
    { title: 'Graded', value: stats.gradedAssignments, icon: CheckCircleIcon, trend: 15, color: 'surface' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-600 dark:to-accent-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Teacher'}!</h1>
        <p className="text-primary-100 mt-1">Track your classes and student progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <ChartCard title="Class Performance Overview">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={classPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} />
            <XAxis dataKey="class" stroke={chartColors.axisStroke} />
            <YAxis stroke={chartColors.axisStroke} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: chartColors.tooltipBg, 
                border: `1px solid ${chartColors.tooltipBorder}`,
                color: chartColors.tooltipText
              }}
            />
            <Bar dataKey="average" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <UpcomingItems />
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherDashboard;