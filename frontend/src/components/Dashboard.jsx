import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';



function Dashboard() {
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        location: '',
        description: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeSection, setActiveSection] = useState('statistics'); // 'statistics', 'members', or 'events'
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const membersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/members`);
                if (!membersResponse.ok) {
                    throw new Error(`HTTP error! status: ${membersResponse.status}`);
                }
                const membersData = await membersResponse.json();

                // Robustly handle familyMembers parsing with error handling
                const formattedMembers = membersData.map((member) => {
                    let familyMembers = []; // Default to empty array
                    try {
                        // More robust check: ensure member.familyMembers is a string before parsing
                        if (typeof member.familyMembers === 'string' && member.familyMembers) {
                            familyMembers = JSON.parse(member.familyMembers);
                        }
                    } catch (error) {
                        console.error("Error parsing familyMembers for member:", member.id, error, "Raw value:", member.familyMembers);
                        // familyMembers remains an empty array in case of error
                    }
                    return {
                        ...member,
                        familyMembers: familyMembers,
                    };
                });

                setMembers(formattedMembers);

                const eventsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`);
                if (!eventsResponse.ok) {
                    throw new Error(`HTTP error! status: ${eventsResponse.status}`);
                }
                const eventsData = await eventsResponse.json();
                const formattedEvents = eventsData.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMembers([]);
                setEvents([]);
            }
        };
        fetchData();

    }, [navigate, isLoggedIn]);

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsSuccess(true);
                setNewEvent({ title: '', start: '', end: '', location: '', description: '' });

                // Refetch events
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`)
                    .then(response => response.json())
                    .then(data => {
                        const formattedEvents = data.map(event => ({
                            ...event,
                            start: new Date(event.start),
                            end: new Date(event.end),
                        }));
                        setEvents(formattedEvents);
                    })
                    .catch(error => console.error('Error fetching events:', error));

            } else {
                setMessage(data.message || 'Error adding event.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error adding event:', error);
            setMessage('An error occurred. Please try again.');
            setIsSuccess(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events/${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refetch events after successful deletion
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`)
                    .then(response => response.json())
                    .then(data => {
                        const formattedEvents = data.map(event => ({
                            ...event,
                            start: new Date(event.start),
                            end: new Date(event.end),
                        }));
                        setEvents(formattedEvents);
                    })
                    .catch(error => console.error('Error fetching events:', error));
                setMessage('Event deleted successfully.');
                setIsSuccess(true);

            } else {
                const data = await response.json();
                setMessage(data.message || 'Error deleting event.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            setMessage('An error occurred while deleting the event.');
            setIsSuccess(false);
        }
    };

    // --- Helper Functions for Statistics ---

    const calculateGenderDistribution = (members) => {
        if (!members || members.length === 0) {
          return { Male: 0, Female: 0, Other: 0 };
        }
        const distribution = { Male: 0, Female: 0, Other: 0 };
        members.forEach(member => {
          if (member && member.gender && distribution.hasOwnProperty(member.gender)) {
            distribution[member.gender]++;
          }
        });
        return distribution;
      };

      const calculateLocationDistribution = (members) => {
        if (!members || members.length === 0) {
          return {};
        }
        const distribution = {};
        members.forEach(member => {
          if (member && member.location) {
            distribution[member.location] = (distribution[member.location] || 0) + 1;
          }
        });
        return distribution;
      };

      const calculateWorkStatusDistribution = (members) => {
        if (!members || members.length === 0) {
          return {};
        }
        const distribution = {};
        members.forEach(member => {
          if (member && member.workStatus) {
            distribution[member.workStatus] = (distribution[member.workStatus] || 0) + 1;
          }
        });
        return distribution;
      };

      const calculateAverageAge = (members) => {
        if (!members || members.length === 0) {
          return 0;
        }
        let totalAge = 0;
          let validMemberCount = 0;
          members.forEach(member => {
              if (member && typeof member.age === 'number') {
                  totalAge += member.age;
                  validMemberCount++;
              }
          });

          if (validMemberCount === 0) {
              return 0;
          }

          return (totalAge / validMemberCount).toFixed(1);
      };

      const calculateFamilyStatusDistribution = (members) => {
          if (!members || members.length === 0) {
              return { Family: 0, Individual: 0 };
          }
        const distribution = { Family: 0, Individual: 0 };
        members.forEach(member => {
            if (member && typeof member.isFamily === 'number') {
                if (member.isFamily === 1) {
                    distribution.Family++;
                } else {
                    distribution.Individual++;
                }
            }
        });
        return distribution;
      };

      const calculateTunisianCityDistribution = (members) => {
          if (!members || members.length === 0) {
              return {};
          }
        const distribution = {};
        members.forEach(member => {
          if(member && member.tunisianCity){
              distribution[member.tunisianCity] = (distribution[member.tunisianCity] || 0) + 1;
          }
        });
        return distribution;
      };

    const genderDistribution = calculateGenderDistribution(members);
    const locationDistribution = calculateLocationDistribution(members);
    const workStatusDistribution = calculateWorkStatusDistribution(members);
    const averageAge = calculateAverageAge(members);
    const familyStatusDistribution = calculateFamilyStatusDistribution(members);
    const tunisianCityDistribution = calculateTunisianCityDistribution(members);

    return (
        <div className="container">
            <section className="dashboard py-3">
                <h1 className="mb-2 text-center">Admin Dashboard</h1>

                {/* Dashboard Navigation */}
                <nav className="dashboard-nav">
                    <ul>
                        <li
                            className={activeSection === 'statistics' ? 'active' : ''}
                            onClick={() => setActiveSection('statistics')}
                        >
                            Statistics
                        </li>
                        <li
                            className={activeSection === 'members' ? 'active' : ''}
                            onClick={() => setActiveSection('members')}
                        >
                            Members Table
                        </li>
                        <li
                            className={activeSection === 'events' ? 'active' : ''}
                            onClick={() => setActiveSection('events')}
                        >
                            Events Management
                        </li>
                    </ul>
                </nav>

                {/* Main Content Area (Two Columns) */}
                <div className="dashboard-layout">
                    <div className="dashboard-sidebar">
                        {/* Sidebar content (if needed) */}
                    </div>

                    <main className="dashboard-main">
                        {/* Conditionally Render Sections */}
                        {activeSection === 'statistics' && (
                            <section className="member-stats">
                                 <div className="card">
                                    <h2>Member Statistics</h2>
                                    <p>Total Members: {members.length}</p>
                                    <p>Average Age: {averageAge}</p>
                                </div>

                                <div className="card">
                                    <h3>Gender Distribution</h3>
                                    <ul>
                                        {Object.entries(genderDistribution).map(([gender, count]) => (
                                            <li key={gender}>{gender}: {count}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card">
                                    <h3>Location Distribution</h3>
                                    <ul>
                                        {Object.entries(locationDistribution).map(([location, count]) => (
                                            <li key={location}>{location}: {count}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card">
                                    <h3>Work Status Distribution</h3>
                                    <ul>
                                        {Object.entries(workStatusDistribution).map(([workStatus, count]) => (
                                            <li key={workStatus}>{workStatus}: {count}</li>
                                        ))}
                                    </ul>
                                </div>

                                 <div className="card">
                                    <h3>Family Status Distribution</h3>
                                    <ul>
                                        {Object.entries(familyStatusDistribution).map(([status, count]) => (
                                            <li key={status}>{status}: {count}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card">
                                    <h3>Tunisian City Distribution</h3>
                                    <ul>
                                        {Object.entries(tunisianCityDistribution).map(([city, count]) => (
                                            <li key={city}>{city}: {count}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card">
                                    <h3>Members per Year</h3>
                                    {/* Placeholder for line graph */}
                                    <p>Line graph will go here...</p>
                                </div>
                            </section>
                        )}

                        {activeSection === 'members' && (
                            <section className="members-table">
                                <div className="card">
                                    <h2>Members Table</h2>
                                    <div className="table-responsive">
                                        <table className="dashboard-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Age</th>
                                                    <th>Location</th>
                                                    <th>Gender</th>
                                                    <th>Work Status</th>
                                                    <th>City in Tunisia</th>
                                                    <th>Family</th>
                                                    <th>Occupation</th>
                                                    <th>Settling Year</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.map(member => (
                                                    <tr key={member.id}>
                                                        <td>{member.id}</td>
                                                        <td>{member.name}</td>
                                                        <td>{member.email}</td>
                                                        <td>{member.age}</td>
                                                        <td>{member.location}</td>
                                                        <td>{member.gender}</td>
                                                        <td>{member.workStatus}</td>
                                                        <td>{member.tunisianCity}</td>
                                                        <td>{member.isFamily ? 'Yes' : 'No'}</td>
                                                        <td>{member.occupation}</td>
                                                        <td>{member.settlingYear}</td> {/* New Column */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === 'events' && (
                            <section className="events-management">
                                <div className="card">
                                    <h2 className="mb-2">Events Management</h2>
                                    {/* Add Event Form */}
                                    <section className="add-event">
                                        <h3 className="mb-2">Add Event</h3>
                                        <form onSubmit={handleAddEvent} className="add-event-form">
                                            {/* ... Form inputs (same as before) ... */}
                                            <div className="form-group">
                                                <label htmlFor="event-title">Title:</label>
                                                <input
                                                    type="text"
                                                    id="event-title"
                                                    name="title"
                                                    value={newEvent.title}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="event-start">Start Date & Time:</label>
                                                <input
                                                    type="datetime-local"
                                                    id="event-start"
                                                    name="start"
                                                    value={newEvent.start}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="event-end">End Date & Time:</label>
                                                <input
                                                    type="datetime-local"
                                                    id="event-end"
                                                    name="end"
                                                    value={newEvent.end}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="event-location">Location:</label>
                                                <input
                                                    type="text"
                                                    id="event-location"
                                                    name="location"
                                                    value={newEvent.location}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="event-description">Description:</label>
                                                <textarea
                                                    id="event-description"
                                                    name="description"
                                                    value={newEvent.description}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                />
                                            </div>
                                            <button type="submit">Add Event</button>
                                        </form>
                                        {message && <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
                                    </section>

                                    {/* Display Events */}
                                    <section className="display-events">
                                        <h3 className="mb-2">Events List</h3>
                                        {events.length === 0 ? (
                                            <p>No events to display.</p>
                                        ) : (
                                            <ul className="events-list">
                                                {events.map((event) => (
                                                    <li key={event.id} className="event-item">
                                                        <h3>{event.title}</h3>
                                                        <p><strong>Start:</strong> {event.start.toLocaleString()}</p>
                                                        <p><strong>End:</strong> {event.end.toLocaleString()}</p>
                                                        <p><strong>Location:</strong> {event.location}</p>
                                                        <p><strong>Description:</strong> {event.description}</p>
                                                        <button onClick={() => handleDeleteEvent(event.id)} className="delete-button">Delete</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
