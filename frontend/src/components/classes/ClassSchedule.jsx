import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Card from '../ui/Card';

// Setup localizer
const localizer = momentLocalizer(moment);

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassSchedule = ({ schedule = [] }) => {
  const [view, setView] = useState('week');

  // Convert schedule to calendar events
  const events = schedule.map((item, index) => {
    const [startHour, startMinute] = item.startTime.split(':');
    const [endHour, endMinute] = item.endTime.split(':');
    
    // Create a date for the event (using today's date as base, but we'll set the day based on the schedule day)
    const today = new Date();
    const dayIndex = daysOfWeek.indexOf(item.day);
    const currentDayOfWeek = today.getDay();
    const daysToAdd = dayIndex - (currentDayOfWeek - 1); // Adjust for Monday as first day
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysToAdd);
    startDate.setHours(parseInt(startHour), parseInt(startMinute), 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(parseInt(endHour), parseInt(endMinute), 0);
    
    return {
      id: index,
      title: item.subject?.name || 'Subject',
      start: startDate,
      end: endDate,
      resource: {
        subject: item.subject,
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      },
    };
  });

  // Custom event styling
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#6366F1',
        borderRadius: '0.5rem',
        border: 'none',
        color: 'white',
        padding: '2px 4px',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
    };
  };

  return (
    <Card className="p-4">
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['week', 'day']}
          view={view}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => {
              return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
            },
          }}
          step={30}
          timeslots={2}
          min={new Date().setHours(7, 0, 0)}
          max={new Date().setHours(18, 0, 0)}
          className="rounded-lg"
        />
      </div>
    </Card>
  );
};

export default ClassSchedule;