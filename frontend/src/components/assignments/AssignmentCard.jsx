import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import {
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const AssignmentCard = ({ assignment, role = 'student', onGrade }) => {
  const navigate = useNavigate();
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < now && assignment.status !== 'submitted';
  const isDueSoon = dueDate < new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) && !isOverdue;
  
  const submission = assignment.submissions?.[0];
  const isSubmitted = !!submission;
  const isGraded = submission?.grade?.pointsAwarded !== undefined;

  const getStatusBadge = () => {
    if (assignment.status === 'draft') return { text: 'Draft', color: 'bg-gray-100 text-gray-700' };
    if (assignment.status === 'published' && isOverdue) return { text: 'Overdue', color: 'bg-red-100 text-red-700' };
    if (isSubmitted && isGraded) return { text: 'Graded', color: 'bg-green-100 text-green-700' };
    if (isSubmitted) return { text: 'Submitted', color: 'bg-blue-100 text-blue-700' };
    if (isDueSoon) return { text: 'Due Soon', color: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Open', color: 'bg-primary-100 text-primary-700' };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={() => navigate(`/assignments/${assignment._id}`)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-900">{assignment.title}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        <p className="text-sm text-surface-600 mb-3 line-clamp-2">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-surface-500">
              <ClockIcon className="w-4 h-4" />
              <span>{format(dueDate, 'MMM dd')}</span>
            </div>
            <div className="flex items-center gap-1 text-surface-500">
              <UserIcon className="w-4 h-4" />
              <span>{assignment.teacher?.name || 'Teacher'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isSubmitted ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : isOverdue ? (
              <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
            ) : null}
            <span className="text-xs text-surface-400">
              {assignment.points} pts
            </span>
          </div>
        </div>

        {isGraded && (
          <div className="mt-3 pt-3 border-t border-surface-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600">Your Grade:</span>
              <span className="font-semibold text-primary-600">
                {submission.grade.pointsAwarded}/{assignment.points}
              </span>
            </div>
            {submission.grade.feedback && (
              <p className="text-xs text-surface-500 mt-1">
                {submission.grade.feedback}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;