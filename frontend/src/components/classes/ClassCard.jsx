import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const ClassCard = ({ classData, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getGradeColor = (level) => {
    if (level <= 5) return 'bg-green-100 text-green-700';
    if (level <= 8) return 'bg-blue-100 text-blue-700';
    if (level <= 10) return 'bg-orange-100 text-orange-700';
    return 'bg-purple-100 text-purple-700';
  };

  const studentCount = classData.students?.length || 0;
  const capacity = classData.capacity || 30;
  const capacityPercentage = (studentCount / capacity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={() => navigate(`/classes/${classData._id}`)}
    >
      {/* Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700 bg-gradient-to-r from-surface-50 to-white dark:from-surface-800 dark:to-surface-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">
              {classData.name}
            </h3>
            <p className="text-sm text-surface-500 mt-1">
              {classData.grade?.name} - Section {classData.section}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(classData.grade?.level)}`}>
            Grade {classData.grade?.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Class Teacher */}
        <div className="flex items-center gap-2 text-sm">
          <AcademicCapIcon className="w-4 h-4 text-surface-400" />
          <span className="text-surface-600">Class Teacher:</span>
          <span className="font-medium text-surface-800">
            {classData.classTeacher?.name || 'Not Assigned'}
          </span>
        </div>

        {/* Students */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-surface-400" />
            <span className="text-sm text-surface-600">Students:</span>
            <span className="font-medium text-surface-800">{studentCount}/{capacity}</span>
          </div>
          <div className="w-24 h-1 bg-surface-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>

        {/* Room & Year */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-surface-400" />
            <span className="text-surface-600">Room:</span>
            <span className="text-surface-800">{classData.roomNumber || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-4 h-4 text-surface-400" />
            <span className="text-surface-600">{classData.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-surface-50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {classData.subjects?.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 bg-white dark:bg-surface-800 rounded-full border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300"
            >
              {item.subject?.code || 'Subject'}
            </span>
          ))}
          {classData.subjects?.length > 3 && (
            <span className="text-xs text-surface-500">+{classData.subjects.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(classData); }}
            className="p-1.5 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(classData); }}
            className="p-1.5 rounded-lg text-surface-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;