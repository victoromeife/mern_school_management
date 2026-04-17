import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
  
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Validate token exists
        if (!token) {
            setError('Invalid or missing reset token');
            setValidating(false);
            setIsValid(false);
            return;
        }
    
        // You could optionally validate the token with backend here
        setValidating(false);
        setIsValid(true);
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } 
        catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } 
        finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExclamationCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Invalid Reset Link</h2>
                    <p className="text-surface-600 dark:text-surface-400 mb-6">
                        {error || 'The password reset link is invalid or has expired.'}
                    </p>
                    <Link to="/forgot-password" className="inline-block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        Request a new reset link
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
                        <span className="text-white font-bold text-2xl">E</span>
                    </div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create new password</h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">Enter your new password below</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="New Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockClosedIcon className="w-4 h-4 text-surface-400" />} required helperText="At least 6 characters"/>

                        <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<LockClosedIcon className="w-4 h-4 text-surface-400" />} required/>

                        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>Reset Password</Button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                Back to login
                            </Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
