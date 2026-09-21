import { useEffect, useState } from 'react'
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
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Bienvenido, {user.firstname}
      </h1>
    </div>
  )
}

export default HomePage