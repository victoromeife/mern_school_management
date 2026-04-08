import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const roles = [
    { 
        id: 'admin', 
        label: 'Admin', 
        description: 'Full system access' 
    },
    { 
        id: 'teacher', 
        label: 'Teacher', 
        description: 'Manage classes and grades' 
    },
    { 
        id: 'student', 
        label: 'Student', 
        description: 'View assignments and results' 
    },
    { 
        id: 'parent', 
        label: 'Parent', 
        description: 'Track children\'s progress' 
    },
];

const UserModal = ({ isOpen, onClose, onSubmit, user = null }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      role: 'student',
      isActive: true,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'student',
            isActive: user.isActive !== false,
            password: '', // Don't populate password
          });
        } else {
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'student',
            isActive: true,
          });
        }
        setErrors({});
    }, [user, isOpen]);

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
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!user && !formData.password) newErrors.password = 'Password is required';
        else if (!user && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-surface-200">
                                <h2 className="text-xl font-semibold text-surface-900">
                                  {user ? 'Edit User' : 'Add New User'}
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
                                <Input
                                  label="Full Name"
                                  name="name"
                                  placeholder="John Doe"
                                  value={formData.name}
                                  onChange={handleChange}
                                  error={errors.name}
                                  required
                                />

                                <Input
                                  label="Email"
                                  name="email"
                                  type="email"
                                  placeholder="you@school.com"
                                  value={formData.email}
                                  onChange={handleChange}
                                  error={errors.email}
                                  required
                                />

                                {!user && (
                                  <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    helperText="At least 6 characters"
                                    required
                                  />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-1">
                                      Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {roles.map((role) => (
                                            <button
                                              key={role.id}
                                              type="button"
                                              onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                                              className={`p-2 rounded-lg border-2 text-left transition-all ${
                                                formData.role === role.id
                                                  ? 'border-primary-500 bg-primary-50'
                                                  : 'border-surface-200 hover:border-primary-300'
                                              }`}
                                            >
                                                <p className={`font-medium ${
                                                  formData.role === role.id ? 'text-primary-700' : 'text-surface-900'
                                                }`}>
                                                  {role.label}
                                                </p>
                                                <p className="text-xs text-surface-500">{role.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                  
                                <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      name="isActive"
                                      checked={formData.isActive}
                                      onChange={handleChange}
                                      className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-surface-700">Active Account</span>
                                </label>
                                  
                                <div className="flex items-center gap-3 pt-4">
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
                                      {user ? 'Update User' : 'Create User'}
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

export default UserModal;