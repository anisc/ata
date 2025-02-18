// frontend/src/components/Team.jsx
import React from 'react';
import './Team.css';

function Team() {
  const teamMembers = [
    { id: 1, name: 'Zouhair', role: 'President', bio: 'Bio of Member 1...', image: '/team-member-1.jpg' }, // Add image paths
    { id: 2, name: 'Fauzi', role: 'Vice President', bio: 'Bio of Member 2...', image: '/team-member-2.jpg' },
    { id: 3, name: 'Chokri', role: 'Treasurer', bio: 'Bio of Member 3...', image: '/team-member-3.jpg' },
  ];

  return (
    <div className="container">
      <section className="team py-3">
        <h1 className="mb-2 text-center">Meet the Team</h1>

        <section className="vision mb-3">
          <h2 className="mb-2">Our Vision</h2>
          <p>
            To be the leading organization representing and supporting the
            Tunisian community in Alberta.
          </p>
        </section>

        <section className="values mb-3">
          <h2 className="mb-2">Our Values</h2>
          <ul>
            <li>Community</li>
            <li>Culture</li>
            <li>Collaboration</li>
            <li>Support</li>
          </ul>
        </section>

        <section className="board">
          <h2 className="mb-2">Board Members</h2>
          <div className="team-members">
            {teamMembers.map((member) => (
              <div className="team-member" key={member.id}>
                <img src={member.image} alt={member.name} className="team-member-image" />
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Team;
