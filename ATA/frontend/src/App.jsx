// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Census from './components/Census';
import Team from './components/Team';
import Events from './components/Events';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Membership from './components/Membership';
import WelcomeModal from './components/WelcomeModal'; // Import the modal
import CarouselTest from './components/CarouselTest';

function App() {
  return (
    <Router>
      <Header />
      <WelcomeModal /> {/* Add the modal here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/census" element={<Census />} />
        <Route path="/team" element={<Team />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
    </Router>
  );
}

export default App;
