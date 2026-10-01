import { Alert, AlertDescription } from './ui/alert'

export default function Feedback({ error, success }) {
  return <>
    {error && <Alert variant="destructive" className="notice error"><AlertDescription>{error}</AlertDescription></Alert>}
    {success && <Alert className="notice success" role="status"><AlertDescription>{success}</AlertDescription></Alert>}
  </>
}
