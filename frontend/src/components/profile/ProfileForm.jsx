import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

const ProfileForm = ({ user, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Full Name"
        name="name"
        placeholder="Your full name"
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
        placeholder="you@school.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<EnvelopeIcon className="w-4 h-4 text-surface-400" />}
        required
        disabled={user?.role === 'admin'} // Admin emails might be locked
      />

      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={formData.phone}
        onChange={handleChange}
        icon={<PhoneIcon className="w-4 h-4 text-surface-400" />}
      />

      <Input
        label="Address"
        name="address"
        placeholder="Your address"
        value={formData.address}
        onChange={handleChange}
        icon={<MapPinIcon className="w-4 h-4 text-surface-400" />}
      />

      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        icon={<CalendarIcon className="w-4 h-4 text-surface-400" />}
      />

      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;