import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  DocumentPlusIcon,
  MegaphoneIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';

const actions = [
    { 
        name: 'Add Student', 
        icon: UserPlusIcon, 
        href: '/users/new', 
        color: 'primary' 
    },
    { 
        name: 'Create Assignment', 
        icon: DocumentPlusIcon, 
        href: '/assignments/new', 
        color: 'accent' 
    },
    { 
        name: 'Schedule Event', 
        icon: PlusIcon, 
        href: '/events/new', 
        color: 'secondary' 
    },
    { 
        name: 'Post Announcement', 
        icon: MegaphoneIcon, 
        href: '/announcements/new', 
        color: 'surface' 
    },
];

const actionColorClasses = {
  primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
  accent: 'bg-accent-50 text-accent-600 hover:bg-accent-100',
  secondary: 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100',
  surface: 'bg-surface-100 text-surface-600 hover:bg-surface-200',
};

const QuickActions = () => {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <motion.div
                        key={action.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={action.href}
                            className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:border-primary-200 hover:bg-primary-50 dark:hover:bg-surface-700 transition-all group"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${actionColorClasses[action.color]}`}>
                                <action.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300 group-hover:text-primary-700 dark:group-hover:text-primary-400">
                                {action.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
};

export default QuickActions;