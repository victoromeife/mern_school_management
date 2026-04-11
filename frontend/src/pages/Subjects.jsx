import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Subjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data.subjects || response.data || []);
    } catch (error) {
      console.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingId(subject._id);
      setFormData({
        name: subject.name,
        code: subject.code || '',
        description: subject.description || '',
      });
    } else {
      setFormData({ name: '', code: '', description: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', code: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Subject name is required');
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await api.put(`/subjects/${editingId}`, formData);
        setSubjects(subjects.map(s => s._id === editingId ? response.data.subject : s));
        toast.success('Subject updated successfully');
      } else {
        response = await api.post('/subjects', formData);
        setSubjects([...subjects, response.data.subject]);
        toast.success('Subject created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        setSubjects(subjects.filter(s => s._id !== id));
        toast.success('Subject deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Subjects</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage school subjects and courses</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => handleOpenModal()}
          >
            <PlusIcon className="w-5 h-5" />
            New Subject
          </Button>
        )}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <motion.div
              key={subject._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <BookOpenIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{subject.name}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{subject.code}</p>
                    </div>
                  </div>
                  {(user?.role === 'admin' || user?.role === 'teacher') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(subject)}
                        className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
                        className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {subject.description && (
                  <p className="text-sm text-surface-600 dark:text-surface-300 mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {subject.students?.length || 0} students
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                    {subject.teacher?.name || 'Unassigned'}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="col-span-full text-center py-12">
            <BookOpenIcon className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
            <p className="text-surface-500 dark:text-surface-400">No subjects found</p>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => handleOpenModal()}
              >
                Create First Subject
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Subject Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Subject' : 'New Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Mathematics"
            required
          />
          <Input
            label="Subject Code"
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., MATH101"
          />
          <div>
            <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Subject description (optional)"
              className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="4"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {editingId ? 'Update' : 'Create'} Subject
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Subjects;
