import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import {
    UserPlusIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

const activities = [
    {
        id: 1,
        type: 'user',
        title: 'New student enrolled',
        description: 'Sarah Johnson joined Grade 10A',
        time: '5 minutes ago',
        icon: UserPlusIcon,
        color: 'primary',
        link: '/users/student/123',
    },
    {
        id: 2,
        type: 'assignment',
        title: 'Assignment submitted',
        description: 'John Doe submitted Math Problem Set',
        time: '1 hour ago',
        icon: ClipboardDocumentListIcon,
        color: 'accent',
        link: '/assignments/456',
    },
    {
        id: 3,
        type: 'event',
        title: 'Parent-Teacher Meeting',
        description: 'Scheduled for March 28th at 10:00 AM',
        time: '3 hours ago',
        icon: CalendarIcon,
        color: 'secondary',
        link: '/events/789',
    },
    {
        id: 4,
        type: 'exam',
        title: 'Exam results published',
        description: 'Science Mid-Term results are now available',
        time: 'Yesterday',
        icon: AcademicCapIcon,
        color: 'primary',
        link: '/exams/101',
    },
    {
        id: 5,
        type: 'announcement',
        title: 'School holiday announcement',
        description: 'School closed on March 30th',
        time: 'Yesterday',
        icon: DocumentTextIcon,
        color: 'surface',
        link: '/announcements/202',
    },
];

const colorClasses = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  secondary: 'bg-secondary-50 text-secondary-600',
  surface: 'bg-surface-100 text-surface-600',
};

const RecentActivity = ({ limit = 5 }) => {
  const displayActivities = activities.slice(0, limit);

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Recent Activity</h3>
                <Link
                    to="/activity"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-1"
                >
                    View all
                    <ChevronRightIcon className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {displayActivities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer group"
                        onClick={() => (window.location.href = activity.link)}
                    >
                        <div className={`w-10 h-10 rounded-lg ${colorClasses[activity.color]} flex items-center justify-center flex-shrink-0`}>
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {activity.title}
                            </p>
                            <p className="text-sm text-surface-500 dark:text-surface-400 truncate">{activity.description}</p>
                            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{activity.time}</p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

export default RecentActivity;