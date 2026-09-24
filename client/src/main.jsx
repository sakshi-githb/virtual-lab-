import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { PhysicsLabProvider } from './context/PhysicsLabContext.jsx'

import PhysicsLabLayout from './pages/physicslab/PhysicsLabLayout.jsx'
import PhysicsLabHome from './pages/physicslab/PhysicsLabHome.jsx'
import PhysicsLabAuth from './pages/physicslab/PhysicsLabAuth.jsx'
import StandardPage from './pages/physicslab/StandardPage.jsx'
import TopicPage from './pages/physicslab/TopicPage.jsx'
import ExperimentPage from './pages/physicslab/ExperimentPage.jsx'
import StudentDashboard from './pages/physicslab/StudentDashboard.jsx'
import TeacherDashboard from './pages/physicslab/TeacherDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <PhysicsLabProvider>
        <BrowserRouter>
          <Routes>
            {/* Existing App Route */}
            <Route path="/*" element={<App />} />
            
            {/* New Physics Lab Routes */}
            <Route path="/physicslab" element={<PhysicsLabLayout />}>
              <Route index element={<PhysicsLabHome />} />
              <Route path="login" element={<PhysicsLabAuth />} />
              <Route path="standard/:standardNumber" element={<StandardPage />} />
              <Route path="topic/:topicSlug" element={<TopicPage />} />
              <Route path="experiment/:slug" element={<ExperimentPage />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="teacher" element={<TeacherDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PhysicsLabProvider>
    </SocketProvider>
  </StrictMode>,
)
