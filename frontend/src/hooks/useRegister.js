import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getApiError } from '../lib/apiError'

export default function useRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setError('')
    if (values.password !== values.password_confirmation) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await axios.post('/register', values, {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 15000,
        headers: { Accept: 'application/json' },
      })
      navigate('/login', { replace: true, state: { success: 'Account created successfully. Sign in to get started.' } })
    } catch (error) { setError(getApiError(error)) }
    finally { setLoading(false) }
  }
  return { loading, error, submit }
}
