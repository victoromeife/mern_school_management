import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const eventTypes = [
  { id: 'holiday', label: 'Holiday' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'academic', label: 'Academic' },
  { id: 'other', label: 'Other' },
];

const audiences = [
  { id: 'all', label: 'Everyone' },
  { id: 'students', label: 'Students Only' },
  { id: 'teachers', label: 'Teachers Only' },
  { id: 'parents', label: 'Parents Only' },
  { id: 'admin', label: 'Admin Only' },
];

const EventModal = ({ isOpen, onClose, onSubmit, event = null, classes = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'other',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    allDay: true,
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    targetAudience: ['all'],
    color: '#6366F1',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'other',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '',
        allDay: event.allDay !== undefined ? event.allDay : true,
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '17:00',
        location: event.location || '',
        targetAudience: event.targetAudience || ['all'],
        color: event.color || '#6366F1',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        eventType: 'other',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        allDay: true,
        startTime: '09:00',
        endTime: '17:00',
        location: '',
        targetAudience: ['all'],
        color: '#6366F1',
      });
    }
    setErrors({});
  }, [event, isOpen]);

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
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
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
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                  {event ? 'Edit Event' : 'Create Event'}
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
                  placeholder="Event title"
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
                    rows={3}
                    placeholder="Event description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-surface-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {eventTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full h-10 rounded-lg border border-surface-300 cursor-pointer"
                    />
                  </div>

                  <Input
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    error={errors.startDate}
                    required
                  />

                  <Input
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    error={errors.endDate}
                    required
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="allDay"
                    checked={formData.allDay}
                    onChange={handleChange}
                    className="rounded border-surface-300 text-primary-600"
                  />
                  <span className="text-sm text-surface-700">All Day Event</span>
                </label>

                {!formData.allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Time"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                    <Input
                      label="End Time"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <Input
                  label="Location"
                  name="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={handleChange}
                />

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

                <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" isLoading={loading}>
                    {event ? 'Update' : 'Create'}
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

export default EventModal;