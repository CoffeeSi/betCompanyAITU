import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router/AppRouter.jsx'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/features/auth/store/authStore.jsx';
import { BetSlipProvider } from '@/features/bets/store/betSlipStore.jsx';
import { BetSlip } from '@/features/bets/components/BetSlip/BetSlip.jsx';
import '@mantine/notifications/styles.css';

function App() {
  return (
      <BrowserRouter>
        <MantineProvider>
          <Notifications position="top-right" zIndex={2000} />
          <AuthProvider>
            <BetSlipProvider>
              <AppRouter />
              <BetSlip />
            </BetSlipProvider>
          </AuthProvider>
        </MantineProvider>
      </BrowserRouter>
  )
}

export default App
