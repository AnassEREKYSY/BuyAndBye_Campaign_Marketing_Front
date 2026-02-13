import { AppProviders } from './providers/AppProviders'
import { UserProvider } from './providers/UserProviders'
import { AppRouter } from './router'

function App() {
  return (
    <AppProviders>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </AppProviders>
  )
}

export default App
