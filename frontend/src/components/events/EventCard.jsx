import React from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay, differenceInDays } from 'date-fns';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const eventTypeColors = {
  holiday: 'bg-green-100 text-green-700',
  meeting: 'bg-blue-100 text-blue-700',
  sports: 'bg-orange-100 text-orange-700',
  cultural: 'bg-purple-100 text-purple-700',
  academic: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-700',
};

const EventCard = ({ event, onEdit, onDelete, isAdmin = false }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isMultiDay = !isSameDay(startDate, endDate);
  const daysUntil = differenceInDays(startDate, new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Date Badge */}
      <div className={`px-4 py-2 ${eventTypeColors[event.eventType]} flex items-center justify-between`}>
        <span className="text-sm font-medium">
          {event.allDay ? 'All Day' : `${event.startTime} - ${event.endTime}`}
        </span>
        {daysUntil >= 0 && daysUntil <= 7 && (
          <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
            {daysUntil === 0 ? 'Today' : `${daysUntil} days left`}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-surface-900 mb-2">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-surface-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-surface-400" />
            <span>
              {format(startDate, 'MMM dd, yyyy')}
              {isMultiDay && ` - ${format(endDate, 'MMM dd, yyyy')}`}
            </span>
          </div>
          
          {!event.allDay && event.startTime && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-surface-400" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-surface-400" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.targetAudience && (
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4 text-surface-400" />
              <span className="capitalize">{event.targetAudience.join(', ')}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="mt-3 text-sm text-surface-500 line-clamp-2">
            {event.description}
          </p>
        )}

        {isAdmin && (
          <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-surface-100">
            <button
              onClick={() => onEdit(event)}
              className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(event)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;