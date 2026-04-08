import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
    UserCircleIcon,
    EnvelopeIcon,
    AcademicCapIcon,
    UserGroupIcon,
    IdentificationIcon,
} from '@heroicons/react/24/outline';

const roleIcons = {
    admin: <IdentificationIcon className="w-4 h-4" />,
    teacher: <AcademicCapIcon className="w-4 h-4" />,
    student: <UserCircleIcon className="w-4 h-4" />,
    parent: <UserGroupIcon className="w-4 h-4" />,
};

const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    teacher: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700',
    parent: 'bg-orange-100 text-orange-700',
};

const UserTable = ({ users, loading, onEdit, onDelete, onSelect }) => {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort icon
    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUpDownIcon className="w-4 h-4" />;
        return sortDirection === 'asc' 
            ? <ChevronUpIcon className="w-4 h-4" />
            : <ChevronDownIcon className="w-4 h-4" />;
    };

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        let filtered = [...users];
        
        // Search
        if (search) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase()) ||
                user.role?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (typeof aVal === 'string') {
                aVal = aVal?.toLowerCase();
                bVal = bVal?.toLowerCase();
            }
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [users, search, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
          const allIds = paginatedUsers.map(user => user._id);
          setSelectedUsers(allIds);
          onSelect?.(allIds);
        } else {
          setSelectedUsers([]);
          onSelect?.([]);
        }
    };

    // Select single
    const handleSelectUser = (userId, checked) => {
        let newSelected;
        if (checked) {
          newSelected = [...selectedUsers, userId];
        } else {
          newSelected = selectedUsers.filter(id => id !== userId);
        }
        setSelectedUsers(newSelected);
        onSelect?.(newSelected);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-200">
                            <th className="w-8 py-3">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                />
                            </th>
                            <th className="text-left py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1 text-sm font-medium text-surface-600">
                                    User
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th className="text-left py-3 cursor-pointer" onClick={() => handleSort('email')}>
                                <div className="flex items-center gap-1 text-sm font-medium text-surface-600">
                                    Email
                                    <SortIcon field="email" />
                                </div>
                            </th>
                            <th className="text-left py-3 cursor-pointer" onClick={() => handleSort('role')}>
                                <div className="flex items-center gap-1 text-sm font-medium text-surface-600">
                                    Role
                                    <SortIcon field="role" />
                                </div>
                            </th>
                            <th className="text-left py-3 cursor-pointer" onClick={() => handleSort('status')}>
                                <div className="flex items-center gap-1 text-sm font-medium text-surface-600">
                                    Status
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th className="text-right py-3 text-sm font-medium text-surface-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedUsers.map((user, index) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                >
                                    <td className="py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                                            className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                                                {user.name?.charAt(0) || user.email?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-surface-900">{user.name}</p>
                                                <p className="text-xs text-surface-500">ID: {user._id?.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="w-4 h-4 text-surface-400" />
                                            <span className="text-sm text-surface-600">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                                          {roleIcons[user.role]}
                                          <span className="capitalize">{user.role}</span>
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          user.isActive !== false
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                          {user.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                              onClick={() => onEdit(user)}
                                              className="p-1 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                              title="Edit"
                                            >
                                              <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => onDelete(user)}
                                              className="p-1 rounded-lg text-surface-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                              title="Delete"
                                            >
                                              <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-surface-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                    <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-surface-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;