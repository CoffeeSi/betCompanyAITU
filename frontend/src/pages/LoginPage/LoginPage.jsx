<<<<<<< HEAD
import Header from '@/components/layout/Header/Header';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
=======
import Header from '@/shared/ui/Header/Header';
import { LoginForm } from '@/shared/ui/LoginForm/LoginForm';
>>>>>>> fca5068 (feat: frontend login)

function LoginPage() {
  return (
    <>
      <Header />
      <LoginForm />
    </>
  )
}

export default LoginPage;