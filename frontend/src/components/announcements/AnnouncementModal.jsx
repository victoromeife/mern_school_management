import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const categories = [
  { id: 'general', label: 'General' },
  { id: 'academic', label: 'Academic' },
  { id: 'administrative', label: 'Administrative' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'event-reminder', label: 'Event Reminder' },
  { id: 'achievement', label: 'Achievement' },
];

const priorities = [
  { id: 'low', label: 'Low', color: 'text-gray-500' },
  { id: 'normal', label: 'Normal', color: 'text-blue-500' },
  { id: 'high', label: 'High', color: 'text-orange-500' },
  { id: 'urgent', label: 'Urgent', color: 'text-red-500' },
];

const audiences = [
  { id: 'all', label: 'Everyone' },
  { id: 'students', label: 'Students Only' },
  { id: 'teachers', label: 'Teachers Only' },
  { id: 'parents', label: 'Parents Only' },
  { id: 'admin', label: 'Admin Only' },
];

const AnnouncementModal = ({ isOpen, onClose, onSubmit, announcement = null, classes = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    targetAudience: ['all'],
    publishDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
    isPinned: false,
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        category: announcement.category || 'general',
        priority: announcement.priority || 'normal',
        targetAudience: announcement.targetAudience || ['all'],
        publishDate: announcement.publishDate ? new Date(announcement.publishDate).toISOString().slice(0, 16) : '',
        expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().slice(0, 16) : '',
        isPinned: announcement.isPinned || false,
        attachments: announcement.attachments || [],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'normal',
        targetAudience: ['all'],
        publishDate: new Date().toISOString().slice(0, 16),
        expiryDate: '',
        isPinned: false,
        attachments: [],
      });
    }
    setErrors({});
  }, [announcement, isOpen]);

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

  const handleAudienceChange = (audienceId) => {
    setFormData(prev => {
      const current = prev.targetAudience;
      if (current.includes(audienceId)) {
        return { ...prev, targetAudience: current.filter(a => a !== audienceId) };
      } else {
        return { ...prev, targetAudience: [...current, audienceId] };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    if (!formData.publishDate) newErrors.publishDate = 'Publish date is required';
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
                  {announcement ? 'Edit Announcement' : 'Create Announcement'}
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
                  placeholder="Announcement title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    rows={6}
                    placeholder="Write your announcement here..."
                    value={formData.content}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.content ? 'border-red-300' : 'border-surface-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    required
                  />
                  {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {priorities.map(pri => (
                        <option key={pri.id} value={pri.id} className={pri.color}>{pri.label}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Publish Date"
                    name="publishDate"
                    type="datetime-local"
                    value={formData.publishDate}
                    onChange={handleChange}
                    error={errors.publishDate}
                  />

                  <Input
                    label="Expiry Date (Optional)"
                    name="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Target Audience
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {audiences.map(aud => (
                      <button
                        key={aud.id}
                        type="button"
                        onClick={() => handleAudienceChange(aud.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          formData.targetAudience.includes(aud.id)
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                      >
                        {aud.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleChange}
                    className="rounded border-surface-300 text-primary-600"
                  />
                  <span className="text-sm text-surface-700">Pin to top of notice board</span>
                </label>

                <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
                    {announcement ? 'Update' : 'Create'}
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

export default AnnouncementModal;