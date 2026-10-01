const TOKEN_KEY = 'access_token'
const MFA_KEY = 'mfa_verified'
export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY)
export const isMfaVerified = () => Boolean(getAccessToken()) && sessionStorage.getItem(MFA_KEY) === 'true'
export const saveAccessToken = (token) => sessionStorage.setItem(TOKEN_KEY, token)
export const markMfaVerified = () => sessionStorage.setItem(MFA_KEY, 'true')
export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(MFA_KEY)
  window.dispatchEvent(new Event('auth:cleared'))
}

export function expireSession() {
  clearSession()
  window.dispatchEvent(new Event('auth:expired'))
}
