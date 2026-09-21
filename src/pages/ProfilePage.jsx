import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { getMe, updateMe } from '../services/user.service'
import { update } from '../services/school.service'
import FormInput from '../components/shared/FormInput'
import FormStandard from '../components/shared/FormStandard'
import ModalStandard from '../components/shared/ModalStandard'

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false)

  const [schoolForm, setSchoolForm] = useState({
    name: '',
  })
  const [schoolFormError, setSchoolFormError] = useState(null)
  const [schoolFormErrors, setSchoolFormErrors] = useState({})
  const [schoolLoading, setSchoolLoading] = useState(false)

  const [userForm, setUserForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => setError(err.message))
  }, [])

  const openUserModal = () => {
    setUserForm({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
    })
    setFormErrors({})
    setFormError(null)
    setIsUserModalOpen(true)
  }

  const openSchoolModal = () => {
    setSchoolForm({
      name: user.school?.name || '',
    })
    setSchoolFormErrors({})
    setSchoolFormError(null)
    setIsSchoolModalOpen(true)
  }

  const handleUserSubmit = async () => {
    const errors = {}

    if (!userForm.firstname.trim()) {
      errors.firstname = 'El nombre es obligatorio'
    }

    if (!userForm.lastname.trim()) {
      errors.lastname = 'El apellido es obligatorio'
    }

    if (!userForm.email.trim()) {
      errors.email = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = 'Ingresa un correo válido'
    }

    setFormErrors(errors)
    setFormError(null)

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      setLoading(true)

      const updatedUser = await updateMe({
        firstname: userForm.firstname.trim(),
        lastname: userForm.lastname.trim(),
        email: userForm.email.trim(),
      })

      setUser((currentUser) => ({
        ...currentUser,
        ...(updatedUser || userForm),
      }))

      setIsUserModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSchoolSubmit = async () => {
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

      const updatedSchool = await update(user.school.id, {
        name: schoolForm.name.trim(),
      })

      setUser((currentUser) => ({
        ...currentUser,
        school: {
          ...currentUser.school,
          ...(updatedSchool || schoolForm),
        },
      }))

      setIsSchoolModalOpen(false)
    } catch (err) {
      setSchoolFormError(err.message)
    } finally {
      setSchoolLoading(false)
    }
  }

  if (error) {
    return <p className="text-red-700">Error: {error}</p>
  }

  if (!user) {
    return <p>Cargando...</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-slate-900">Mi perfil</h1>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Mis datos</h2>

          <Button variant="contained" onClick={openUserModal}>
            Editar
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Nombre</p>
            <p className="font-medium text-slate-900">{user.firstname}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Apellido</p>
            <p className="font-medium text-slate-900">{user.lastname}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Correo</p>
            <p className="font-medium text-slate-900">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Mi colegio</h2>

          <Button variant="contained" onClick={openSchoolModal}>
            Editar
          </Button>
        </div>

        <div>
          <p className="text-sm text-slate-500">Nombre del colegio</p>
          <p className="font-medium text-slate-900">
            {user.school?.name || 'Sin colegio registrado'}
          </p>
        </div>
      </section>

      <ModalStandard
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Editar mis datos"
      >
        <FormStandard
          onSubmit={handleUserSubmit}
          onCancel={() => setIsUserModalOpen(false)}
          error={formError}
          loading={loading}
        >
          <FormInput
            label="Nombre"
            name="firstname"
            value={userForm.firstname}
            onChange={(event) =>
              setUserForm({
                ...userForm,
                firstname: event.target.value,
              })
            }
            error={formErrors.firstname}
          />

          <FormInput
            label="Apellido"
            name="lastname"
            value={userForm.lastname}
            onChange={(event) =>
              setUserForm({
                ...userForm,
                lastname: event.target.value,
              })
            }
            error={formErrors.lastname}
          />

          <FormInput
            label="Correo"
            name="email"
            type="email"
            value={userForm.email}
            onChange={(event) =>
              setUserForm({
                ...userForm,
                email: event.target.value,
              })
            }
            error={formErrors.email}
          />
        </FormStandard>
      </ModalStandard>

      <ModalStandard
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        title="Editar mi colegio"
      >
        <FormStandard
          onSubmit={handleSchoolSubmit}
          onCancel={() => setIsSchoolModalOpen(false)}
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

export default ProfilePage