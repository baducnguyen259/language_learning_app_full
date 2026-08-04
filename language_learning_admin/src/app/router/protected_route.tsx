import { Navigate, Outlet, useLocation } from 'react-router'

export function ProtectedRoute() {
  const location = useLocation()
  const accessToken = localStorage.getItem('access_token')
  const bypassAuth = import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true'

  if (!bypassAuth && !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
