import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LockClosedIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ChangePasswordForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Current Password"
        name="currentPassword"
        type="password"
        placeholder="Enter current password"
        value={formData.currentPassword}
        onChange={handleChange}
        error={errors.currentPassword}
        icon={<LockClosedIcon className="w-4 h-4 text-surface-400" />}
        required
      />

      <Input
        label="New Password"
        name="newPassword"
        type="password"
        placeholder="Enter new password"
        value={formData.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        icon={<KeyIcon className="w-4 h-4 text-surface-400" />}
        helperText="At least 6 characters"
        required
      />

      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={<ShieldCheckIcon className="w-4 h-4 text-surface-400" />}
        required
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
        Update Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;