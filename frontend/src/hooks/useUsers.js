import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { getAccessToken, expireSession } from '../lib/session'
import { getApiError } from '../lib/apiError'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const downloadRequest = useRef(null)
  const request = useRef(null)
  const fetchUsers = useCallback(async (value = '') => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.get('/users', {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 15000,
        headers: { Accept: 'application/json', Authorization: `Bearer ${getAccessToken()}` },
        authenticated: true,
        signal: controller.signal,
        params: value.trim() ? { search: value.trim() } : undefined,
      })
      if (controller.signal.aborted) return
      if (!Array.isArray(data.data)) throw new Error('Unable to load users. The server returned an unexpected response.')
      setUsers(data.data)
      setAppliedSearch(value.trim())
    } catch (error) {
      if (!controller.signal.aborted) {
        if (error.response?.status === 401) expireSession()
        setError(error.isAxiosError ? getApiError(error) : error.message)
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])
  useEffect(() => {
    // Schedule initial loading so StrictMode cleanup cancels the first mount.
    const timer = setTimeout(() => { void fetchUsers() }, 0)
    return () => { clearTimeout(timer); request.current?.abort(); downloadRequest.current?.abort() }
  }, [fetchUsers])
  async function downloadCsv(value = appliedSearch) {
    if (downloadRequest.current) return
    const controller = new AbortController()
    downloadRequest.current = controller
    setIsDownloading(true)
    let url
    let link
    try {
      const { data } = await axios.get('/users/export', {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 15000,
        headers: { Accept: 'text/csv', Authorization: `Bearer ${getAccessToken()}` },
        responseType: 'blob',
        signal: controller.signal,
        params: value.trim() ? { search: value.trim() } : undefined,
      })
      if (controller.signal.aborted) return
      url = window.URL.createObjectURL(data)
      link = document.createElement('a')
      link.href = url
      link.download = 'users.csv'
      document.body.appendChild(link)
      link.click()
      toast.success('CSV downloaded successfully')
    } catch (error) {
      if (!controller.signal.aborted) {
        toast.error('Failed to download CSV')
        if (error.response?.status === 401) expireSession()
      }
    } finally {
      link?.remove()
      // Let the browser begin consuming the Blob before releasing its URL.
      if (url) setTimeout(() => window.URL.revokeObjectURL(url), 0)
      downloadRequest.current = null
      if (!controller.signal.aborted) setIsDownloading(false)
    }
  }
  return { users, loading, error, search, setSearch, fetchUsers, appliedSearch, isDownloading, downloadCsv }
}
