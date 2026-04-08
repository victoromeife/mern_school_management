import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ClassStudents = ({ students = [], availableStudents = [], onAddStudent, onRemoveStudent }) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(search.toLowerCase()) ||
    student.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailable = availableStudents.filter(student =>
    !students.some(s => s._id === student._id) &&
    (student.name?.toLowerCase().includes(search.toLowerCase()) ||
     student.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (selectedStudent) {
      onAddStudent(selectedStudent);
      setSelectedStudent('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-surface-900">Students</h3>
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-sm">
            {students.length}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlusIcon className="w-4 h-4 mr-1" />
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
        />
      </div>

      {/* Student List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <p className="text-center text-surface-500 py-8">No students found</p>
        ) : (
          filteredStudents.map((student, index) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                  {student.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-surface-900">{student.name}</p>
                  <p className="text-sm text-surface-500">{student.email}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveStudent(student._id)}
                className="p-1 rounded-lg text-surface-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Add Student</h3>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full rounded-lg border border-surface-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a student...</option>
              {filteredAvailable.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!selectedStudent}
                className="flex-1"
              >
                Add Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassStudents;