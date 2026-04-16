import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, Squares2X2Icon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import ClassCard from '../components/classes/ClassCard';
import ClassModal from '../components/classes/ClassModal';
import ClassSchedule from '../components/classes/ClassSchedule';
import ClassStudents from '../components/classes/ClassStudents';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';

const Classes = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'schedule'

  // Fetch data
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes);
    } catch (error) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get('/grades');
      setGrades(response.data.grades);
    } catch (error) {
      console.error('Failed to load grades');
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

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users/teachers');
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Failed to load teachers');
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchGrades();
    fetchSubjects();
    fetchTeachers();
  }, []);

  // Create class
  const handleCreate = async (data) => {
    try {
      await api.post('/classes', data);
      toast.success('Class created successfully');
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class');
      throw error;
    }
  };

  // Update class
  const handleUpdate = async (data) => {
    try {
      await api.put(`/classes/${editingClass._id}`, data);
      toast.success('Class updated successfully');
      fetchClasses();
      setEditingClass(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update class');
      throw error;
    }
  };

  // Delete class
  const handleDelete = async (classData) => {
    if (!window.confirm(`Are you sure you want to delete ${classData.name}?`)) return;
    
    try {
      await api.delete(`/classes/${classData._id}`);
      toast.success('Class deleted successfully');
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    }
  };

  // Add student to class
  const handleAddStudent = async (classId, studentId) => {
    try {
      await api.post(`/classes/${classId}/students`, { studentId });
      toast.success('Student added successfully');
      fetchClasses();
      // Refresh selected class if open
      if (selectedClass?._id === classId) {
        const updated = await api.get(`/classes/${classId}`);
        setSelectedClass(updated.data.class);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    }
  };

  // Remove student from class
  const handleRemoveStudent = async (classId, studentId) => {
    try {
      await api.delete(`/classes/${classId}/students/${studentId}`);
      toast.success('Student removed successfully');
      fetchClasses();
      if (selectedClass?._id === classId) {
        const updated = await api.get(`/classes/${classId}`);
        setSelectedClass(updated.data.class);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove student');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Classes</h1>
          <p className="text-surface-500 mt-1">Manage all classes and timetables</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('schedule')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'schedule'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <CalendarDaysIcon className="w-4 h-4" />
            </button>
          </div>
          {(isAdmin || isTeacher) && (
            <Button
              variant="primary"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Class
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        selectedClass ? (
          // Class Detail View
          <div className="space-y-6">
            <button
              onClick={() => setSelectedClass(null)}
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              ← Back to all classes
            </button>
            
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-surface-900">{selectedClass.name}</h2>
                  <p className="text-surface-500 mt-1">
                    {selectedClass.grade?.name} - Section {selectedClass.section}
                  </p>
                </div>
                {(isAdmin || isTeacher) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingClass(selectedClass);
                      setModalOpen(true);
                    }}
                  >
                    Edit Class
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ClassStudents
                  students={selectedClass.students || []}
                  availableStudents={teachers}
                  onAddStudent={(studentId) => handleAddStudent(selectedClass._id, studentId)}
                  onRemoveStudent={(studentId) => handleRemoveStudent(selectedClass._id, studentId)}
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Class Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-surface-500">Class Teacher:</span> {selectedClass.classTeacher?.name || 'Not Assigned'}</p>
                      <p><span className="text-surface-500">Room:</span> {selectedClass.roomNumber || 'Not Assigned'}</p>
                      <p><span className="text-surface-500">Capacity:</span> {selectedClass.students?.length || 0}/{selectedClass.capacity || 30}</p>
                      <p><span className="text-surface-500">Academic Year:</span> {selectedClass.academicYear}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Subjects</h3>
                    <div className="space-y-1">
                      {selectedClass.subjects?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-surface-100">
                          <span className="text-surface-700">{item.subject?.name}</span>
                          <span className="text-sm text-surface-500">{item.teacher?.name || 'No teacher'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <ClassSchedule schedule={selectedClass.schedule || []} />
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-surface-200 p-4 animate-pulse">
                  <div className="h-20 bg-surface-200 rounded mb-4"></div>
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              classes.map(cls => (
                <ClassCard
                  key={cls._id}
                  classData={cls}
                  onEdit={(c) => {
                    setEditingClass(c);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )
      ) : (
        // Schedule View - Show all classes schedule
        <ClassSchedule schedule={classes.flatMap(c => c.schedule || []).map(s => ({ ...s, className: c.name }))} />
      )}

      {/* Class Modal */}
      <ClassModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClass(null);
        }}
        onSubmit={editingClass ? handleUpdate : handleCreate}
        classData={editingClass}
        grades={grades}
        subjects={subjects}
        teachers={teachers}
      />
    </motion.div>
  );
};

export default Classes;