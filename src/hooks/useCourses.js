import { useState, useEffect } from 'react'
import { courseService } from '../services/course.service'
import { validateCourseForm } from '../utils/course.validations'

const INITIAL_FORM_STATE = { name: '', student_count: '' }

export function useCourses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [formData, setFormData] = useState(INITIAL_FORM_STATE)
    const [errors, setErrors] = useState({})

    const [viewOpen, setViewOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [saving, setSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [deleteError, setDeleteError] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const loadCourses = async () => { 
            try {
                setLoading(true)
                const data = await courseService.getAll()
                setCourses(data || [])
            } catch (error) {
                setServerError(error?.message || 'Ocurrió un error al cargar los cursos.')
                
            } finally {
                setLoading(false)
            }
        }
        loadCourses()
    }, [])

    const handleOpenCreate = () => {
        setEditingCourse(null)
        setFormData(INITIAL_FORM_STATE)
        setIsModalOpen(true)
        setErrors({})
        setServerError('')
    }

    const handleOpenEdit = (course) => {
        setEditingCourse(course)
        setFormData({ name: course.name, student_count: course.student_count })
        setIsModalOpen(true)
        setErrors({})
        setServerError('')
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCourse(null)
        setFormData(INITIAL_FORM_STATE)
        setErrors({})
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })

        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }))
    }

    const handleSubmit = async () => {
        const formErrors = validateCourseForm(formData)
        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors)
            return
        } 
        try {
            setSaving(true)
            setServerError('')
            if (editingCourse) {
                const updated = await courseService.update(editingCourse.id, formData)
                setCourses((prev) =>
                    prev.map((item) => (item.id === editingCourse.id ? (updated || { ...item, ...formData } ) : item))
                )
                setSuccessMessage('Curso actualizado correctamente.')
            } else {
                const created = await courseService.create(formData)
                setCourses((prev) => [...prev, created])
                setSuccessMessage('Curso creado correctamente.')
            }
            handleCloseModal()
        } catch (error) {
            setServerError(error?.message || 'Ocurrió un error al guardar el curso.')
            return
        } finally {
            setSaving(false)
        }
        
    }

    const handleView = (course) => {
        setSelectedCourse(course)
        setViewOpen(true)

    }

    const handleOpenDelete = (course) => {
        setCourseToDelete(course)
        setDeleteOpen(true)
        setDeleteError('')
    }

    const handleCloseDelete = () => {
        setDeleteOpen(false)
        setCourseToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!courseToDelete) return

        try {
            setDeleting(true)
            setDeleteError('')
            await courseService.destroy(courseToDelete.id)

            setCourses((prev) =>
                prev.filter((item) => item.id !== courseToDelete.id)
            )
            setSuccessMessage('Curso eliminado correctamente.')
            handleCloseDelete()
        } catch (error) {
            setDeleteError(
                error?.message || 'No se pudo eliminar el curso.'
            )
        } finally {
            setDeleting(false)
        }
    }

    const closeSuccess = () => {
        setSuccessMessage('')
    }

    return {
        courses,
        loading,
        successMessage,
        closeSuccess,
        formModal: {
            isOpen: isModalOpen,
            isEditing: Boolean(editingCourse),
            formData,
            errors,
            serverError,
            saving,
            onClose: handleCloseModal,
            onChange: handleChange,
            onSubmit: handleSubmit,
        },
        detailModal: {
            isOpen: viewOpen,
            course: selectedCourse,
            onClose: () => setViewOpen(false),
        },
        deleteModal: {
            isOpen: deleteOpen,
            course: courseToDelete,
            error: deleteError,
            loading: deleting,
            onClose: handleCloseDelete,
            onConfirm: handleConfirmDelete,
        },
        handleOpenCreate,
        handleOpenEdit,
        handleView,
        handleOpenDelete,
    }
}