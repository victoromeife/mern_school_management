import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import {
  MegaphoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const categoryIcons = {
  general: <BuildingOfficeIcon className="w-4 h-4" />,
  academic: <AcademicCapIcon className="w-4 h-4" />,
  administrative: <BuildingOfficeIcon className="w-4 h-4" />,
  emergency: <ExclamationTriangleIcon className="w-4 h-4" />,
  'event-reminder': <CalendarIcon className="w-4 h-4" />,
  achievement: <TrophyIcon className="w-4 h-4" />,
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-700',
  academic: 'bg-purple-100 text-purple-700',
  administrative: 'bg-gray-100 text-gray-700',
  emergency: 'bg-red-100 text-red-700',
  'event-reminder': 'bg-green-100 text-green-700',
  achievement: 'bg-yellow-100 text-yellow-700',
};

const priorityColors = {
  low: 'border-l-4 border-gray-300',
  normal: 'border-l-4 border-blue-400',
  high: 'border-l-4 border-orange-400',
  urgent: 'border-l-4 border-red-500 bg-red-50/30',
};

const AnnouncementCard = ({ announcement, onAcknowledge, isTeacher = false }) => {
  const [acknowledged, setAcknowledged] = useState(announcement.acknowledged || false);
  const [expanded, setExpanded] = useState(false);

  const handleAcknowledge = async () => {
    await onAcknowledge(announcement._id);
    setAcknowledged(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden transition-all hover:shadow-md ${priorityColors[announcement.priority]}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${categoryColors[announcement.category]}`}>
              {categoryIcons[announcement.category]}
            </span>
            <div>
              <h3 className="font-semibold text-surface-900">{announcement.title}</h3>
              <p className="text-xs text-surface-500 mt-0.5">
                By {announcement.createdBy?.name} • {formatDistanceToNow(new Date(announcement.publishDate), { addSuffix: true })}
              </p>
            </div>
          </div>
          {announcement.isPinned && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
              <MegaphoneIcon className="w-3 h-3" />
              Pinned
            </span>
          )}
        </div>

        {/* Content */}
        <p className={`text-surface-600 text-sm ${!expanded ? 'line-clamp-3' : ''}`}>
          {announcement.content}
        </p>

        {announcement.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-600 hover:text-primary-700 mt-2 font-medium"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Attachments */}
        {announcement.attachments?.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {announcement.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-surface-100 rounded-lg text-xs text-surface-600 hover:bg-surface-200 transition-colors"
              >
                📎 {file.filename}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-surface-100">
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              {announcement.views || 0} views
            </span>
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" />
              {announcement.acknowledgments?.length || 0} acknowledged
            </span>
          </div>

          {!isTeacher && announcement.priority === 'urgent' && !acknowledged && (
            <button
              onClick={handleAcknowledge}
              className="px-3 py-1 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors"
            >
              Acknowledge
            </button>
          )}

          {acknowledged && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircleIcon className="w-3 h-3" />
              Acknowledged
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;