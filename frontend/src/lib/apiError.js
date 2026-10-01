export function getApiError(error) {
  const status = error.response?.status
  const errors = error.response?.data?.errors
  const fieldErrors = errors && typeof errors === 'object'
    ? Object.values(errors).flat().filter((value) => typeof value === 'string') : []
  if (fieldErrors.length) return fieldErrors.join(' ')
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.'
  if (status === 401) return error.config?.authenticated
    ? 'Your session has expired. Please sign in again.' : 'The email or password is incorrect.'
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.'
  if (status >= 500) return 'The server could not complete your request. Please try again later.'
  const message = error.response?.data?.message
  return typeof message === 'string' ? message : 'Unable to complete your request. Please try again.'
}

