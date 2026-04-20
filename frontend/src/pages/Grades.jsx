import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    description: ''
  });

  // Fetch grades
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await api.get('/grades');
      setGrades(response.data.grades);
    } catch (error) {
      console.error('Fetch grades error:', error);
      toast.error('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingGrade) {
        await api.put(`/grades/${editingGrade._id}`, formData);
        toast.success('Grade updated successfully');
      } else {
        await api.post('/grades', formData);
        toast.success('Grade created successfully');
      }

      fetchGrades();
      setModalOpen(false);
      setEditingGrade(null);
      setFormData({ name: '', level: '', description: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save grade');
    }
  };

  // Handle edit
  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      name: grade.name,
      level: grade.level,
      description: grade.description || ''
    });
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (grade) => {
    if (!window.confirm(`Are you sure you want to delete ${grade.name}?`)) return;

    try {
      await api.delete(`/grades/${grade._id}`);
      toast.success('Grade deleted successfully');
      fetchGrades();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete grade');
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Grade Management
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Manage school grades and academic levels
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingGrade(null);
            setFormData({ name: '', level: '', description: '' });
            setModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Grade
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-surface-200 dark:border-surface-700">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-surface-900 dark:text-surface-100">
                    Grade Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900 dark:text-surface-100">
                    Level
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900 dark:text-surface-100">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-surface-900 dark:text-surface-100">
                    Subjects
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-surface-900 dark:text-surface-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade._id} className="border-b border-surface-100 dark:border-surface-800">
                    <td className="py-3 px-4 text-surface-900 dark:text-surface-100 font-medium">
                      {grade.name}
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">
                      {grade.level}
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">
                      {grade.description || 'No description'}
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">
                      {grade.subjects?.length || 0} subjects
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(grade)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {grades.length === 0 && (
              <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                No grades found. Create your first grade to get started.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100">
              {editingGrade ? 'Edit Grade' : 'Add Grade'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Grade Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                  placeholder="e.g., Grade 10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Level *
                </label>
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                  placeholder="e.g., 10"
                  min="1"
                  max="12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100"
                  placeholder="Optional description"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGrade ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Grades;