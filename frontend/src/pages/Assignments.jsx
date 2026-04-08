import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import AssignmentCard from '../components/assignments/AssignmentCard';
import AssignmentModal from '../components/assignments/AssignmentModal';
import SubmissionModal from '../components/assignments/SubmissionModal';
import GradingModal from '../components/assignments/GradingModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';

const Assignments = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [gradingOpen, setGradingOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch assignments
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      let url = '/assignments';
      if (user?.role === 'student') {
        url = `/assignments/student/${user._id}`;
      } else if (user?.role === 'teacher') {
        url = `/assignments/teacher/${user._id}`;
      }
      const response = await api.get(url);
      setAssignments(response.data.assignments || response.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Failed to load classes');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error('Failed to load subjects');
    }
  };

  useEffect(() => {
    fetchAssignments();
    if (isAdmin || isTeacher) {
      fetchClasses();
      fetchSubjects();
    }
  }, []);

  // Create assignment
  const handleCreate = async (data) => {
    try {
      await api.post('/assignments', data);
      toast.success('Assignment created successfully');
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
      throw error;
    }
  };

  // Update assignment
  const handleUpdate = async (data) => {
    try {
      await api.put(`/assignments/${editingAssignment._id}`, data);
      toast.success('Assignment updated successfully');
      fetchAssignments();
      setEditingAssignment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
      throw error;
    }
  };

  // Submit assignment
  const handleSubmit = async ({ files, comments }) => {
    try {
      await api.post(`/assignments/${selectedAssignment._id}/submit`, {
        files: files.map(f => ({
          filename: f.name,
          fileUrl: URL.createObjectURL(f),
          fileType: f.type,
        })),
        comments,
      });
      toast.success('Assignment submitted successfully');
      fetchAssignments();
      setSubmissionOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
      throw error;
    }
  };

  // Grade submission
  const handleGrade = async ({ pointsAwarded, feedback }) => {
    try {
      await api.put(`/assignments/${selectedAssignment._id}/submissions/${selectedSubmission._id}/grade`, {
        pointsAwarded,
        feedback,
      });
      toast.success('Submission graded successfully');
      fetchAssignments();
      setGradingOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to grade submission');
      throw error;
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.status === 'published' && !assignment.submissions?.length;
    if (filter === 'submitted') return assignment.submissions?.length && !assignment.submissions[0]?.grade;
    if (filter === 'graded') return assignment.submissions?.[0]?.grade;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Assignments</h1>
          <p className="text-surface-500 mt-1">Manage and submit your coursework</p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <FunnelIcon className="w-4 h-4 text-surface-400" />
        {['all', 'pending', 'submitted', 'graded'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === option
                ? 'bg-primary-100 text-primary-700'
                : 'text-surface-500 hover:bg-surface-100'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-surface-200 p-4 animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredAssignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-surface-500">No assignments found</p>
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              role={user?.role}
              onGrade={() => {
                setSelectedAssignment(assignment);
                setSelectedSubmission(assignment.submissions?.[0]);
                setGradingOpen(true);
              }}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={editingAssignment ? handleUpdate : handleCreate}
        assignment={editingAssignment}
        classes={classes}
        subjects={subjects}
      />

      <SubmissionModal
        isOpen={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        onSubmit={handleSubmit}
        assignment={selectedAssignment}
      />

      <GradingModal
        isOpen={gradingOpen}
        onClose={() => setGradingOpen(false)}
        onSubmit={handleGrade}
        submission={selectedSubmission}
        assignment={selectedAssignment}
      />
    </motion.div>
  );
};

export default Assignments;