import Feedback from '../Feedback'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import useRegister from '../../hooks/useRegister'

export default function RegisterForm() {
  const { loading, error, submit } = useRegister()
  return <>
    <Feedback error={error} />
    <form onSubmit={submit} aria-busy={loading}>
      <fieldset disabled={loading}>
        <Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" placeholder="Your full name" required />
        <Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" required />
        <Label htmlFor="password_confirmation">Confirm password</Label><Input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" placeholder="Enter your password again" required />
        <Button className="button">{loading ? 'Creating account…' : 'Create account →'}</Button>
      </fieldset>
    </form>
  </>
}
