import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input'
import Card from '../components/ui/Card';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { verifyEmail, resendVerification } = useAuth();
  
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (token) {
            verifyEmailHandler();
        } 
        else {
            setLoading(false);
        }
    }, [token]);

    const verifyEmailHandler = async () => {
        setLoading(true);
        try {
            await verifyEmail(token);
            setSuccess(true);
            toast.success('Email verified successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } 
        catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
        } 
        finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setResending(true);
        try {
            await resendVerification(email);
            toast.success('Verification email sent!');
        } 
        catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend verification');
        } 
        finally {
            setResending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
                        <span className="text-white font-bold text-2xl">E</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Email Verification</h1>
                </div>

                <Card className='bg-gray-800'>
                    {token ? (
                            success ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircleIcon className="size-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-surface-900">Email Verified!</h3>
                                    <p className="text-surface-600">Your email has been successfully verified.</p>
                                    <p className="text-sm text-surface-500">Redirecting to login...</p>
                                    <Link to="/login" className="inline-block mt-2 text-primary-600 hover:text-primary-700 font-medium">
                                        Click here if not redirected
                                    </Link>
                                </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <XCircleIcon className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-surface-900">Verification Failed</h3>
                                <p className="text-surface-600">
                                    {error || 'The verification link is invalid or has expired.'}
                                </p>
                                <Link to="/login" className="inline-block text-primary-600 hover:text-primary-700 font-medium">
                                    Return to login
                                </Link>
                            </motion.div>
                        )
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <EnvelopeIcon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-white/100">Verify your email</h3>
                                <p className="text-surface-600 mt-2">
                                    We've sent a verification link to your email address.
                                    Please check your inbox and click the link to verify your account.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Input label="Email Address" type="email" placeholder="you@school.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                                <Button onClick={handleResend} variant="primary" size="lg" className="w-full" isLoading={resending}>
                                    Resend Verification Email
                                </Button>

                                <div className="text-center">
                                    <Link to="/login" className="text-sm text-surface-600 hover:text-primary-600 transition-colors">
                                        Back to login
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;