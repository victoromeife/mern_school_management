import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import EventModal from '../components/events/EventModal';
import EventCalendar from '../components/events/EventCalendar';
import Button from '../components/ui/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Events = () => {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list or calendar
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await api.post('/events', data);
      toast.success('Event created successfully');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/events/${editingEvent._id}`, data);
      toast.success('Event updated successfully');
      fetchEvents();
      setEditingEvent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
      throw error;
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    try {
      await api.delete(`/events/${event._id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const upcomingEvents = events
    .filter(e => new Date(e.endDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const pastEvents = events
    .filter(e => new Date(e.endDate) < new Date())
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Events</h1>
          <p className="text-surface-500 mt-1">School calendar and activities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'calendar'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <CalendarDaysIcon className="w-4 h-4" />
            </button>
          </div>
          {isAdmin && (
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      {view === 'calendar' ? (
        <EventCalendar
          events={events}
          onEventClick={(event) => {
            if (isAdmin) {
              setEditingEvent(event.resource);
              setModalOpen(true);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.length === 0 && (
                <p className="text-center text-surface-500 py-8">No upcoming events</p>
              )}
              {upcomingEvents.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={setEditingEvent}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Past Events</h2>
            <div className="space-y-4">
              {pastEvents.length === 0 && (
                <p className="text-center text-surface-500 py-8">No past events</p>
              )}
              {pastEvents.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={setEditingEvent}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdate : handleCreate}
        event={editingEvent}
      />
    </motion.div>
  );
};

export default Events;