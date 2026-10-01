import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  return <AuthLayout title="Welcome" showEyebrow={false} footer={<>New here? <Link to="/register">Create an account</Link></>}>
    <LoginForm />
  </AuthLayout>
}
