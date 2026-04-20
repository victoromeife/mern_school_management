import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, ChevronRightIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

const upcomingData = {
    exams: [
        { 
            id: 1, 
            title: 'Mathematics Final',
            date: 'Mar 25, 2024',
            subject: 'Mathematics' 
        },
        { 
            id: 2, 
            title: 'Physics Mid-Term', 
            date: 'Mar 28, 2024', 
            subject: 'Physics' 
        },
    ],
    assignments: [
        { 
            id: 1, 
            title: 'Essay on Climate Change', 
            dueDate: 'Mar 29, 2026', 
            subject: 'English' 
        },
        { 
            id: 2, 
            title: 'Algebra Worksheet', 
            dueDate: 'Mar 26, 2024', 
            subject: 'Mathematics' 
        },
    ],
};

const UpcomingItems = () => {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Upcoming</h3>
        
            <div className="space-y-6">
                {/* Exams Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary-600" />
                            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Upcoming Exams</h4>
                        </div>
                        <Link
                            to="/exams"
                            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {upcomingData.exams.map((exam, index) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{exam.title}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400">{exam.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-surface-600 dark:text-surface-300">{exam.date}</p>
                                    <p className="text-xs text-surface-400 dark:text-surface-500">2 days left</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Assignments Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ClipboardDocumentListIcon className="w-4 h-4 text-accent-600" />
                            <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Due Assignments</h4>
                        </div>
                        <Link
                            to="/assignments"
                            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {upcomingData.assignments.map((assignment, index) => (
                            <motion.div
                                key={assignment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{assignment.title}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400">{assignment.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-surface-600 dark:text-surface-300">{assignment.dueDate}</p>
                                    <p className="text-xs text-accent-600 dark:text-accent-400">Due soon</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default UpcomingItems;