// frontend/src/components/WelcomeModal.jsx
import React, { useState, useEffect } from 'react';
import './WelcomeModal.css';
import { Link } from 'react-router-dom';

function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false); // New state

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    const dontShowAgainValue = localStorage.getItem('dontShowWelcomeModalAgain');
    const hasCompletedCensus = localStorage.getItem('hasCompletedCensus');

    // Only show the modal if:
    // 1. They haven't seen it OR they haven't chosen "Don't show again"
    // 2. They haven't completed the census
    if ((!hasSeenModal || dontShowAgainValue !== 'true') && hasCompletedCensus !== 'true') {
      setIsOpen(true);
    }

    // Load "don't show again" preference
    if (dontShowAgainValue === 'true') {
        setDontShowAgain(true);
    }

  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  const handleDontShowAgain = () => {
    setDontShowAgain(true);
    localStorage.setItem('dontShowWelcomeModalAgain', 'true');
    closeModal(); // Close the modal after setting the preference
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="welcome-modal-overlay" onClick={closeModal}>
      <div className="welcome-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to the Alberta Tunisian Association!</h2>
        <p>
          We encourage you to participate in our census.  By providing your information, you help us build a stronger community and enable us to advocate for consular services here in Alberta, such as:
        </p>
        <ul>
          <li>Passport renewal</li>
          <li>Identity card renewal</li>
          <li>Birth certificate services</li>
        </ul>
        <p>
          Your participation is greatly appreciated! Please share this website with other Tunisians in Alberta that you know.
        </p>
        <Link to="/census">
            <button>Go to Census</button>
        </Link>
        <button onClick={closeModal}>Close</button>
        {/* "Don't show again" button */}
        <button onClick={handleDontShowAgain}>Don't show this again</button>
      </div>
    </div>
  );
}

export default WelcomeModal;
