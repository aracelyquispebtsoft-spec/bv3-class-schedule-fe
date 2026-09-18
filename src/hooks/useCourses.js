import { useState } from 'react'
import { coursesData } from '../data/dummy.data'

const INITIAL_FORM_STATE = { name: '', student_count: '' }

export function useCourses() {
    const [courses, setCourses] = useState(coursesData)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [formData, setFormData] = useState(INITIAL_FORM_STATE)

    const [viewOpen, setViewOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)

    const handleOpenCreate = () => {
        setEditingCourse(null)
        setFormData(INITIAL_FORM_STATE)
        setIsModalOpen(true)
    }

    const handleOpenEdit = (course) => {
        setEditingCourse(course)
        setFormData({ name: course.name, student_count: course.student_count })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingCourse(null)
        setFormData(INITIAL_FORM_STATE)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (editingCourse) {
        setCourses((prev) =>
            prev.map((item) => (item.id === editingCourse.id ? { ...item, ...formData } : item))
        )
        } else {
        setCourses((prev) => [...prev, { id: crypto.randomUUID(), ...formData }])
        }
        handleCloseModal()
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

    const handleConfirmDelete = () => {
        if (courseToDelete) {
        setCourses((prev) => prev.filter((item) => item.id !== courseToDelete.id))
        handleCloseDelete()
        }
    }

    return {
        courses,
        formModal: {
        isOpen: isModalOpen,
        isEditing: Boolean(editingCourse),
        formData,
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