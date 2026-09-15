import { Navigate } from 'react-router'
import { getToken } from '../utils/token'

/** Renders the page only when there is a token; otherwise redirects to /login. */
function PrivateRoute({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />

  return children
}

export default PrivateRoute
