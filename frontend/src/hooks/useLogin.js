import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getApiError } from '../lib/apiError'
import { clearSession, saveAccessToken } from '../lib/session'

export default function useLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setError(''); setLoading(true)
    try { clearSession()
      const { data } = await axios.post('/login', values, {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 15000,
        headers: { Accept: 'application/json' },
      })
      if (typeof data.access_token !== 'string' || !data.access_token.trim()) {
        throw new Error('Sign-in did not return an access token. The authentication flow could not be completed.')
      }
      saveAccessToken(data.access_token)
      navigate('/mfa/setup', { replace: true }) }
    catch (error) { setError(error.isAxiosError ? getApiError(error) : error.message) }
    finally { setLoading(false) }
  }
  return { loading, error, submit }
}
