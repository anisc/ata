// frontend/src/components/Membership.jsx
import React from 'react';
import './Membership.css';

function Membership() {
  return (
    <div className="container">
      <section className="membership-page py-3">
        <h1 className="mb-2 text-center">Become a Member</h1>
        <p className="text-center mb-3">
          Join the Alberta Tunisian Association and enjoy exclusive benefits!
        </p>

        <div className="benefits-list">
          <h2>Membership Benefits:</h2>
          <ul>
            <li>Access to all ATA community events</li>
            <li>Voting rights in association matters</li>
            <li>Network with fellow Tunisian-Albertans</li>
            <li>Cultural and social support services</li>
            <li>Monthly newsletter updates</li>
            <li>Exclusive member discounts</li>
          </ul>
        </div>

        <div className="membership-info text-center">
          {/* Placeholder for membership purchase information */}
          <p>Membership purchase details will go here.</p>
          <button>Purchase Membership</button> {/* Placeholder button */}
        </div>
      </section>
    </div>
  );
}

export default Membership;
