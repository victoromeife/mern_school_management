import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { requestPasswordReset } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            await requestPasswordReset(email);
            setSent(true);
            toast.success('Password reset email sent!');
        } 
        catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
                        <span className="text-white font-bold text-2xl">E</span>
                    </div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Reset password</h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">Enter your email and we'll send you a link to reset your password</p>
                </div>

                <Card>
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="Email Address" type="email" placeholder="you@school.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className="w-4 h-4 text-surface-400" />} required/>

                            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>Send Reset Link</Button>

                            <div className="text-center">
                                <Link to="/login" className="inline-flex items-center text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    <ArrowLeftIcon className="size-4 mr-2" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                            <div className="size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                <svg className="size-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 dark:text-white">Check your email</h3>
                            <p className="text-surface-600 dark:text-surface-400">We've sent a password reset link to <strong>{email}</strong></p>
                            <p className="text-sm text-surface-500 dark:text-surface-500">Didn't receive the email?{' '}
                                <button onClick={() => {setSent(false); handleSubmit();}} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">Click to resend</button>
                            </p>
                            <Link to="/login" className="inline-block mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">Return to login</Link>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;