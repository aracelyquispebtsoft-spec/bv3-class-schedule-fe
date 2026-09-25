import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router'
import { getMe } from '../services/user.service'

function HomePage() {
  const navigate = useNavigate()
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
      <h1 className="text-3xl font-bold text-slate-900">
        Bienvenido, {user.firstname}
      </h1>

      {user.school ? (
        <p className="font-medium text-slate-900">
          {user.school.name}
        </p>
      ) : (
        <>
          <p className="font-medium text-slate-900">
            Aún no tienes colegio
          </p>

          <Button
            variant="contained"
            onClick={() => navigate('/school/new')}
          >
            Crear colegio
          </Button>
        </>
      )}
    </div>
  )
}

export default HomePage