import { useState, useEffect } from 'react'
import { coursesData } from '../data/dummy.data'
import { courseService } from '../services/course.service'
import { validateCourseForm } from '../utils/course.validations'

const INITIAL_FORM_STATE = { name: '', student_count: '' }

export function useCourses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [formData, setFormData] = useState(INITIAL_FORM_STATE)
    const [errors, setErrors] = useState({})

    const [viewOpen, setViewOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)

    useEffect(() => {
        const loadCourses = async () => { 
            try {
                setLoading(true)
                const data = await courseService.getAll()
                setCourses(data || [])
            } catch (error) {
                console.warn("API no disponible, usando datos de prueba.")
                await new Promise(r=>setTimeout(r,1000))
                setCourses(coursesData)
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
    }

    const handleOpenEdit = (course) => {
        setEditingCourse(course)
        setFormData({ name: course.name, student_count: course.student_count })
        setIsModalOpen(true)
        setErrors({})
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
            if (editingCourse) {
                const updated = await courseService.update(editingCourse.id, formData)
                setCourses((prev) =>
                    prev.map((item) => (item.id === editingCourse.id ? (updated || { ...item, ...formData } ) : item))
                )
            } else {
                const created = await courseService.create(formData)
                const newCouse = created || { id: crypto.randomUUID(), ...formData }
                setCourses((prev) => [...prev, newCouse])
            }
        } catch (error) {
            if (editingCourse) {
                setCourses((prev) =>
                prev.map((item) => (item.id === editingCourse.id ? { ...item, ...formData } : item))
                )
            } else {
                setCourses((prev) => [...prev, { id: crypto.randomUUID(), ...formData }])
            }
        } finally {
            handleCloseModal()
        }  
    }

    const handleView = (course) => {
        setSelectedCourse(course)
        setViewOpen(true)
    }

    const handleOpenDelete = (course) => {
        setCourseToDelete(course)
        setDeleteOpen(true)
    }

    const handleCloseDelete = () => {
        setDeleteOpen(false)
        setCourseToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (courseToDelete) {
            try {
                await courseService.destroy(courseToDelete.id)
            } catch (error) {
                console.warn("Error al eliminar en API, eliminando localmente.")
            } finally {
                setCourses((prev) => prev.filter((item) => item.id !== courseToDelete.id))
                handleCloseDelete()
            }     
        }
    }

    return {
        courses,
        loading,
        formModal: {
            isOpen: isModalOpen,
            isEditing: Boolean(editingCourse),
            formData,
            errors,
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
            onClose: handleCloseDelete,
            onConfirm: handleConfirmDelete,
        },
        handleOpenCreate,
        handleOpenEdit,
        handleView,
        handleOpenDelete,
    }
}