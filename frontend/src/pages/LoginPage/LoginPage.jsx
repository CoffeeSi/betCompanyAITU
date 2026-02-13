import Header from '@/components/layout/Header/Header';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';

function LoginPage() {
  return (
    <>
      <Header />
      <LoginForm />
    </>
  )
}

export default LoginPage;