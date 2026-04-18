import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './app/queryClient'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthInitializer } from './app/AuthInitializer'

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
