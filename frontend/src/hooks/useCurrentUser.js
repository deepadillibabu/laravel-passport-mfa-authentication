import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAccessToken, expireSession } from '../lib/session'
import { getApiError } from '../lib/apiError'

export default function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    axios.get('/user', {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      headers: { Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
      authenticated: true,
      signal: controller.signal,
    }).then(({ data }) => {
      if (!controller.signal.aborted) {
        const profile = data.user ?? data
        if (!profile || typeof profile.name !== 'string' || typeof profile.email !== 'string') {
          setError('The server returned incomplete profile information.'); return
        }
        setUser(profile)
      }
    }).catch((error) => { if (!controller.signal.aborted) {
      if (error.response?.status === 401) expireSession()
      setError(getApiError(error))
    } })
    return () => controller.abort()
  }, [])
  return { user, error }
}
