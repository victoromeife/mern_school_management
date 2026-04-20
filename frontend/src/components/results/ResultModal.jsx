import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ResultModal = ({ isOpen, onClose, onSubmit, exams = [], students = [], subjects = [], classes = [] }) => {
  const [formData, setFormData] = useState({
    student: '',
    exam: '',
    subject: '',
    class: '',
    marksObtained: '',
    totalMarks: '',
    term: 'Term 1',
    academicYear: new Date().getFullYear().toString(),
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        student: '',
        exam: '',
        subject: '',
        class: '',
        marksObtained: '',
        totalMarks: '',
        term: 'Term 1',
        academicYear: new Date().getFullYear().toString(),
        remarks: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-fill total marks when exam is selected
    if (name === 'exam' && value) {
      const selectedExam = exams.find(exam => exam._id === value);
      if (selectedExam) {
        setFormData(prev => ({
          ...prev,
          totalMarks: selectedExam.totalMarks || '',
          term: selectedExam.term || 'Term 1'
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.student) newErrors.student = 'Student is required';
    if (!formData.exam) newErrors.exam = 'Exam is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.marksObtained && formData.marksObtained !== 0) newErrors.marksObtained = 'Marks obtained is required';
    if (!formData.totalMarks) newErrors.totalMarks = 'Total marks is required';

    if (formData.marksObtained && formData.totalMarks) {
      const obtained = parseFloat(formData.marksObtained);
      const total = parseFloat(formData.totalMarks);

      if (obtained < 0) newErrors.marksObtained = 'Marks cannot be negative';
      if (obtained > total) newErrors.marksObtained = 'Marks cannot exceed total marks';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        marksObtained: parseFloat(formData.marksObtained),
        totalMarks: parseFloat(formData.totalMarks)
      });
      onClose();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                Add Exam Result
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Student *
                  </label>
                  <select
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.student ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                  {errors.student && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.student}</p>
                  )}
                </div>

                {/* Exam */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Exam *
                  </label>
                  <select
                    name="exam"
                    value={formData.exam}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.exam ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    required
                  >
                    <option value="">Select Exam</option>
                    {exams.map(exam => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title} ({exam.totalMarks} marks)
                      </option>
                    ))}
                  </select>
                  {errors.exam && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.exam}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.subject ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                  )}
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Class *
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.class ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.section})
                      </option>
                    ))}
                  </select>
                  {errors.class && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.class}</p>
                  )}
                </div>

                {/* Marks Obtained */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    name="marksObtained"
                    value={formData.marksObtained}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.marksObtained ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    placeholder="Enter marks obtained"
                    min="0"
                    step="0.5"
                    required
                  />
                  {errors.marksObtained && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.marksObtained}</p>
                  )}
                </div>

                {/* Total Marks */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 ${
                      errors.totalMarks ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
                    }`}
                    placeholder="Enter total marks"
                    min="1"
                    required
                  />
                  {errors.totalMarks && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalMarks}</p>
                  )}
                </div>

                {/* Term */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Term
                  </label>
                  <select
                    name="term"
                    value={formData.term}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                  placeholder="Optional remarks"
                  rows="3"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Result'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;