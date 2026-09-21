import { Paper } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import FormInput from '../components/shared/FormInput'
import FormStandard from '../components/shared/FormStandard'
import * as authService from '../services/auth.service'
import { setToken } from '../utils/token'

function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio'
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleSubmit = async () => {
    setError(null)

    if (!validate()) return

    setLoading(true)

    try {
      const data = await authService.login(
        form.email.trim(),
        form.password,
      )

      setToken(data.token)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          borderRadius: 3,
        }}
      >
        <p className="mb-6 font-bold text-slate-900">
          Horario de clases
        </p>

        <FormStandard
          title="Iniciar sesión"
          onSubmit={handleSubmit}
          submitText="Ingresar"
          loadingText="Ingresando..."
          loading={loading}
          error={error}
        >
          <div className="sm:col-span-2">
            <FormInput
              label="Correo"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <div className="sm:col-span-2">
            <FormInput
              label="Contraseña"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>
        </FormStandard>

        <p className="mt-5 text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-slate-900 underline"
          >
            Crear cuenta
          </Link>
        </p>
      </Paper>
    </main>
  )
}

export default LoginPage