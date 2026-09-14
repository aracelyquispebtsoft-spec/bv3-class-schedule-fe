import { useEffect, useState } from 'react'
import UserCard from '../components/UserCard'
import { getMe } from '../services/user.service'

function HomePage() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p className="error">Error: {error}</p>
  if (!user) return <p>Cargando...</p>

  return <UserCard user={user} />
}

export default HomePage
