import { Card } from './ui/card'
import { Link } from 'react-router-dom'

export default function AuthLayout({ title, description, children, footer, showEyebrow = true }) {
  return <div className="auth-shell">
    <Link className="brand" to="/home"><span className="brand-mark" aria-hidden="true">a</span> Account</Link>
    <main className="auth-main"><Card className="auth-card">
      {showEyebrow && <div className="eyebrow">YOUR PERSONAL WORKSPACE</div>}
      <h1>{title}</h1>{description && <p className="intro">{description}</p>}
      {children}
      {footer && <div className="auth-footer">{footer}</div>}
    </Card></main>
    <p className="shell-caption">Your account. All in one place.</p>
  </div>
}
