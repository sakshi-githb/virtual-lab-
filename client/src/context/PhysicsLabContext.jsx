import React, { createContext, useContext, useState, useEffect } from 'react';

const PhysicsLabContext = createContext(null);

const DEFAULT_EXPERIMENTS = [
  { id: '1', title: 'Convex Lens Image Formation', slug: 'convex-lens-image-formation', standard: 10, topic: 'Optics', difficulty: 'Medium' },
  { id: '2', title: 'Concave Lens Ray Optics', slug: 'concave-lens-image-formation', standard: 10, topic: 'Optics', difficulty: 'Medium' },
  { id: '3', title: 'Verification of Ohm\'s Law', slug: 'ohms-law-verification', standard: 10, topic: 'Electricity', difficulty: 'Easy' },
  { id: '4', title: 'Resistors in Series & Parallel', slug: 'resistors-series-parallel', standard: 10, topic: 'Electricity', difficulty: 'Hard' },
  { id: '5', title: 'Newton\'s 2nd Law of Motion (F = ma)', slug: 'newtons-laws-of-motion', standard: 9, topic: 'Mechanics', difficulty: 'Medium' },
  { id: '6', title: 'Work-Energy Theorem & Conservation', slug: 'work-energy-theorem', standard: 9, topic: 'Work & Energy', difficulty: 'Medium' },
  { id: '7', title: 'Simple Electric Circuit & Components', slug: 'simple-electric-circuit', standard: 9, topic: 'Electricity', difficulty: 'Easy' },
  { id: '8', title: 'Sound Waves & Oscilloscope (v = fλ)', slug: 'sound-waves-oscilloscope', standard: 9, topic: 'Sound', difficulty: 'Medium' },
  { id: '9', title: 'Refraction Through Glass Slab & Snell\'s Law', slug: 'refraction-glass-slab', standard: 10, topic: 'Optics', difficulty: 'Medium' },
  { id: '10', title: 'Faraday\'s Law of Induction', slug: 'electromagnetic-induction', standard: 10, topic: 'Electricity & Magnetism', difficulty: 'Hard' },
  { id: '11', title: 'Oersted\'s Magnetic Effect & Thumb Rule', slug: 'magnetic-effect-current', standard: 10, topic: 'Electricity & Magnetism', difficulty: 'Medium' },
  { id: '12', title: 'Fleming\'s Left-Hand Rule & Conductor Force', slug: 'force-conductor-magnetic-field', standard: 10, topic: 'Electricity & Magnetism', difficulty: 'Hard' },
  { id: '13', title: 'Specific Heat Capacity of Substances', slug: 'heat-transfer-conduction', standard: 9, topic: 'Heat', difficulty: 'Medium' },
  { id: '14', title: 'Laws of Reflection of Light', slug: 'reflection-light-mirror', standard: 9, topic: 'Optics', difficulty: 'Easy' }
];

export const PhysicsLabProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [standards, setStandards] = useState([]);
  const [topics, setTopics] = useState([]);
  const [experiments, setExperiments] = useState(DEFAULT_EXPERIMENTS);

  useEffect(() => {
    const token = localStorage.getItem('physicslab_token');
    if (token) {
      setCurrentUser({ name: 'Student', role: 'student' });
    }

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fetch experiments from API if server backend is reachable
    fetch(`${API_URL}/api/physicslab/experiments`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(exp => ({
            id: exp._id || exp.id,
            title: exp.title,
            slug: exp.slug,
            standard: exp.standardId?.standardNumber || exp.standard || 10,
            topic: exp.topicId?.name || exp.topic || 'Optics',
            difficulty: exp.difficulty || 'Medium'
          }));
          setExperiments(formatted);
        }
      })
      .catch(err => {
        console.warn('API fetch failed, using comprehensive default experiment list:', err.message);
      });

    fetch(`${API_URL}/api/physicslab/standards`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (Array.isArray(data)) setStandards(data); })
      .catch(() => {});

    fetch(`${API_URL}/api/physicslab/topics`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (Array.isArray(data)) setTopics(data); })
      .catch(() => {});
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('physicslab_token', token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('physicslab_token');
    setCurrentUser(null);
  };

  return (
    <PhysicsLabContext.Provider value={{ currentUser, experiments, standards, topics, login, logout }}>
      {children}
    </PhysicsLabContext.Provider>
  );
};

export const usePhysicsLab = () => useContext(PhysicsLabContext);
