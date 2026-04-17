import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import RecentActivity from './RecentActivity';
import UpcomingItems from './UpcomingItems';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const childrenData = [
    { 
        name: 'Emma Johnson', 
        grade: '10A', 
        average: 88, 
        attendance: 95 
    },
    { 
        name: 'Liam Johnson', 
        grade: '8B', 
        average: 82, 
        attendance: 92 
    },
];

const performanceData = [
    { 
        subject: 'Math', 
        emma: 85, 
        liam: 78 
    },
    { 
        subject: 'Science', 
        emma: 92, 
        liam: 88 
    },
    { 
        subject: 'English', 
        emma: 88, 
        liam: 85 
    },
    { 
        subject: 'History', 
        emma: 90, 
        liam: 82 
    },
];

const ParentDashboard = () => {
    const { user } = useAuth();
    const [stats] = useState({
        children: 2,
        avgAttendance: 93,
        avgPerformance: 85,
        upcomingEvents: 3,
    });

    const statsCards = [
        { 
            title: 'Children', 
            value: stats.children, 
            icon: UserGroupIcon, 
            trend: 0, 
            color: 'primary' 
        },
        { 
            title: 'Avg Attendance', 
            value: `${stats.avgAttendance}%`, 
            icon: ChartBarIcon, 
            trend: 5, 
            color: 'accent' 
        },
        { 
            title: 'Avg Performance', 
            value: `${stats.avgPerformance}%`, 
            icon: AcademicCapIcon, 
            trend: 3, 
            color: 'secondary' 
        },
        { 
            title: 'Upcoming Events', 
            value: stats.upcomingEvents, 
            icon: BellIcon, 
            trend: 2, 
            color: 'surface' 
        },
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
                <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Parent'}!</h1>
                <p className="text-primary-100 mt-1">Track your children's academic progress.</p>
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

            {/* Children Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {childrenData.map((child) => (
                    <div key={child.name} className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-surface-900">{child.name}</h3>
                                <p className="text-sm text-surface-500">Class {child.grade}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-600 font-bold text-lg">{child.name.charAt(0)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-2xl font-bold text-primary-600">{child.average}%</p>
                                <p className="text-xs text-surface-500">Average Grade</p>
                            </div>
                            <div className="text-center p-3 bg-surface-50 rounded-lg">
                                <p className="text-2xl font-bold text-accent-600">{child.attendance}%</p>
                                <p className="text-xs text-surface-500">Attendance</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Comparison */}
            <ChartCard title="Subject Performance Comparison">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="subject" stroke="#6B7280" />
                        <YAxis domain={[0, 100]} stroke="#6B7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="emma" fill="#6366F1" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="liam" fill="#10B981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Activity & Upcoming */}
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

export default ParentDashboard;