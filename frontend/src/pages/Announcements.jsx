import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import AnnouncementModal from '../components/announcements/AnnouncementModal';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Announcements = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pinned, urgent

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await api.post('/announcements', { ...data, status: 'published' });
      toast.success('Announcement created successfully');
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create announcement');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/announcements/${editingAnnouncement._id}`, data);
      toast.success('Announcement updated successfully');
      fetchAnnouncements();
      setEditingAnnouncement(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update announcement');
      throw error;
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await api.post(`/announcements/${id}/acknowledge`);
      toast.success('Announcement acknowledged');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to acknowledge');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === 'pinned') return a.isPinned;
    if (filter === 'urgent') return a.priority === 'urgent';
    return true;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Announcements</h1>
          <p className="text-surface-500 mt-1">School notices and updates</p>
        </div>
        {(isAdmin || isTeacher) && (
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Post Announcement
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <MegaphoneIcon className="w-4 h-4 text-surface-400" />
        {['all', 'pinned', 'urgent'].map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === opt
                ? 'bg-primary-100 text-primary-700'
                : 'text-surface-500 hover:bg-surface-100'
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5 animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          <>
            {pinnedAnnouncements.map(announcement => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onAcknowledge={handleAcknowledge}
                isTeacher={isAdmin || isTeacher}
              />
            ))}
            {regularAnnouncements.map(announcement => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onAcknowledge={handleAcknowledge}
                isTeacher={isAdmin || isTeacher}
              />
            ))}
          </>
        )}
      </div>

      <AnnouncementModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={editingAnnouncement ? handleUpdate : handleCreate}
        announcement={editingAnnouncement}
      />
    </motion.div>
  );
};

export default Announcements;