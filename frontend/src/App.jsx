import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router/AppRouter.jsx'
import { MantineProvider } from '@mantine/core';
import { UserProvider } from '@/entities/user';

function App() {

  return (
      <BrowserRouter>
        <MantineProvider>
          <UserProvider>
            <AppRouter />
          </UserProvider>
        </MantineProvider>
      </BrowserRouter>
  )
}

export default App
