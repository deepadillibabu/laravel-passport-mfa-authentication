import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAccessToken, isMfaVerified } from '../lib/session'

export default function ProtectedRoute() {
  const { pathname } = useLocation()
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    const expire = () => setExpired(true)
    window.addEventListener('auth:expired', expire)
    return () => window.removeEventListener('auth:expired', expire)
  }, [])
  if (!expired && getAccessToken() && pathname === '/home' && !isMfaVerified()) {
    return <Navigate to="/mfa/setup" replace />
  }
  return !expired && getAccessToken() ? <Outlet /> : <Navigate to="/login" replace state={{ message: expired ? 'Your session has expired. Please sign in again.' : 'Please sign in to continue.' }} />
}
