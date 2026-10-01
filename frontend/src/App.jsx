import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import MfaPage from './pages/MfaPage'
import HomePage from './pages/HomePage'

export default function App() {
  return <Routes>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<HomePage />} />
      <Route path="/mfa/setup" element={<MfaPage isSetup />} />
      <Route path="/mfa/verify" element={<MfaPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
}
