import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { getMe } from '../services/user.service'

function SchoolRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>Cargando...</p>
  }

  if (!user?.school) {
    return <Navigate to="/profile" replace />
  }

  return children
}

export default SchoolRoute