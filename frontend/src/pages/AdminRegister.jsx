import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    EyeIcon,
    EyeSlashIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../services/api';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.post('/auth/admin-register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                name: formData.name,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            toast.success('Admin account created successfully!');
            navigate('/');
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Admin account already exists. Sign in instead.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to create admin account');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
                        <ShieldCheckIcon className="text-white font-bold text-2xl w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create Admin Account</h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">Register as the first administrator of EduFlow</p>
                </motion.div>

                {/* Warning Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
                >
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        <strong>Note:</strong> Only the first user to register can create an admin account. All subsequent users will be registered as teachers or other roles.
                    </p>
                </motion.div>

                {/* Register Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Username"
                                name="username"
                                placeholder="johnadmin"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                                icon={<UserIcon className="w-4 h-4 text-surface-400" />}
                                required
                            />

                            <Input
                                label="Full Name"
                                name="name"
                                placeholder="John Admin"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                icon={<UserIcon className="w-4 h-4 text-surface-400" />}
                                required
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="admin@school.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                icon={<EnvelopeIcon className="w-4 h-4 text-surface-400" />}
                                required
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    icon={<LockClosedIcon className="w-4 h-4 text-surface-400" />}
                                    helperText="At least 6 characters"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-4 h-4" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                icon={<LockClosedIcon className="w-4 h-4 text-surface-400" />}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={loading}
                            >
                                Create Admin Account
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-200 dark:border-surface-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-surface-800 text-surface-500 dark:text-surface-400">
                                    Already an admin?
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
                            >
                                Sign in instead
                            </Link>
                        </div>
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                        © {new Date().getFullYear()} EduFlow. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminRegister;
