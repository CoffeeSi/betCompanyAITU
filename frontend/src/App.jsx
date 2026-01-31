import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router/AppRouter.jsx'
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from '@/features/auth/store/authStore.jsx';

function App() {
// https://ui.mantine.dev/
// https://cdnlogo.com/
  return (
      <BrowserRouter>
        <MantineProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </MantineProvider>
      </BrowserRouter>
  )
}

export default App
