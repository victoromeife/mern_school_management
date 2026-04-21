import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import RecentActivity from './RecentActivity';
import UpcomingItems from './UpcomingItems';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

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
    const { theme, systemTheme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
    
    const chartColors = {
        gridStroke: isDark ? '#374151' : '#E5E7EB',
        axisStroke: isDark ? '#9CA3AF' : '#6B7280',
        tooltipBg: isDark ? '#1F2937' : 'white',
        tooltipBorder: isDark ? '#374151' : '#E5E7EB',
        tooltipText: isDark ? '#F3F4F6' : '#000000',
    };

    const [stats, setStats] = useState({
        children: 0,
        avgAttendance: 0,
        avgPerformance: 0,
        upcomingEvents: 3,
    });
    const [childrenData, setChildrenData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChildrenData();
    }, []);

    const fetchChildrenData = async () => {
        setLoading(true);
        try {
            // Fetch children
            const childrenResponse = await api.get('/users/children');
            const children = childrenResponse.data;

            setStats(prev => ({ ...prev, children: children.length }));

            // Fetch results for each child and calculate averages
            const childrenWithResults = await Promise.all(
                children.map(async (child) => {
                    try {
                        const resultsResponse = await api.get(`/results/student/${child._id}`);
                        const { results, stats: childStats } = resultsResponse.data;
                        return {
                            ...child,
                            average: parseFloat(childStats.average) || 0,
                            attendance: 95, // Mock attendance - would come from attendance system
                            results: results
                        };
                    } catch (error) {
                        return {
                            ...child,
                            average: 0,
                            attendance: 95,
                            results: []
                        };
                    }
                })
            );

            setChildrenData(childrenWithResults);

            // Calculate average performance
            const totalAvg = childrenWithResults.reduce((sum, child) => sum + child.average, 0);
            const avgPerformance = childrenWithResults.length > 0 ? totalAvg / childrenWithResults.length : 0;
            setStats(prev => ({ ...prev, avgPerformance: Math.round(avgPerformance) }));

            // Prepare performance comparison data
            const subjectPerformance = {};
            childrenWithResults.forEach(child => {
                child.results.forEach(result => {
                    const subjectName = result.subject?.name || 'Unknown';
                    const percentage = (result.marksObtained / result.exam?.totalMarks) * 100;
                    
                    if (!subjectPerformance[subjectName]) {
                        subjectPerformance[subjectName] = { emma: 0, liam: 0 };
                    }
                    
                    // For demo, assign to first two children
                    if (childrenWithResults.indexOf(child) === 0) {
                        subjectPerformance[subjectName].emma = Math.max(subjectPerformance[subjectName].emma, percentage);
                    } else if (childrenWithResults.indexOf(child) === 1) {
                        subjectPerformance[subjectName].liam = Math.max(subjectPerformance[subjectName].liam, percentage);
                    }
                });
            });

            const perfData = Object.entries(subjectPerformance).map(([subject, data]) => ({
                subject,
                emma: data.emma || 0,
                liam: data.liam || 0,
            }));
            setPerformanceData(perfData);

        } catch (error) {
            console.error('Failed to load children data');
            // Fallback to mock data
            setChildrenData([
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
            ]);
            setPerformanceData([
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
            ]);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-600 dark:to-accent-600 rounded-2xl p-6 text-white shadow-lg">
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
                                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{child.name}</h3>
                                <p className="text-sm text-surface-500 dark:text-surface-400">Class {child.grade}</p>
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
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} />
                        <XAxis dataKey="subject" stroke={chartColors.axisStroke} />
                        <YAxis domain={[0, 100]} stroke={chartColors.axisStroke} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: chartColors.tooltipBg, 
                                border: `1px solid ${chartColors.tooltipBorder}`,
                                borderRadius: '0.5rem',
                                color: chartColors.tooltipText
                          }}
                        />
                        <Bar dataKey="emma" fill="#6366F1" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="liam" fill="#10B981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/results"
                        className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <AcademicCapIcon className="w-6 h-6" />
                        <div>
                            <p className="font-medium">View Results</p>
                            <p className="text-sm text-primary-100">Check children's grades</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto" />
                    </Link>
                    <Link
                        to="/announcements"
                        className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <BellIcon className="w-6 h-6" />
                        <div>
                            <p className="font-medium">Announcements</p>
                            <p className="text-sm text-primary-100">School updates</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto" />
                    </Link>
                    <Link
                        to="/events"
                        className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        <ChartBarIcon className="w-6 h-6" />
                        <div>
                            <p className="font-medium">Events</p>
                            <p className="text-sm text-primary-100">School activities</p>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 ml-auto" />
                    </Link>
                </div>
            </div>

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