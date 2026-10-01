import Icon from '../Icon'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

export default function UserSearch({ search, onSearchChange, onSearch, onDownload, isDownloading }) {
  return <>
          <form className="workspace-toolbar workspace-users-toolbar" onSubmit={(event) => { event.preventDefault(); onSearch() }} role="search">
            <Label className="workspace-search"><Icon kind="search" /><span className="visually-hidden">Search users by name or email</span><Input type="search" placeholder="Search by name or email" value={search} onChange={(event) => onSearchChange(event.target.value)} /></Label>
            <Button type="button" className="workspace-action workspace-csv" disabled={isDownloading} onClick={onDownload}><Icon kind="download" /> {isDownloading ? 'Downloading...' : 'Download CSV'}</Button>
          </form>
  </>
}
