import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import Layout from './components/Layout'

import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CreateSchoolPage from './pages/CreateSchoolPage'
import TeacherPage from './pages/TeacherPage'
import ClassroomPage from './pages/ClassroomPage'
import CoursePage from './pages/CoursePage'
import SubjectPage from './pages/SubjectPage'
import SchedulePage from './pages/SchedulePage'
import ProgressPage from './pages/ProgressPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/school/new" element={<CreateSchoolPage />} />
          <Route path="/teachers" element={<TeacherPage />} />
          <Route path="/classrooms" element={<ClassroomPage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/subjects" element={<SubjectPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
