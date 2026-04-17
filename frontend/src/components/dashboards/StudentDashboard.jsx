import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import UpcomingItems from './UpcomingItems';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const performanceData = [
  { subject: 'Math', score: 85 },
  { subject: 'Science', score: 78 },
  { subject: 'English', score: 92 },
  { subject: 'History', score: 88 },
  { subject: 'Physics', score: 82 },
];

const progressData = [
  { month: 'Jan', grade: 75 },
  { month: 'Feb', grade: 78 },
  { month: 'Mar', grade: 82 },
  { month: 'Apr', grade: 85 },
  { month: 'May', grade: 88 },
  { month: 'Jun', grade: 90 },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    gpa: 3.8,
    attendance: 94,
    completedAssignments: 18,
    rank: 12,
  });

  const statsCards = [
    { title: 'GPA', value: stats.gpa, icon: AcademicCapIcon, trend: 5, color: 'primary' },
    { title: 'Attendance', value: `${stats.attendance}%`, icon: ChartBarIcon, trend: 2, color: 'accent' },
    { title: 'Completed', value: stats.completedAssignments, icon: ClockIcon, trend: 12, color: 'secondary' },
    { title: 'Class Rank', value: `#${stats.rank}`, icon: TrophyIcon, trend: -3, color: 'surface' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-primary-100 mt-1">Track your academic progress and upcoming tasks.</p>
      </div>

      {/* Stats Grid */}
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

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Subject Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} stroke="#6B7280" />
              <YAxis dataKey="subject" type="category" stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="score" fill="#6366F1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Progress Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis domain={[0, 100]} stroke="#6B7280" />
              <Tooltip />
              <Line type="monotone" dataKey="grade" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <UpcomingItems />
    </motion.div>
  );
};

export default StudentDashboard;