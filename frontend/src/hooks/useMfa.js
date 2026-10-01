import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getApiError } from '../lib/apiError'
import { getAccessToken, markMfaVerified, expireSession } from '../lib/session'

// Reuse QR setup across StrictMode and route remounts; never persist the secret.
let setupRequest = null
let setupToken = null
window.addEventListener('auth:cleared', () => { setupRequest = null; setupToken = null })

function setupMfa() {
  const token = getAccessToken()
  if (setupToken !== token) { setupRequest = null; setupToken = token }
  if (!setupRequest) {
    setupRequest = axios.post('/mfa/setup', {}, {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      authenticated: true,
    }).then((response) => {
      const { secret, qr_code_url } = response.data
      if (typeof secret !== 'string' || !secret || typeof qr_code_url !== 'string' || !qr_code_url.startsWith('otpauth://')) {
        throw new Error('The server returned incomplete setup details. Please try again.')
      }
      return response
    }).catch((error) => {
      if (error.response?.status === 401) expireSession()
      if (setupToken === token) setupRequest = null
      throw error
    })
  }
  return setupRequest
}

export default function useMfa({ isSetup = false } = {}) {
  const [setup, setSetup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    if (!isSetup) return
    setupMfa().then(({ data }) => { if (active) setSetup(data) })
      .catch((error) => { if (active) setError(error.isAxiosError ? getApiError(error) : error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isSetup])
  async function startSetup() {
    setLoading(true); setError('')
    try {
      const { data } = await setupMfa()
      if (typeof data.secret !== 'string' || !data.secret || typeof data.qr_code_url !== 'string' || !data.qr_code_url.startsWith('otpauth://')) {
        setError('The server returned incomplete setup details. Please try again.'); return
      }
      setSetup(data)
    } catch (error) { setError(error.isAxiosError ? getApiError(error) : error.message) }
    finally { setLoading(false) }
  }
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  async function submit(event) {
    event.preventDefault()
    setVerifyError('')
    if (!/^\d{6}$/.test(code)) { setVerifyError('Enter the 6-digit code from your authenticator app.'); return }
    setVerifying(true)
    try { const token = getAccessToken()
      await axios.post('/mfa/verify', { code }, {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      authenticated: true,
    })
      if (!token || token !== getAccessToken()) return
      markMfaVerified()
      setupRequest = null; setCode(''); navigate('/home', { replace: true, state: { success: 'Authenticator verified successfully.' } }) }
    catch (error) {
      if (error.response?.status === 401) expireSession()
      setVerifyError(getApiError(error))
    }
    finally { setVerifying(false) }
  }
  return { setup, loading, error, startSetup, code, setCode, verifying, verifyError, submit }
}
