// frontend/src/components/EventModal.jsx
import React from 'react';
import './EventModal.css';

function EventModal({ event, onClose }) {
  if (!event) {
    return null; // Don't render anything if there's no event
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {event.start.toDateString()}</p>
        <p><strong>Time:</strong> {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Description:</strong> {event.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default EventModal;
