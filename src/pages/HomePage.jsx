import { useEffect, useState } from 'react'
import SchoolCard from '../components/SchoolCard'
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

  if (error) return <p className="text-red-700">Error: {error}</p>
  if (!user) return <p>Cargando...</p>

  return (
    <div className="flex flex-col gap-4">
      <UserCard user={user} />
      <SchoolCard school={user.school} />
    </div>
  )
}

export default HomePage
