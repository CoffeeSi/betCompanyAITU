import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes.jsx'
import { MantineProvider } from '@mantine/core';

function App() {

  return (
      <BrowserRouter>
        <MantineProvider>
          <AppRoutes />
        </MantineProvider>
      </BrowserRouter>
  )
}

export default App
