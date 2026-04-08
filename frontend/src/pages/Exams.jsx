import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { CalendarIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import api from '../services/api';

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      let url = '/exams';
      if (user?.role === 'student') {
        url = `/exams/student/${user._id}`;
      } else if (user?.role === 'teacher') {
        url = `/exams/teacher/${user._id}`;
      }
      const response = await api.get(url);
      setExams(response.data.exams || response.data);
    } catch (error) {
      console.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (date) => {
    const daysUntil = differenceInDays(new Date(date), new Date());
    if (daysUntil < 0) return 'bg-gray-100 text-gray-700';
    if (daysUntil <= 3) return 'bg-red-100 text-red-700';
    if (daysUntil <= 7) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (date) => {
    const daysUntil = differenceInDays(new Date(date), new Date());
    if (daysUntil < 0) return 'Past';
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Exams</h1>
        <p className="text-surface-500 mt-1">Upcoming and past examinations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Upcoming Exams</h2>
          <div className="space-y-3">
            {exams
              .filter(e => new Date(e.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(exam => (
                <div key={exam._id} className="p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-surface-900">{exam.title}</h3>
                      <p className="text-sm text-surface-500">{exam.subject?.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-surface-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(exam.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {exam.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.date)}`}>
                        {getStatusText(exam.date)}
                      </span>
                      <p className="text-xs text-surface-400 mt-1">{exam.totalMarks} marks</p>
                    </div>
                  </div>
                </div>
              ))}
            {exams.filter(e => new Date(e.date) >= new Date()).length === 0 && (
              <p className="text-center text-surface-500 py-8">No upcoming exams</p>
            )}
          </div>
        </Card>

        {/* Past Exams */}
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Past Exams</h2>
          <div className="space-y-3">
            {exams
              .filter(e => new Date(e.date) < new Date())
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(exam => (
                <div key={exam._id} className="p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-surface-900">{exam.title}</h3>
                      <p className="text-sm text-surface-500">{exam.subject?.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-surface-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(exam.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <AcademicCapIcon className="w-3 h-3" />
                          {exam.status === 'completed' ? 'Completed' : exam.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {exam.results?.find(r => r.student._id === user?._id) ? (
                        <span className="text-sm font-medium text-green-600">
                          {exam.results.find(r => r.student._id === user?._id)?.marksObtained}/{exam.totalMarks}
                        </span>
                      ) : (
                        <span className="text-sm text-surface-400">Not available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {exams.filter(e => new Date(e.date) < new Date()).length === 0 && (
              <p className="text-center text-surface-500 py-8">No past exams</p>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Exams;