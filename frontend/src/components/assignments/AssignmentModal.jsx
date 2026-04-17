import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AssignmentModal = ({ isOpen, onClose, onSubmit, assignment = null, classes = [], subjects = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    subject: '',
    dueDate: '',
    points: 100,
    allowLateSubmissions: false,
    latePenalty: 0,
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        class: assignment.class?._id || assignment.class || '',
        subject: assignment.subject?._id || assignment.subject || '',
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
        points: assignment.points || 100,
        allowLateSubmissions: assignment.allowLateSubmissions || false,
        latePenalty: assignment.latePenalty || 0,
        attachments: assignment.attachments || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        class: '',
        subject: '',
        dueDate: '',
        points: 100,
        allowLateSubmissions: false,
        latePenalty: 0,
        attachments: [],
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (formData.points < 1) newErrors.points = 'Points must be at least 1';
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
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                  {assignment ? 'Edit Assignment' : 'Create New Assignment'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <Input
                  label="Title"
                  name="title"
                  placeholder="Assignment title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe the assignment..."
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.description ? 'border-red-300' : 'border-surface-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Class
                    </label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Due Date"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleChange}
                    error={errors.dueDate}
                    required
                  />

                  <Input
                    label="Points"
                    name="points"
                    type="number"
                    placeholder="100"
                    value={formData.points}
                    onChange={handleChange}
                    error={errors.points}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="allowLateSubmissions"
                      checked={formData.allowLateSubmissions}
                      onChange={handleChange}
                      className="rounded border-surface-300 text-primary-600"
                    />
                    <span className="text-sm text-surface-700">Allow Late Submissions</span>
                  </label>

                  {formData.allowLateSubmissions && (
                    <Input
                      label="Late Penalty (%)"
                      name="latePenalty"
                      type="number"
                      placeholder="10"
                      value={formData.latePenalty}
                      onChange={handleChange}
                      className="w-32"
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
                    {assignment ? 'Update Assignment' : 'Create Assignment'}
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

export default AssignmentModal;