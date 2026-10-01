import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSession } from '../lib/session'
import useCurrentUser from '../hooks/useCurrentUser'
import useUsers from '../hooks/useUsers'
import UserSearch from '../components/users/UserSearch'
import UsersTable from '../components/users/UsersTable'
import Icon from '../components/Icon'
import { Card } from '../components/ui/card'
import './Home.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, error } = useCurrentUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const { users, loading, error: usersError, search, setSearch, fetchUsers, appliedSearch, isDownloading, downloadCsv } = useUsers()
  function logout() {
    clearSession()
    navigate('/login', { replace: true })
  }
  const initials = user?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
  return <div className="workspace">
    <aside className={`workspace-sidebar ${menuOpen ? 'is-open' : ''}`} id="workspace-navigation">
      <Link className="workspace-logo" to="/home"><span className="workspace-logo-mark">a</span>account<span className="purple-text">.</span></Link>
      <nav aria-label="Main navigation">
        <button className="active" onClick={() => setMenuOpen(false)} aria-current="page"><Icon kind="grid" /> Users</button>
      </nav>
      <div className="sidebar-bottom"><div className="workspace-person"><span className="workspace-avatar">{initials}</span><div><strong>{user?.name || 'Your account'}</strong><small>Personal workspace</small></div></div><button className="workspace-signout" onClick={logout}><Icon kind="logout" /> Log out</button><p>YOUR PERSONAL WORKSPACE</p></div>
    </aside>
    <div className="workspace-main">
      <header className="workspace-header">
        <div className="workspace-breadcrumb"><button className="workspace-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="workspace-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon kind="grid" /></button><span>Home</span><span aria-hidden="true">›</span><strong>Users</strong></div>
        <div className="workspace-person header-person"><span className="workspace-avatar">{initials}</span><div><strong>{user?.name || 'Your account'}</strong><small title={error || undefined}>{user?.email || (error ? 'Profile unavailable' : 'Loading profile…')}</small></div></div>
      </header>
      <main className="workspace-content">
        <Card className="workspace-card workspace-users" aria-labelledby="users-title" aria-busy={loading}>
          <div className="workspace-card-title"><h1 id="users-title">Users</h1></div>
          <UserSearch search={search} onSearchChange={setSearch} onSearch={() => fetchUsers(search)} onDownload={() => downloadCsv(appliedSearch)} isDownloading={isDownloading} />
          <UsersTable users={users} loading={loading} error={usersError} />
        </Card>
      </main>
    </div>
  </div>
}
