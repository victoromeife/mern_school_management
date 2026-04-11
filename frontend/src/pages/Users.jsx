import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import UserTable from '../components/users/UserTable';
import UserModal from '../components/users/UserModal';
import BulkActions from '../components/users/BulkActions';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreate = async (userData) => {
    try {
      await api.post('/users', userData);
      toast.success('User created successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    }
  };

  // Update user
  const handleUpdate = async (userData) => {
    try {
      await api.put(`/users/${editingUser._id}`, userData);
      toast.success('User updated successfully');
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    
    try {
      await api.delete(`/users/${user._id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedUsers.length} selected users?`)) return;
    
    try {
      await Promise.all(selectedUsers.map(id => api.delete(`/users/${id}`)));
      toast.success(`${selectedUsers.length} users deleted`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete some users');
    }
  };

  // Export CSV
  const handleExport = () => {
    const selected = users.filter(u => selectedUsers.includes(u._id));
    const dataToExport = selected.length > 0 ? selected : users;
    
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const csvData = dataToExport.map(user => [
      user.name,
      user.email,
      user.role,
      user.isActive !== false ? 'Active' : 'Inactive'
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export started');
  };

  // Bulk add placeholder
  const handleBulkAdd = () => {
    toast.success('Bulk add feature coming soon');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">User Management</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage all users in the system</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedUsers.length}
        onDelete={handleBulkDelete}
        onExport={handleExport}
        onBulkAdd={handleBulkAdd}
      />

      {/* User Table */}
      <Card>
        <UserTable
          users={users}
          loading={loading}
          onEdit={(user) => {
            setEditingUser(user);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onSelect={setSelectedUsers}
        />
      </Card>

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        user={editingUser}
      />
    </motion.div>
  );
};

export default Users;