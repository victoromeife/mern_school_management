import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentAttendance();
    } else if (user?.role === 'teacher') {
      fetchClassAttendance();
    }
  }, [user]);

  const fetchStudentAttendance = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app this would come from backend
      const mockAttendance = [
        { date: '2024-01-15', status: 'present', time: '08:30 AM' },
        { date: '2024-01-14', status: 'present', time: '08:25 AM' },
        { date: '2024-01-13', status: 'late', time: '09:15 AM' },
        { date: '2024-01-12', status: 'present', time: '08:30 AM' },
        { date: '2024-01-11', status: 'absent', time: null },
      ];
      
      setAttendance(mockAttendance);
      setTodayAttendance(mockAttendance[0]);
      
      const present = mockAttendance.filter(a => a.status === 'present').length;
      const absent = mockAttendance.filter(a => a.status === 'absent').length;
      const late = mockAttendance.filter(a => a.status === 'late').length;
      
      setStats({
        present,
        absent,
        late,
        total: mockAttendance.length
      });
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassAttendance = async () => {
    setLoading(true);
    try {
      // Mock data for teacher view
      const mockClassAttendance = [
        { student: 'John Doe', status: 'present', time: '08:30 AM' },
        { student: 'Jane Smith', status: 'present', time: '08:25 AM' },
        { student: 'Bob Johnson', status: 'late', time: '09:15 AM' },
        { student: 'Alice Brown', status: 'absent', time: null },
      ];
      
      setAttendance(mockClassAttendance);
    } catch (error) {
      toast.error('Failed to load class attendance');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status) => {
    try {
      // Mock attendance marking
      const newAttendance = {
        date: new Date().toISOString().split('T')[0],
        status,
        time: status === 'present' ? '08:30 AM' : status === 'late' ? '09:15 AM' : null
      };
      
      setTodayAttendance(newAttendance);
      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'absent':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'late':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'absent':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'late':
        return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {user?.role === 'student' ? 'My Attendance' : 'Class Attendance'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {user?.role === 'student' ? 'Track your daily attendance' : 'Monitor class attendance'}
          </p>
        </div>
      </div>

      {user?.role === 'student' && (
        <>
          {/* Today's Attendance */}
          <Card>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Today's Attendance</h2>
            {todayAttendance ? (
              <div className="flex items-center gap-3">
                {getStatusIcon(todayAttendance.status)}
                <div>
                  <p className={`font-medium ${getStatusColor(todayAttendance.status)}`}>
                    {todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {todayAttendance.time || 'Not marked'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-gray-700 dark:text-gray-300">Not marked yet</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="success" onClick={() => markAttendance('present')}>
                      Mark Present
                    </Button>
                    <Button size="sm" variant="warning" onClick={() => markAttendance('late')}>
                      Mark Late
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Present</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Absent</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Late</p>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{stats.total}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600">{Math.round((stats.present / stats.total) * 100)}%</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Attendance Rate</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Attendance History */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          {user?.role === 'student' ? 'Attendance History' : 'Today\'s Attendance'}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">
                  {user?.role === 'student' ? 'Date' : 'Student'}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className="border-b border-surface-100 dark:border-surface-700">
                  <td className="py-4 px-4 text-surface-900 dark:text-white">
                    {user?.role === 'student' ? record.date : record.student}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-surface-700 dark:text-surface-300">
                    {record.time || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default Attendance;