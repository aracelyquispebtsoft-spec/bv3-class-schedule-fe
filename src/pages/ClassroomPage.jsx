import { useEffect, useState } from 'react'
import { Button, TableCell, TableRow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import TableData from '../components/shared/TableData'
import TableActions from '../components/shared/TableActions'
import ClassroomFormModal from '../components/shared/classroom/modals/ClassroomFormModal'
import ClassroomDetailModal from '../components/shared/classroom/modals/ClassroomDetailModal'
import ClassroomDeleteModal from '../components/shared/classroom/modals/ClassroomDeleteModal'
import * as classroomService from '../services/classroom.service'

const TYPE_LABELS = {
  COMMON: 'Común',
  LAB: 'Laboratorio',
  COMPUTER: 'Informática',
}

const TYPE_OPTIONS = [
  { value: 'COMMON', label: 'Común' },
  { value: 'LAB', label: 'Laboratorio' },
  { value: 'COMPUTER', label: 'Informática' },
]

const EMPTY_FORM = {
  name: '',
  capacity: '',
  type: '',
}

function ClassroomPage() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const loadClassrooms = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await classroomService.getAll()
      setClassrooms(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    classroomService
      .getAll()
      .then((data) => {
        if (active) {
          setClassrooms(data || [])
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const openCreate = () => {
    setSelectedClassroom(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setFormError('')
    setIsFormOpen(true)
  }

  const openEdit = (classroom) => {
    setSelectedClassroom(classroom)
    setForm({
      name: classroom.name || '',
      capacity: classroom.capacity ?? '',
      type: classroom.type || '',
    })
    setFormErrors({})
    setFormError('')
    setIsFormOpen(true)
  }

  const openDetail = (classroom) => {
    setSelectedClassroom(classroom)
    setIsDetailOpen(true)
  }

  const openDelete = (classroom) => {
    setSelectedClassroom(classroom)
    setFormError('')
    setIsDeleteOpen(true)
  }

  const closeModals = () => {
    if (saving || deleting) return

    setIsFormOpen(false)
    setIsDetailOpen(false)
    setIsDeleteOpen(false)
    setSelectedClassroom(null)
    setFormErrors({})
    setFormError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setFormErrors((current) => ({
      ...current,
      [name]: '',
    }))

    setFormError('')
  }

  const validateForm = () => {
    const errors = {}

    if (!form.name.trim()) {
      errors.name = 'El nombre es obligatorio'
    }

    if (form.capacity === '') {
      errors.capacity = 'La capacidad es obligatoria'
    } else if (Number(form.capacity) <= 0) {
      errors.capacity = 'La capacidad debe ser mayor a 0'
    }

    if (!form.type) {
      errors.type = 'El tipo es obligatorio'
    }

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      setFormError('')

      const classroomData = {
        name: form.name.trim(),
        capacity: Number(form.capacity),
        type: form.type,
      }

      if (selectedClassroom) {
        await classroomService.update(selectedClassroom.id, classroomData)
      } else {
        await classroomService.create(classroomData)
      }

      setIsFormOpen(false)
      setSelectedClassroom(null)
      setForm(EMPTY_FORM)
      setFormErrors({})

      await loadClassrooms()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedClassroom) return

    try {
      setDeleting(true)
      setFormError('')

      await classroomService.remove(selectedClassroom.id)

      setIsDeleteOpen(false)
      setSelectedClassroom(null)

      await loadClassrooms()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <TableData
        title="Aulas"
        columns={['Nombre', 'Capacidad', 'Tipo', 'Acciones']}
        loading={loading}
        emptyMessage="No hay aulas registradas"
        toolbar={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nueva aula
          </Button>
        }
      >
        {classrooms.map((classroom) => (
          <TableRow key={classroom.id}>
            <TableCell>{classroom.name}</TableCell>
            <TableCell>{classroom.capacity}</TableCell>
            <TableCell>
              {TYPE_LABELS[classroom.type] || classroom.type}
            </TableCell>
            <TableCell>
              <TableActions
                onEdit={() => openEdit(classroom)}
                onView={() => openDetail(classroom)}
                onDelete={() => openDelete(classroom)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableData>

      {error && <p className="text-red-700">Error: {error}</p>}

      <ClassroomFormModal
        isOpen={isFormOpen}
        isEditing={Boolean(selectedClassroom)}
        formData={form}
        onClose={closeModals}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errors={formErrors}
        serverError={formError}
        saving={saving}
        typeOptions={TYPE_OPTIONS}
      />

      <ClassroomDetailModal
        isOpen={isDetailOpen}
        classroom={selectedClassroom}
        onClose={closeModals}
        typeLabels={TYPE_LABELS}
      />

      <ClassroomDeleteModal
        isOpen={isDeleteOpen}
        classroom={selectedClassroom}
        onClose={closeModals}
        onConfirm={handleDelete}
        error={formError}
        loading={deleting}
      />
    </div>
  )
}

export default ClassroomPage