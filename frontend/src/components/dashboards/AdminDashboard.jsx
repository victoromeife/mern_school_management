import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import RecentActivity from './RecentActivity';
import UpcomingItems from './UpcomingItems';
import QuickActions from './QuickActions';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const enrollmentData = [
    { 
        month: 'Jan', 
        students: 320, 
        teachers: 24 
    },
    { 
        month: 'Feb', 
        students: 335, 
        teachers: 25 
    },
    { 
        month: 'Mar', 
        students: 350, 
        teachers: 26 
    },
    { 
        month: 'Apr', 
        students: 365, 
        teachers: 27 
    },
    { 
        month: 'May', 
        students: 380, 
        teachers: 28 
    },
    { 
        month: 'Jun', 
        students: 395, 
        teachers: 29 
    },
];

const attendanceData = [
    { 
        name: 'Present', 
        value: 89, 
        color: '#10B981' 
    },
    { 
        name: 'Absent', 
        value: 8, 
        color: '#F59E0B' 
    },
    { 
        name: 'Late', 
        value: 3, 
        color: '#EF4444' 
    },
];

const gradeDistribution = [
    { 
        grade: 'A', 
        count: 45, 
        color: '#6366F1' 
    },
    { 
        grade: 'B', 
        count: 78, 
        color: '#8B5CF6' 
    },
    { 
        grade: 'C', 
        count: 52, 
        color: '#EC4899' 
    },
    { 
        grade: 'D', 
        count: 23, 
        color: '#F59E0B' 
    },
    { 
        grade: 'F', 
        count: 12, 
        color: '#EF4444' 
    },
];

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 425,
        totalTeachers: 32,
        totalClasses: 18,
        totalSubjects: 24,
        avgAttendance: 89,
        activeParents: 312,
    });

    const statsCards = [
        { 
            title: 'Total Students',
            value: stats.totalStudents, 
            icon: UsersIcon, 
            trend: 8, 
            color: 'primary' 
        },
        { 
            title: 'Total Teachers',
            value: stats.totalTeachers, 
            icon: AcademicCapIcon, 
            trend: 5, 
            color: 'accent' 
        },
        { 
            title: 'Total Classes', 
            value: stats.totalClasses, 
            icon: BookOpenIcon, 
            trend: 2, 
            color: 'secondary' 
        },
        { 
            title: 'Active Parents',
            value: stats.activeParents, 
            icon: UserGroupIcon, 
            trend: 12, 
            color: 'surface' 
        },
        { 
            title: 'Avg Attendance',
            value: `${stats.avgAttendance}%`, 
            icon: ChartBarIcon, 
            trend: 3, 
            color: 'primary' 
        },
        { 
            title: 'Total Subjects',
            value: stats.totalSubjects, 
            icon: BookOpenIcon, 
            trend: 0, 
            color: 'accent' 
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
                <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Admin'}!</h1>
                <p className="text-primary-100 mt-1">Here's what's happening with your school today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsCards.map((stat, index) => (
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Enrollment Trends">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="students" 
                                stroke="#6366F1" 
                                strokeWidth={2}
                                dot={{ fill: '#6366F1', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="teachers" 
                                stroke="#10B981" 
                                strokeWidth={2}
                                dot={{ fill: '#10B981', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Attendance Overview">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={attendanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {attendanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Grade Distribution */}
            <ChartCard title="Grade Distribution">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="grade" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #E5E7EB',
                                borderRadius: '0.5rem'
                            }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {gradeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Activity & Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentActivity />
                </div>
                <div className="space-y-6">
                    <UpcomingItems />
                    <QuickActions />
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;