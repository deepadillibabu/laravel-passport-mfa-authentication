import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import Feedback from '../Feedback'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import useMfa from '../../hooks/useMfa'

export default function MfaForm({ isSetup }) {
  const { setup, loading: setupLoading, error: setupError, startSetup, code, setCode, verifying: loading, verifyError: error, submit } = useMfa({ isSetup })
  if (isSetup) return <>
    <Feedback error={setupError} />
    {!setup ? <><div className="info-panel"><h2>Two steps to get set up</h2><p>Scan a QR code with your authenticator app, then enter its 6-digit code to confirm.</p></div><Button className="button full-width" disabled={setupLoading} onClick={startSetup}>{setupLoading ? 'Preparing setup…' : 'Retry QR code setup →'}</Button></> : <>
      <Feedback success="After scanning, your authenticator app will display a 6-digit code." />
      <div className="qr-panel"><QRCodeSVG value={setup.qr_code_url} size={192} marginSize={4} title="Scan with your authenticator app" /></div>
      <p className="field-help">Unable to scan? Enter this setup secret manually:</p>
      <code className="secret">{setup.secret}</code>
      <p className="field-help">Keep this secret private. Anyone with it can generate your codes.</p>
      <Button asChild className="button full-width"><Link to="/mfa/verify">I’ve scanned the QR code →</Link></Button>
    </>}
  </>
  return <><Feedback error={error} />
      <form onSubmit={submit} aria-busy={loading}>
        <Label htmlFor="code">Authenticator code</Label>
        <Input id="code" className="code-input" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} placeholder="000000" onChange={(event) => setCode(event.target.value.replace(/\s/g, ''))} aria-describedby="code-help" disabled={loading} />
        <p className="field-help" id="code-help">Enter the 6-digit code shown in your authenticator app.</p>
        <Button className="button" disabled={loading}>{loading ? 'Verifying…' : 'Verify code →'}</Button>
      </form>
  </>
}
