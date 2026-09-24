import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { getMe } from '../services/user.service'
import { create } from '../services/school.service'
import FormInput from '../components/shared/FormInput'
import FormStandard from '../components/shared/FormStandard'
import ModalStandard from '../components/shared/ModalStandard'

function HomePage() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isCreateSchoolModalOpen, setIsCreateSchoolModalOpen] = useState(false)
  const [schoolForm, setSchoolForm] = useState({
    name: '',
  })
  const [schoolFormError, setSchoolFormError] = useState(null)
  const [schoolFormErrors, setSchoolFormErrors] = useState({})
  const [schoolLoading, setSchoolLoading] = useState(false)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => setError(err.message))
  }, [])

  const handleCreateSchoolSubmit = async () => {
    const errors = {}

    if (!schoolForm.name.trim()) {
      errors.name = 'El nombre del colegio es obligatorio'
    }

    setSchoolFormErrors(errors)
    setSchoolFormError(null)

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      setSchoolLoading(true)

      const newSchool = await create({
        name: schoolForm.name.trim(),
      })

      setUser((currentUser) => ({
        ...currentUser,
        school: newSchool,
      }))

      setIsCreateSchoolModalOpen(false)
    } catch (err) {
      setSchoolFormError(err.message)
    } finally {
      setSchoolLoading(false)
    }
  }

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
            onClick={() => setIsCreateSchoolModalOpen(true)}
          >
            Crear colegio
          </Button>
        </>
      )}

      <ModalStandard
        isOpen={isCreateSchoolModalOpen}
        onClose={() => setIsCreateSchoolModalOpen(false)}
        title="Crear colegio"
      >
        <FormStandard
          onSubmit={handleCreateSchoolSubmit}
          onCancel={() => setIsCreateSchoolModalOpen(false)}
          error={schoolFormError}
          loading={schoolLoading}
        >
          <FormInput
            label="Nombre del colegio"
            name="name"
            value={schoolForm.name}
            onChange={(event) =>
              setSchoolForm({
                ...schoolForm,
                name: event.target.value,
              })
            }
            error={schoolFormErrors.name}
          />
        </FormStandard>
      </ModalStandard>
    </div>
  )
}

export default HomePage