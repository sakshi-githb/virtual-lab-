import React, { createContext, useContext, useState, useEffect } from 'react';

const PhysicsLabContext = createContext(null);

export const PhysicsLabProvider = ({ children }) => {
  const [standards, setStandards] = useState([]);
  const [topics, setTopics] = useState([]);
  const [experiments, setExperiments] = useState([
    { id: 1, title: 'Convex Lens Image Formation', slug: 'convex-lens-image-formation', standard: 10, topic: 'Optics', difficulty: 'Medium' },
    { id: 2, title: 'Ohm\'s Law', slug: 'ohms-law', standard: 10, topic: 'Electricity', difficulty: 'Easy' },
    { id: 3, title: 'Laws of Reflection', slug: 'laws-of-reflection', standard: 9, topic: 'Optics', difficulty: 'Easy' },
    { id: 4, title: 'Simple Electric Circuit', slug: 'simple-electric-circuit', standard: 9, topic: 'Electricity', difficulty: 'Easy' },
    { id: 5, title: 'Magnetic Effect of Electric Current', slug: 'magnetic-effect-electric-current', standard: 10, topic: 'Electricity and Magnetism', difficulty: 'Medium' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('physicslab_token');
    if (token) {
      setCurrentUser({ name: 'Student', role: 'student' });
    }

    const API_URL = import.meta.env.VITE_API_URL || '';

    // Fetch experiments from API
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
        console.warn('API fetch failed, using default experiment list:', err.message);
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
