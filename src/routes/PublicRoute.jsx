import { Navigate } from 'react-router'
import { getToken } from '../utils/token'

/** Renders the page only without a token (login, register); otherwise redirects to /. */
function PublicRoute({ children }) {
  if (getToken()) return <Navigate to="/" replace />

  return children
}

export default PublicRoute
