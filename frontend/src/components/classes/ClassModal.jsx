import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ClassModal = ({ isOpen, onClose, onSubmit, classData = null, grades = [], subjects = [], teachers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: 'A',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    classTeacher: '',
    roomNumber: '',
    capacity: 30,
    subjects: [],
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name || '',
        grade: classData.grade?._id || classData.grade || '',
        section: classData.section || 'A',
        academicYear: classData.academicYear || '',
        classTeacher: classData.classTeacher?._id || classData.classTeacher || '',
        roomNumber: classData.roomNumber || '',
        capacity: classData.capacity || 30,
        subjects: classData.subjects || [],
      });
      setSelectedSubjects(classData.subjects?.map(s => s.subject?._id || s.subject) || []);
    } else {
      setFormData({
        name: '',
        grade: '',
        section: 'A',
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        classTeacher: '',
        roomNumber: '',
        capacity: 30,
        subjects: [],
      });
      setSelectedSubjects([]);
    }
    setErrors({});
  }, [classData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSubject = (subjectId) => {
    if (!selectedSubjects.includes(subjectId)) {
      setSelectedSubjects([...selectedSubjects, subjectId]);
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, { subject: subjectId, teacher: '' }]
      }));
    }
  };

  const handleRemoveSubject = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.subject !== subjectId)
    }));
  };

  const handleSubjectTeacherChange = (subjectId, teacherId) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.subject === subjectId ? { ...s, teacher: teacherId } : s
      )
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Class name is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-200 sticky top-0 bg-white">
                <h2 className="text-xl font-semibold text-surface-900">
                  {classData ? 'Edit Class' : 'Create New Class'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Class Name"
                    name="name"
                    placeholder="e.g., 10A, Grade 10 Section A"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Grade
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${errors.grade ? 'border-red-300' : 'border-surface-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade._id} value={grade._id}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                    {errors.grade && <p className="text-sm text-red-600 mt-1">{errors.grade}</p>}
                  </div>

                  <Input
                    label="Section"
                    name="section"
                    placeholder="A, B, C"
                    value={formData.section}
                    onChange={handleChange}
                  />

                  <Input
                    label="Academic Year"
                    name="academicYear"
                    placeholder="2024-2025"
                    value={formData.academicYear}
                    onChange={handleChange}
                    error={errors.academicYear}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Class Teacher
                    </label>
                    <select
                      name="classTeacher"
                      value={formData.classTeacher}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Room Number"
                    name="roomNumber"
                    placeholder="Room 101"
                    value={formData.roomNumber}
                    onChange={handleChange}
                  />

                  <Input
                    label="Capacity"
                    name="capacity"
                    type="number"
                    placeholder="30"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </div>

                {/* Subjects Section */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Subjects & Teachers
                  </label>
                  
                  <div className="mb-3">
                    <select
                      onChange={(e) => handleAddSubject(e.target.value)}
                      value=""
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Add Subject...</option>
                      {subjects
                        .filter(s => !selectedSubjects.includes(s._id))
                        .map(subject => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    {selectedSubjects.map(subjectId => {
                      const subject = subjects.find(s => s._id === subjectId);
                      const currentTeacher = formData.subjects.find(s => s.subject === subjectId)?.teacher;
                      
                      return (
                        <div key={subjectId} className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-surface-900">{subject?.name}</p>
                            <p className="text-xs text-surface-500">{subject?.code}</p>
                          </div>
                          <select
                            value={currentTeacher || ''}
                            onChange={(e) => handleSubjectTeacherChange(subjectId, e.target.value)}
                            className="rounded-lg border border-surface-300 px-2 py-1 text-sm"
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(subjectId)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {selectedSubjects.length === 0 && (
                    <p className="text-sm text-surface-500 text-center py-4">No subjects added yet</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={loading}
                  >
                    {classData ? 'Update Class' : 'Create Class'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClassModal;