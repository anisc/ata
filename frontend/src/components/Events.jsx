// frontend/src/components/Events.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Events.css';
import EventModal from './EventModal';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Events() {
  const [events, setEvents] = useState([]); // Store events fetched from the backend
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`)
      .then(response => response.json())
      .then(data => {
        // Convert start and end strings back to Date objects
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.start),
          endTime: new Date(event.end),
        }));
        setEvents(formattedEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []); // Empty dependency array means this runs only once on mount


  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container">
      <section className="events py-3">
        <h1 className="mb-2 text-center">Events</h1>

        <section className="upcoming mb-3">
          <h2 className="mb-2">Upcoming Events</h2>
          <Calendar
            localizer={localizer}
            events={events} // Use the fetched events
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day']}
          />
        </section>

        <section className="past mb-3">
          <h2 className="mb-2">Past Events</h2>
          <p>Gallery will go here...</p>
        </section>

        <section className="categories">
          <h2 className="mb-2">Event Categories</h2>
          <ul>
            <li>Cultural</li>
            <li>Social</li>
            <li>Educational</li>
          </ul>
        </section>

        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      </section>
    </div>
  );
}

export default Events;
