import Feedback from '../Feedback'
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'

export default function UsersTable({ users, loading, error }) {
  if (loading) return <p role="status">Loading users...</p>
  if (error) return <Feedback error={error} />
  return (
            <div className="workspace-table-scroll">
              <Table className="workspace-table">
                <TableCaption className="visually-hidden">Users</TableCaption>
                <TableHeader><TableRow><TableHead scope="col">ID</TableHead><TableHead scope="col">Name</TableHead><TableHead scope="col">Email</TableHead><TableHead scope="col">Created At</TableHead></TableRow></TableHeader>
                <TableBody>{users.length ? users.map((record) => (
                  <TableRow key={record.id}><TableCell>{record.id}</TableCell><TableCell>{record.name}</TableCell><TableCell>{record.email}</TableCell><TableCell>{formatCreatedAt(record.created_at)}</TableCell></TableRow>
                )) : <TableRow><TableCell colSpan="4" className="workspace-empty">No users found.</TableCell></TableRow>}</TableBody>
              </Table>
            </div>
  )
}

function formatCreatedAt(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const day = date.toLocaleDateString('en-GB')
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${day} ${time}`
}

