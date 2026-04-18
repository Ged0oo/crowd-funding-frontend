import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../app/store'

export default function ProtectedRoute() {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate to="/authenticate" replace state={{ returnTo: location.pathname }} />
  }

  return <Outlet />
}
