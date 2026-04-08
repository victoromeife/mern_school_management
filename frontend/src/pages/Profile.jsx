import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import Card from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await api.put(`/users/${user._id}`, data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvatar = async (formData) => {
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    updateUser(response.data.user);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900">My Profile</h1>
        <p className="text-surface-500 mt-1">View and manage your profile information</p>
      </div>

      <Card>
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Profile Information</h2>
        </div>
        <div className="p-6 flex flex-col items-center border-b border-surface-200">
          <AvatarUpload
            currentAvatar={user?.avatar}
            onUpload={handleUpdateAvatar}
            size="lg"
          />
        </div>
        <div className="p-6">
          <ProfileForm
            user={user}
            onSubmit={handleUpdateProfile}
            loading={loading}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default Profile;