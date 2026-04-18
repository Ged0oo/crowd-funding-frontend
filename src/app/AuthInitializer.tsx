import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useInitializeAuth } from '../features/auth/hooks/useInitializeAuth'

export const AuthInitializer = () => {
  useInitializeAuth();
  
  return <RouterProvider router={router} />
}
