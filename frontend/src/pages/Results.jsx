import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  DocumentTextIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  PlusIcon,} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { SkeletonTable } from '../components/ui/Skeleton';
import ResultModal from '../components/results/ResultModal';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Results = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    average: 0,
    highest: 0,
    lowest: 100,
    passed: 0,
    failed: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    setFilteredResults(results.filter(result => 
      result.exam?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [results, searchTerm]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ['Exam', 'Subject', 'Date', 'Marks', 'Percentage', 'Status'].join(','),
      ...filteredResults.map(result => [
        result.exam?.title,
        result.subject?.name,
        format(new Date(result.exam?.date), 'yyyy-MM-dd'),
        `${result.marksObtained}/${result.exam?.totalMarks}`,
        `${((result.marksObtained / result.exam?.totalMarks) * 100).toFixed(1)}%`,
        result.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (user?.role === 'parent') {
      fetchChildren();
    } else if (user?.role === 'student') {
      fetchStudentResults(user._id);
    } else {
      fetchAllResults();
      if (user?.role === 'admin' || user?.role === 'teacher') {
        fetchDataForModal(); // Fetch data needed for adding results
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentResults(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchDataForModal = async () => {
    try {
      const [examsRes, subjectsRes, classesRes, studentsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/subjects'),
        api.get('/classes'),
        api.get('/users/students')
      ]);
      setExams(examsRes.data.exams || []);
      setSubjects(subjectsRes.data.subjects || []);
      setClasses(classesRes.data.classes || []);
      setStudents(studentsRes.data.students || []);
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
    }
  };
    if (selectedStudent) {
      fetchStudentResults(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/users/children');
      setStudents(response.data);
      if (response.data.length > 0) {
        handleCreateResult = async (resultData) => {
    try {
      await api.post('/results', resultData);
      toast.success('Result added successfully');
      // Refresh results if we're viewing all results
      if (user?.role === 'admin' || user?.role === 'teacher') {
        fetchAllResults();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add result');
      throw error;
    }
  };

  const setSelectedStudent(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load children');
    }
  };

  const fetchStudentResults = async (studentId) => {
    setLoading(true);
    try {
      const response = await api.get(`/results/student/${studentId}`);
      setResults(response.data.results || []);
      setStats(response.data.stats || stats);
    } catch (error) {
      console.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const response = await api.get('/results');
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const calculateGPA = (results) => {
    if (results.length === 0) return 0;
    
    const totalPoints = results.reduce((sum, result) => {
      const percentage = (result.marksObtained / result.exam?.totalMarks) * 100;
      let points = 0;
      if (percentage >= 90) points = 4.0;
      else if (percentage >= 80) points = 3.0;
      else if (percentage >= 70) points = 2.0;
      else if (percentage >= 60) points = 1.0;
      return sum + points;
    }, 0);
    
    return (totalPoints / results.length).toFixed(2);
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-64"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-16 mb-1"></div>
                  <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-12"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-32 mb-6"></div>
          <SkeletonTable rows={6} />
        </Card>
      </motion.div>
    );
  }

        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Result
          </Button>
        )}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Exam Results</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {user?.role === 'student' ? 'Your exam results and performance' :
             user?.role === 'parent' ? 'Your children\'s exam results' :
             'Student exam results and analytics'}
          </p>
        </div>

        {user?.role === 'parent' && students.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Select Child:
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - Class {student.class?.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {(user?.role === 'student' || (user?.role === 'parent' && selectedStudent)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Total Exams</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.totalExams}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                <TrophyIcon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">GPA</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{calculateGPA(filteredResults)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrophyIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Passed</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.passed}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AcademicCapIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Failed</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.failed}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Results Table */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {user?.role === 'student' ? 'Your Results' :
             user?.role === 'parent' ? `${students.find(s => s._id === selectedStudent)?.name}'s Results` :
             'All Results'}
          </h2>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search exams or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              title="Print Results"
            >
              <PrinterIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="Export to CSV"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="w-12 h-12 text-surface-400 dark:text-surface-500 mx-auto mb-4" />
            <p className="text-surface-500 dark:text-surface-400">
              {searchTerm ? 'No results match your search' : 'No exam results available'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Exam</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Marks</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Status</th>
                  {user?.role === 'admin' && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Student</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result._id} className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{result.exam?.title}</p>

      {/* Result Modal */}
      <ResultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateResult}
        exams={exams}
        students={students}
        subjects={subjects}
        classes={classes}
      />
                        <p className="text-sm text-surface-500 dark:text-surface-400">{result.class?.name} - {result.class?.section}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-surface-700 dark:text-surface-300">
                      {result.subject?.name}
                    </td>
                    <td className="py-4 px-4 text-surface-700 dark:text-surface-300">
                      {format(new Date(result.exam?.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getGradeColor(result.marksObtained, result.exam?.totalMarks)}`}>
                          {result.marksObtained}/{result.exam?.totalMarks}
                        </span>
                        <span className="text-sm text-surface-500 dark:text-surface-400">
                          ({((result.marksObtained / result.exam?.totalMarks) * 100).toFixed(1)}%)
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          getGradeLetter((result.marksObtained / result.exam?.totalMarks) * 100) === 'A' ? 'bg-green-100 text-green-700' :
                          getGradeLetter((result.marksObtained / result.exam?.totalMarks) * 100) === 'B' ? 'bg-blue-100 text-blue-700' :
                          getGradeLetter((result.marksObtained / result.exam?.totalMarks) * 100) === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          getGradeLetter((result.marksObtained / result.exam?.totalMarks) * 100) === 'D' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getGradeLetter((result.marksObtained / result.exam?.totalMarks) * 100)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(result.status)}`}>
                        {result.status === 'pass' ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="py-4 px-4 text-surface-700 dark:text-surface-300">
                        {result.student?.name}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Results;