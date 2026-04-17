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

const classPerformance = [
  { class: '10A', average: 85 },
  { class: '10B', average: 78 },
  { class: '9A', average: 88 },
  { class: '9B', average: 82 },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
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
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="class" stroke="#6B7280" />
            <YAxis stroke="#6B7280" domain={[0, 100]} />
            <Tooltip />
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