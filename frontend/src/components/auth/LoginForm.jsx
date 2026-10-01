import Feedback from '../Feedback'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import useLogin from '../../hooks/useLogin'
import { useLocation } from 'react-router-dom'

export default function LoginForm() {
  const { loading, error, submit } = useLogin()
  const { state } = useLocation()
  return <>
    <Feedback error={error} success={state?.success} />
    {state?.message && <p className="notice" role="status">{state.message}</p>}
    <form onSubmit={submit} aria-busy={loading}>
      <fieldset disabled={loading}>
        <Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
        <Button className="button">{loading ? 'Signing in…' : 'Sign in →'}</Button>
      </fieldset>
    </form>
  </>
}
