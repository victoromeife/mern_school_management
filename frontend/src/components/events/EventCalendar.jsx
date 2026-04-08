import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Card from '../ui/Card';

const localizer = momentLocalizer(moment);

const EventCalendar = ({ events = [], onEventClick }) => {
  const [view, setView] = useState('month');

  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event._id,
      title: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      allDay: event.allDay,
      resource: event,
    }));
  }, [events]);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.resource.color || '#6366F1',
        borderRadius: '0.5rem',
        border: 'none',
        color: 'white',
        padding: '2px 6px',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
    };
  };

  return (
    <Card className="p-4">
      <div className="h-[700px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onEventClick}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => {
              return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
            },
          }}
          className="rounded-lg"
          popup
        />
      </div>
    </Card>
  );
};

export default EventCalendar;