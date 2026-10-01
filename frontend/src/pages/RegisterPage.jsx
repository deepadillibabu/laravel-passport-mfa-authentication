import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  return <AuthLayout title="Create your account" description="A fresh start for your personal workspace." footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
    <RegisterForm />
  </AuthLayout>
}
