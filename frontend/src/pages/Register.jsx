import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    EyeIcon,
    EyeSlashIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

const roles = [
    { 
        id: 'student',
        label: 'Student', 
        icon: UserIcon, 
        description: 'Access assignments and grades' 
    },
    { 
        id: 'parent', 
        label: 'Parent', 
        icon: UserGroupIcon, 
        description: 'Track your children\'s progress' 
    },
    { 
        id: 'teacher',
        label: 'Teacher', 
        icon: AcademicCapIcon, 
        description: 'Manage classes and grades' 
    },
];

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const selectRole = (roleId) => {
        setFormData(prev => ({ ...prev, role: roleId }));
        setErrors(prev => ({ ...prev, role: '' }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.role) newErrors.role = 'Please select a role';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
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

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        const result = await register({
            username: formData.username,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        });
        setLoading(false);

        if (result.success) {
            // Navigate directly to dashboard after registration
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create an account</h1>
                <p className="text-surface-600 dark:text-gray-400 mt-2">Join EduFlow today</p>
              </motion.div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step >= 1 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-surface-200 dark:bg-gray-700 text-surface-600 dark:text-gray-400'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 mx-2 ${
                    step >= 2 ? 'bg-primary-600' : 'bg-surface-200 dark:bg-gray-700'
                  }`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step >= 2 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-surface-200 dark:bg-gray-700 text-surface-600 dark:text-gray-400'
                  }`}>
                    2
                  </div>
                </div>
              </div>
                
                <Card className="p-8">
                    {step === 1 ? (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">
                            Select your role
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {roles.map((role) => (
                              <button
                                key={role.id}
                                type="button"
                                onClick={() => selectRole(role.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  formData.role === role.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-surface-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-surface-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                <role.icon className={`w-8 h-8 mb-3 ${
                                  formData.role === role.id ? 'text-primary-600' : 'text-surface-400'
                                }`} />
                                <h3 className={`font-semibold mb-1 ${
                                  formData.role === role.id ? 'text-primary-700 dark:text-primary-400' : 'text-surface-900 dark:text-white'
                                }`}>
                                  {role.label}
                                </h3>
                                <p className="text-sm text-surface-500 dark:text-gray-400">
                                  {role.description}
                                </p>
                              </button>
                            ))}
                          </div>
                          {errors.role && (
                            <p className="text-sm text-red-600 mb-4">{errors.role}</p>
                          )}
                          <div className="flex justify-end">
                            <Button onClick={handleNext} size="lg">
                              Continue
                              <ChevronRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </motion.div>
                    ) : (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6">
                                  Your information
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <Input
                                        label="Username"
                                        name="username"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        error={errors.username}
                                        icon={<UserIcon className="w-4 h-4 text-surface-400" />}
                                        required
                                    />

                                    <Input
                                        label="Full Name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        icon={<UserIcon className="w-4 h-4 text-surface-400" />}
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
                                            className="absolute right-3 top-9 text-surface-400 hover:text-surface-600 transition-colors"
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
                                        icon={<LockClosedIcon className="size-4 text-surface-400" />}
                                        required
                                    />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleBack}
                                            className="flex-1"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="flex-1"
                                            isLoading={loading}
                                        >
                                            Create Account
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                    )}
                </Card>
              
                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-surface-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                          Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};  

export default Register;